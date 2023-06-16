import * as process from 'process'

import {
  Alg,
  ALG_ERROR,
  AUD_ERROR,
  CNonceState,
  CREDENTIAL_MISSING_ERROR,
  CredentialIssuerMetadataOpts,
  CredentialOfferFormat,
  CredentialOfferPayloadV1_0_11,
  CredentialOfferSession,
  CredentialOfferV1_0_11,
  CredentialRequestV1_0_11,
  CredentialResponse,
  Grant,
  IAT_ERROR,
  ISSUER_CONFIG_ERROR,
  IssuerCredentialDefinition,
  IssueStatus,
  IStateManager,
  Jwt,
  JWT_VERIFY_CONFIG_ERROR,
  JWTVerifyCallback,
  NO_ISS_IN_AUTHORIZATION_CODE_CONTEXT,
  OID4VCICredentialFormat,
  OpenId4VCIVersion,
  TokenErrorResponse,
  toUniformCredentialOfferRequest,
  TYP_ERROR,
  UniformCredentialRequest,
  URIState,
} from '@sphereon/oid4vci-common'
import { ICredential, W3CVerifiableCredential } from '@sphereon/ssi-types'
import { v4 } from 'uuid'

import { assertValidPinNumber, createCredentialOfferObject, createCredentialOfferURIFromObject } from './functions'
import { LookupStateManager } from './state-manager'
import { CredentialDataSupplier, CredentialSignerCallback } from './types'

const SECOND = 1000

export class VcIssuer {
  private readonly _issuerMetadata: CredentialIssuerMetadataOpts
  private readonly _userPinRequired: boolean
  private readonly _defaultCredentialOfferBaseUri?: string
  private readonly _credentialSignerCallback?: CredentialSignerCallback
  private readonly _jwtVerifyCallback?: JWTVerifyCallback
  private readonly _credentialDataSupplier?: CredentialDataSupplier
  private readonly _credentialOfferSessions: IStateManager<CredentialOfferSession>
  private readonly _cNonces: IStateManager<CNonceState>
  private readonly _uris?: IStateManager<URIState>
  private readonly _cNonceExpiresIn: number

  constructor(
    issuerMetadata: CredentialIssuerMetadataOpts,
    args: {
      userPinRequired?: boolean
      baseUri?: string
      credentialOfferSessions: IStateManager<CredentialOfferSession>
      defaultCredentialOfferBaseUri?: string
      cNonces: IStateManager<CNonceState>
      uris?: IStateManager<URIState>
      credentialSignerCallback?: CredentialSignerCallback
      jwtVerifyCallback?: JWTVerifyCallback
      credentialDataSupplier?: CredentialDataSupplier
      cNonceExpiresIn?: number | undefined // expiration duration in seconds
    }
  ) {
    this._issuerMetadata = issuerMetadata
    this._defaultCredentialOfferBaseUri = args.defaultCredentialOfferBaseUri
    this._credentialOfferSessions = args.credentialOfferSessions
    this._cNonces = args.cNonces
    this._uris = args.uris
    this._userPinRequired = args?.userPinRequired ?? false
    this._credentialSignerCallback = args?.credentialSignerCallback
    this._jwtVerifyCallback = args?.jwtVerifyCallback
    this._credentialDataSupplier = args?.credentialDataSupplier
    this._cNonceExpiresIn =
      ((args?.cNonceExpiresIn ?? (process.env.C_NONCE_EXPIRES_IN ? parseInt(process.env.C_NONCE_EXPIRES_IN) : 300)) as number) * SECOND
  }

  public getCredentialOfferSessionById(id: string): Promise<CredentialOfferSession> {
    if (!this.uris) {
      throw Error('Cannot lookup credential offer by id if URI state manager is not set')
    }
    return new LookupStateManager<URIState, CredentialOfferSession>(this.uris, this._credentialOfferSessions, 'uri').getAsserted(id)
  }

