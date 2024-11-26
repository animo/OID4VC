import { AuthorizationServerMetadata, CNonceState, CreateCredentialOfferURIResult, CredentialDataSupplierInput, CredentialIssuerMetadataOptsV1_0_13, CredentialOfferSession, CredentialRequest, CredentialResponse, IStateManager, JsonLdIssuerCredentialDefinition, JWTVerifyCallback, QRCodeOpts, TxCode, URIState } from '@sphereon/oid4vci-common';
import { CredentialOfferGrantInput } from './functions';
import { CredentialDataSupplier, CredentialIssuanceInput, CredentialSignerCallback } from './types';
export declare class VcIssuer<DIDDoc extends object> {
    private readonly _issuerMetadata;
    private readonly _authorizationServerMetadata;
    private readonly _defaultCredentialOfferBaseUri?;
    private readonly _credentialSignerCallback?;
    private readonly _jwtVerifyCallback?;
    private readonly _credentialDataSupplier?;
    private readonly _credentialOfferSessions;
    private readonly _cNonces;
    private readonly _uris?;
    private readonly _cNonceExpiresIn;
    constructor(issuerMetadata: CredentialIssuerMetadataOptsV1_0_13, authorizationServerMetadata: AuthorizationServerMetadata, args: {
        txCode?: TxCode;
        baseUri?: string;
        credentialOfferSessions: IStateManager<CredentialOfferSession>;
        defaultCredentialOfferBaseUri?: string;
        cNonces: IStateManager<CNonceState>;
        uris?: IStateManager<URIState>;
        credentialSignerCallback?: CredentialSignerCallback<DIDDoc>;
        jwtVerifyCallback?: JWTVerifyCallback<DIDDoc>;
        credentialDataSupplier?: CredentialDataSupplier;
        cNonceExpiresIn?: number | undefined;
    });
    getCredentialOfferSessionById(id: string): Promise<CredentialOfferSession>;
    createCredentialOfferURI(opts: {
        grants?: CredentialOfferGrantInput;
        credential_configuration_ids?: Array<string>;
        credentialDefinition?: JsonLdIssuerCredentialDefinition;
        credentialOfferUri?: string;
        credentialDataSupplierInput?: CredentialDataSupplierInput;
        baseUri?: string;
        scheme?: string;
        pinLength?: number;
        qrCodeOpts?: QRCodeOpts;
    }): Promise<CreateCredentialOfferURIResult>;
    /**
     * issueCredentialFromIssueRequest
     * @param opts issuerRequestParams
     *  - issueCredentialsRequest the credential request
     *  - issuerState the state of the issuer
     *  - jwtVerifyCallback callback that verifies the Proof of Possession JWT
     *  - issuerCallback callback to issue a Verifiable Credential
     *  - cNonce an existing c_nonce
     */
    issueCredential(opts: {
        credentialRequest: CredentialRequest;
        credential?: CredentialIssuanceInput;
        credentialDataSupplier?: CredentialDataSupplier;
        credentialDataSupplierInput?: CredentialDataSupplierInput;
        newCNonce?: string;
        cNonceExpiresIn?: number;
        tokenExpiresIn?: number;
        jwtVerifyCallback?: JWTVerifyCallback<DIDDoc>;
        credentialSignerCallback?: CredentialSignerCallback<DIDDoc>;
        responseCNonce?: string;
    }): Promise<CredentialResponse>;
    private updateErrorStatus;
    private validateCredentialRequestProof;
    private isMetadataSupportCredentialRequestFormat;
    private issueCredentialImpl;
    private setDefaultTokenEndpoint;
    get credentialSignerCallback(): CredentialSignerCallback<DIDDoc> | undefined;
    get jwtVerifyCallback(): JWTVerifyCallback<DIDDoc> | undefined;
    get credentialDataSupplier(): CredentialDataSupplier | undefined;
    get uris(): IStateManager<URIState> | undefined;
    get cNonceExpiresIn(): number;
    get credentialOfferSessions(): IStateManager<CredentialOfferSession>;
    get cNonces(): IStateManager<CNonceState>;
    get defaultCredentialOfferBaseUri(): string | undefined;
    get issuerMetadata(): CredentialIssuerMetadataOptsV1_0_13;
    get authorizationServerMetadata(): AuthorizationServerMetadata;
}
//# sourceMappingURL=VcIssuer.d.ts.map