  public async createCredentialOfferURI(opts: {
    grants?: Grant
    credentials?: (CredentialOfferFormat | string)[]
    credentialDefinition?: IssuerCredentialDefinition
    credentialOfferUri?: string
    baseUri?: string
    scheme?: string
    pinLength?: number
  }): Promise<string> {
    let preAuthorizedCode: string | undefined = undefined
    let issuerState: string | undefined = undefined

    const { grants, credentials, credentialDefinition } = opts

    if (!grants?.authorization_code && !grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']) {
      throw Error(`No grant issuer state or pre-authorized code could be deduced`)
    }
    const credentialOfferPayload: CredentialOfferPayloadV1_0_11 = {
      ...(grants && { grants }),
      ...(credentials && { credentials }),
      ...(credentialDefinition && { credential_definition: credentialDefinition }),
      credential_issuer: this.issuerMetadata.credential_issuer,
    } as CredentialOfferPayloadV1_0_11
    if (grants?.authorization_code) {
      issuerState = grants?.authorization_code.issuer_state
      if (!issuerState) {
        issuerState = v4()
        grants.authorization_code.issuer_state = issuerState
      }
    }

    let userPinRequired: boolean | undefined
    if (grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']) {
      preAuthorizedCode = grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.['pre-authorized_code']
      userPinRequired = grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.user_pin_required
      if (userPinRequired === undefined) {
        userPinRequired = false
        grants['urn:ietf:params:oauth:grant-type:pre-authorized_code'].user_pin_required = userPinRequired
      }
      if (!preAuthorizedCode) {
        preAuthorizedCode = v4()
        grants['urn:ietf:params:oauth:grant-type:pre-authorized_code']['pre-authorized_code'] = preAuthorizedCode
      }
    }

    const baseUri = opts?.baseUri ?? this.defaultCredentialOfferBaseUri
    const credentialOfferObject = createCredentialOfferObject(this._issuerMetadata, {
      ...opts,
      credentialOffer: credentialOfferPayload,
      baseUri,
      userPinRequired,
      preAuthorizedCode,
      issuerState,
    })

    let userPin: string | undefined
    // todo: Double check this can only happen in pre-auth flow and if so make sure to not do the below when in a state is present (authorized flow)
    if (userPinRequired) {
      const pinLength = opts.pinLength ?? 4

      userPin = ('' + Math.round((Math.pow(10, pinLength) - 1) * Math.random())).padStart(pinLength, '0')
      assertValidPinNumber(userPin)
    }
    const createdAt = +new Date()
    const lastUpdatedAt = createdAt
    if (opts?.credentialOfferUri) {
      if (!this.uris) {
        throw Error('No URI state manager set, whilst apparently credential offer URIs are being used')
      }
      this.uris.set(opts.credentialOfferUri, {
        uri: opts.credentialOfferUri,
        createdAt: createdAt,
        preAuthorizedCode,
        issuerState,
      })
    }

    const credentialOffer = await toUniformCredentialOfferRequest(
      {
        credential_offer: credentialOfferObject.credential_offer,
        credential_offer_uri: credentialOfferObject.credential_offer_uri,
      } as CredentialOfferV1_0_11,
      {
        version: OpenId4VCIVersion.VER_1_0_11,
        resolve: false, // We are creating the object, so do not resolve
      }
    )

    const status = IssueStatus.OFFER_CREATED
    const session = {
      preAuthorizedCode,
      issuerState,
      createdAt,
      lastUpdatedAt,
      status,
      ...(userPin && { userPin }),
      credentialOffer,
    }

    if (preAuthorizedCode) {
      this.credentialOfferSessions.set(preAuthorizedCode, session)
    }
    // todo: check whether we could have the same value for issuer state and pre auth code if both are supported.
    if (issuerState) {
      this.credentialOfferSessions.set(issuerState, session)
    }
    return createCredentialOfferURIFromObject(credentialOffer, { ...opts, baseUri })
  }

  /**
   * issueCredentialFromIssueRequest
   * @param opts issuerRequestParams
   *  - issueCredentialsRequest the credential request
   *  - issuerState the state of the issuer
   *  - jwtVerifyCallback callback that verifies the Proof of Possession JWT
   *  - issuerCallback callback to issue a Verifiable Credential
   *  - cNonce an existing c_nonce
   */
  public async issueCredential(opts: {
    credentialRequest: CredentialRequestV1_0_11
    credential?: ICredential
    credentialDataSupplier?: CredentialDataSupplier
    newCNonce?: string
    cNonceExpiresIn?: number
    tokenExpiresIn?: number
    jwtVerifyCallback?: JWTVerifyCallback
    credentialSignerCallback?: CredentialSignerCallback
    responseCNonce?: string
  }): Promise<CredentialResponse> {
    let preAuthorizedCode: string | undefined
    let issuerState: string | undefined
    try {
      if (!this.isMetadataSupportCredentialRequestFormat(opts.credentialRequest.format)) {
        throw new Error(TokenErrorResponse.invalid_request)
      }
      const validated = await this.validateCredentialRequestProof({
        ...opts,
        tokenExpiresIn: opts.tokenExpiresIn ?? 180000,
      })
      preAuthorizedCode = validated.preAuthorizedCode
      issuerState = validated.issuerState

      const { preAuthSession, authSession, cNonceState } = validated
      const newcNonce = opts.newCNonce ? opts.newCNonce : v4()
      const newcNonceState = {
        cNonce: newcNonce,
        createdAt: +new Date(),
        ...(authSession?.issuerState && { issuerState: authSession.issuerState }),
        ...(preAuthSession && { preAuthorizedCode: preAuthSession.preAuthorizedCode }),
      }
      await this.cNonces.set(newcNonce, newcNonceState)
      if (!opts.credential && this._credentialDataSupplier === undefined && opts.credentialDataSupplier === undefined) {
        throw Error(`Either a credential needs to be supplied or a credentialDataSupplier`)
      }
      let credential: ICredential | undefined
      let format: OID4VCICredentialFormat = opts.credentialRequest.format
      let signerCallback: CredentialSignerCallback | undefined = opts.credentialSignerCallback
      if (opts.credential) {
        credential = opts.credential
      } else {
        const credentialDataSupplier: CredentialDataSupplier | undefined =
          typeof opts.credentialDataSupplier === 'function' ? opts.credentialDataSupplier : this._credentialDataSupplier
        if (typeof credentialDataSupplier !== 'function') {
          throw Error('Data supplier is mandatory if no credential is supplied')
        }
        const credentialOffer = preAuthorizedCode && preAuthSession ? preAuthSession.credentialOffer : authSession?.credentialOffer
        if (!credentialOffer) {
          throw Error('Credential Offer missing')
        }
        const result = await credentialDataSupplier({
          ...cNonceState,
          credentialRequest: opts.credentialRequest,
          credentialOffer /*todo: clientId: */,
        })
        credential = result.credential
        if (result.format) {
          format = result.format
        }
        if (typeof result.callback === 'function') {
          signerCallback = result.callback
        }
      }
      if (!credential) {
        throw Error('A credential needs to be supplied at this point')
      }

      const verifiableCredential = await this.issueCredentialImpl(
        {
          credentialRequest: opts.credentialRequest,
          format,
          credential,
        },
        signerCallback
      )
      // TODO implement acceptance_token (deferred response)
      // TODO update verification accordingly
      if (!verifiableCredential) {
        // credential: OPTIONAL. Contains issued Credential. MUST be present when acceptance_token is not returned. MAY be a JSON string or a JSON object, depending on the Credential format. See Appendix E for the Credential format specific encoding requirements
        throw new Error(CREDENTIAL_MISSING_ERROR)
      }
      // remove the previous nonce
      this.cNonces.delete(cNonceState.cNonce)

      if (preAuthorizedCode && preAuthSession) {
        preAuthSession.lastUpdatedAt = +new Date()
        preAuthSession.status = IssueStatus.CREDENTIAL_REQUEST_RECEIVED
        this._credentialOfferSessions.set(preAuthorizedCode, preAuthSession)
      } else if (issuerState && authSession) {
        // If both were set we used the pre auth flow above as well, hence the else if
        authSession.lastUpdatedAt = +new Date()
        authSession.status = IssueStatus.CREDENTIAL_REQUEST_RECEIVED
        this._credentialOfferSessions.set(issuerState, authSession)
      }

      return {
        credential: verifiableCredential,
        format: opts.credentialRequest.format,
        c_nonce: newcNonce,
        c_nonce_expires_in: this._cNonceExpiresIn,
      }
    } catch (error: unknown) {
      await this.updateErrorStatus({ preAuthorizedCode, issuerState, error })
      throw error
    }
  }

  private async updateErrorStatus({
    preAuthorizedCode,
    error,
    issuerState,
  }: {
    preAuthorizedCode: string | undefined
    issuerState: string | undefined
    error: unknown
  }) {
    if (preAuthorizedCode) {
      const preAuthSession = await this._credentialOfferSessions.get(preAuthorizedCode)
      if (preAuthSession) {
        preAuthSession.lastUpdatedAt = +new Date()
        preAuthSession.status = IssueStatus.ERROR
        preAuthSession.error = error instanceof Error ? error.message : error?.toString()
        this._credentialOfferSessions.set(preAuthorizedCode, preAuthSession)
      }
    }
    if (issuerState) {
      const authSession = await this._credentialOfferSessions.get(issuerState)
      if (authSession) {
        authSession.lastUpdatedAt = +new Date()
        authSession.status = IssueStatus.ERROR
        authSession.error = error instanceof Error ? error.message : error?.toString()
        this._credentialOfferSessions.set(issuerState, authSession)
      }
    }
  }

  /*
    private async retrieveGrantsAndCredentialOfferSession(id: string): Promise<{
      clientId?: string;
      grants?: Grant,
      session: CredentialOfferSession
    }> {
      const session: CredentialOfferSession | undefined = await this._credentialOfferSessions.getAsserted(id)
      const clientId = session?.clientId
      const grants = session?.credentialOffer?.credential_offer?.grants
      if (!grants?.authorization_code?.issuer_state && !grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.['pre-authorized_code']) {
        throw new Error(GRANTS_MUST_NOT_BE_UNDEFINED)
      }
      return { session, clientId, grants }
    }*/

  private async validateCredentialRequestProof({
    credentialRequest,
    jwtVerifyCallback,
    tokenExpiresIn,
  }: {
    credentialRequest: UniformCredentialRequest
    tokenExpiresIn: number
    // grants?: Grant,
    clientId?: string
    jwtVerifyCallback?: JWTVerifyCallback
  }) {
    let preAuthorizedCode: string | undefined
    let issuerState: string | undefined
    try {
      if (credentialRequest.format !== 'jwt_vc_json' && credentialRequest.format !== 'jwt_vc_json-ld') {
        throw Error(`Format ${credentialRequest.format} not supported yet`)
      } else if (typeof this._jwtVerifyCallback !== 'function' && typeof jwtVerifyCallback !== 'function') {
        throw new Error(JWT_VERIFY_CONFIG_ERROR)
      } else if (!credentialRequest.proof) {
        throw Error('Proof of possession is required. No proof value present in credential request')
      }

      const { payload, header }: Jwt = jwtVerifyCallback
        ? await jwtVerifyCallback(credentialRequest.proof)
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await this._jwtVerifyCallback!(credentialRequest.proof)

      const { iss, aud, iat, nonce } = payload
      if (!nonce) {
        throw Error('No nonce was found in the Proof of Possession')
      }
      const cNonceState = await this.cNonces.getAsserted(nonce)
      preAuthorizedCode = cNonceState.preAuthorizedCode
      issuerState = cNonceState.issuerState
      const createdAt = cNonceState.createdAt

      const { typ, alg, kid, jwk, x5c } = header

      if (typ !== 'openid4vci-proof+jwt') {
        console.log(typ)
        throw new Error(TYP_ERROR)
      } else if (!alg || !(alg in Alg)) {
        throw new Error(ALG_ERROR)
      } else if (!([kid, jwk, x5c].filter((x) => !!x).length === 1)) {
        // throw new Error(KID_JWK_X5C_ERROR) // todo: whut. An x5c is very specific to X509 certs only
      }

      const preAuthSession = preAuthorizedCode ? await this.credentialOfferSessions.get(preAuthorizedCode) : undefined
      const authSession = issuerState ? await this.credentialOfferSessions.get(issuerState) : undefined
      if (!preAuthSession && !authSession) {
        throw Error('Either a pre-authorized code or issuer state needs to be present')
      }
      if (preAuthSession) {
        if (!preAuthSession.preAuthorizedCode || preAuthSession.preAuthorizedCode !== preAuthorizedCode) {
          throw Error('Invalid pre-authorized code')
        }
        preAuthSession.lastUpdatedAt = +new Date()
        preAuthSession.status = IssueStatus.CREDENTIAL_REQUEST_RECEIVED
        this._credentialOfferSessions.set(preAuthorizedCode, preAuthSession)
      }
      if (authSession) {
        if (!authSession.issuerState || authSession.issuerState !== issuerState) {
          throw Error('Invalid issuer state')
        }
        authSession.lastUpdatedAt = +new Date()
        authSession.status = IssueStatus.CREDENTIAL_REQUEST_RECEIVED
      }

      // https://www.rfc-editor.org/rfc/rfc6749.html#section-3.2.1
      // A client MAY use the "client_id" request parameter to identify itself
      // when sending requests to the token endpoint.  In the
      // "authorization_code" "grant_type" request to the token endpoint, an
      // unauthenticated client MUST send its "client_id" to prevent itself
      // from inadvertently accepting a code intended for a client with a
      // different "client_id".  This protects the client from substitution of
      // the authentication code.  (It provides no additional security for the
      // protected resource.)
      if (!iss && authSession?.credentialOffer.credential_offer?.grants?.authorization_code) {
        throw new Error(NO_ISS_IN_AUTHORIZATION_CODE_CONTEXT)
      }
      // iss: OPTIONAL (string). The value of this claim MUST be the client_id of the client making the credential request.
      // This claim MUST be omitted if the Access Token authorizing the issuance call was obtained from a Pre-Authorized Code Flow through anonymous access to the Token Endpoint.
      // TODO We need to investigate further what the comment above means, because it's not clear if the client or the user may be authorized anonymously
      // if (iss && grants && grants['urn:ietf:params:oauth:grant-type:pre-authorized_code']) {
      //   throw new Error(ISS_PRESENT_IN_PRE_AUTHORIZED_CODE_CONTEXT)
      // }
      /*if (iss && iss !== clientId) {
        throw new Error(ISS_MUST_BE_CLIENT_ID + `iss: ${iss}, client_id: ${clientId}`)
      }*/
      if (!aud || aud !== this._issuerMetadata.credential_issuer) {
        throw new Error(AUD_ERROR)
      }
      if (!iat) {
        throw new Error(IAT_ERROR)
      } else if (iat > createdAt + tokenExpiresIn) {
        throw new Error(IAT_ERROR)
      }
      // todo: Add a check of iat against current TS on server with a skew

      return { jwt: { header, payload } as Jwt, preAuthorizedCode, preAuthSession, issuerState, authSession, cNonceState }
    } catch (error: unknown) {
      await this.updateErrorStatus({ preAuthorizedCode, issuerState, error })
      throw error
    }
  }

  private isMetadataSupportCredentialRequestFormat(requestFormat: string | string[]): boolean {
    for (const credentialSupported of this._issuerMetadata.credentials_supported) {
      if (!Array.isArray(requestFormat) && credentialSupported.format === requestFormat) {
        return true
      } else if (Array.isArray(requestFormat)) {
        for (const format of requestFormat as string[]) {
          if (credentialSupported.format === format) {
            return true
          }
        }
      }
    }
    return false
  }

  private async issueCredentialImpl(
    opts: { credentialRequest: UniformCredentialRequest; credential: ICredential; format?: OID4VCICredentialFormat },
    issuerCallback?: CredentialSignerCallback
  ): Promise<W3CVerifiableCredential> {
    if ((!opts.credential && !opts.credentialRequest) || !this._credentialSignerCallback) {
      throw new Error(ISSUER_CONFIG_ERROR)
    }
    return issuerCallback ? await issuerCallback(opts) : this._credentialSignerCallback(opts)
  }

  get userPinRequired(): boolean {
    return this._userPinRequired
  }

  get credentialSignerCallback(): CredentialSignerCallback | undefined {
    return this._credentialSignerCallback
  }

  get jwtVerifyCallback(): JWTVerifyCallback | undefined {
    return this._jwtVerifyCallback
  }

  get credentialDataSupplier(): CredentialDataSupplier | undefined {
    return this._credentialDataSupplier
  }

  get uris(): IStateManager<URIState> | undefined {
    return this._uris
  }

  get cNonceExpiresIn(): number {
    return this._cNonceExpiresIn
  }

  public get credentialOfferSessions(): IStateManager<CredentialOfferSession> {
    return this._credentialOfferSessions
  }

  public get cNonces(): IStateManager<CNonceState> {
    return this._cNonces
  }

  get defaultCredentialOfferBaseUri(): string | undefined {
    return this._defaultCredentialOfferBaseUri
  }

  public get issuerMetadata() {
    return this._issuerMetadata
  }
}
