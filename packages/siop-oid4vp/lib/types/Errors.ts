enum SIOPErrors {
  // todo: INVALID_REQUEST mapping onto response conforming to spec
  INVALID_CLIENT_ID_MUST_MATCH_REDIRECT_URI = `Invalid request object payload. The redirect_uri must match the client_id with client_id_scheme 'redirect_uri'.`,
  INVALID_CLIENT_ID_MUST_MATCH_RESPONSE_URI = `Invalid request object payload. The response_uri must match the client_id with client_id_scheme 'redirect_uri'.`,
  INVALID_REQUEST = 'The request contained invalid or conflicting parameters',
  AUTH_REQUEST_EXPECTS_VP = 'authentication request expects a verifiable presentation in the response',
  AUTH_REQUEST_DOESNT_EXPECT_VP = "authentication request doesn't expect a verifiable presentation in the response",
  BAD_STATE = 'The state in the payload does not match the supplied state',
  BAD_NONCE = 'The nonce in the payload does not match the supplied nonce',
  NO_ALG_SUPPORTED = 'Algorithm not supported.',
  BAD_PARAMS = 'Wrong parameters provided.',
  BAD_IDTOKEN_RESPONSE_OPTS = 'Id-token response options are not set.',
  NO_REQUEST_VERSION = 'No request spec version provided.',
  NO_REQUEST = 'No request (payload) provided.',
  NO_RESPONSE = 'No response (payload) provided.',
  NO_PRESENTATION_SUBMISSION = 'The VP did not contain a presentation submission. Did you forget to call PresentationExchange.checkSubmissionFrom?',
  BAD_VERIFIER_ATTESTATION = 'Invalid verifier attestation. Bad JWT structure.',
  BAD_VERIFIER_ATTESTATION_REDIRECT_URIS = `Invalid verifier attestation. redirect_uri cannot be found in the the attestation jwts's redirect_uris.`,
  CREDENTIAL_FORMATS_NOT_SUPPORTED = 'CREDENTIAL_FORMATS_NOT_SUPPORTED',
  CREDENTIALS_FORMATS_NOT_PROVIDED = 'Credentials format not provided by RP/OP',
  COULD_NOT_FIND_VCS_MATCHING_PD = 'Could not find VerifiableCredentials matching presentationDefinition object in the provided VC list',
  DIDAUTH_REQUEST_PAYLOAD_NOT_CREATED = 'DidAuthRequestPayload not created',
  DID_METHODS_NOT_SUPORTED = 'DID_METHODS_NOT_SUPPORTED',
  ERROR_VERIFYING_SIGNATURE = 'Error verifying the DID Auth Token signature.',
  INVALID_JWT = 'Received an invalid JWT.',
  MISSING_X5C_HEADER_WITH_CLIENT_ID_SCHEME_X509 = `Missing x5c header with client_id_scheme 'x509_san_dns' | 'x509_san_uri'.`,
  MISSING_KID_HEADER_WITH_CLIENT_ID_SCHEME_DID = `Missing kid header with client_id_scheme 'did'.`,
  MISSING_ATTESTATION_JWT_WITH_CLIENT_ID_SCHEME_ATTESTATION = `Missing jwt header jwt with client_id_scheme 'verifier_attestation'.`,
  MISSING_ATTESTATION_JWT_TYP = `Attestation JWT missing typ 'verifier-attestation+jwt'.`,
  INVALID_CLIENT_ID_SCHEME = 'Invalid client_id_scheme.',
  INVALID_REQUEST_OBJECT_ENTITY_ID_SCHEME_CLIENT_ID = `Request Object uses client_id_scheme 'entity_id', but the client_id is not a string.`,
  EXPIRED = 'The token has expired',
  INVALID_AUDIENCE = 'Audience is invalid. Should be a string value.',
  NO_AUDIENCE = 'No audience found in JWT payload or not configured',
  NO_JWT = 'no JWT was supplied',
  NO_NONCE = 'No nonce found in JWT payload',
  NO_REFERENCE_URI = 'referenceUri must be defined when REFERENCE option is used',
  REFERENCE_URI_NO_PAYLOAD = 'referenceUri specified, but object to host there is not present',
  NO_SELF_ISSUED_ISS = 'The Response Token Issuer Claim (iss) MUST start with https://self-isued.me/v2',
  REGISTRATION_NOT_SET = 'Registration metadata not set.',
  REQUEST_CLAIMS_PRESENTATION_NON_EXCLUSIVE = "Request claims can't multiple of 'presentation_definition' and 'presentation_definition_uri' 'dcql_query",
  REQUEST_CLAIMS_PRESENTATION_DEFINITION_NOT_VALID = 'Presentation definition in the request claims is not valid',
  REQUEST_OBJECT_TYPE_NOT_SET = 'Request object type is not set.',
  RESPONSE_OPTS_PRESENTATIONS_SUBMISSION_IS_NOT_VALID = 'presentation_submission object inside the response opts vp should be valid',
  RESPONSE_STATUS_UNEXPECTED = 'Received unexpected response status',
  REG_OBJ_N_REG_URI_CANT_BE_SET_SIMULTANEOUSLY = 'Registration can either be passed by value or passed by reference. Hence, registration object and registration URI can not be set simultaneously',
  REG_OBJ_MALFORMED = 'The registration object is malformed.',
  REG_PASS_BY_REFERENCE_INCORRECTLY = 'Request error',
  REGISTRATION_OBJECT_TYPE_NOT_SET = 'Registration object type is not set.',
  SIOP_VERSION_NOT_SUPPORTED = 'The SIOP spec version could not inferred from the authentication request payload',
  NO_VERIFIABLE_PRESENTATION_NO_CREDENTIALS = 'Either no verifiable presentation or no credentials found in the verifiable presentation',
  VERIFY_BAD_PARAMS = 'Verify bad parameters',
  VERIFIABLE_PRESENTATION_SIGNATURE_NOT_VALID = 'The signature of the verifiable presentation is not valid',
  VERIFIABLE_PRESENTATION_VERIFICATION_FUNCTION_MISSING = 'The verifiable presentation verification function is missing',
  PRESENTATION_SUBMISSION_DEFINITION_ID_DOES_NOT_MATCHING_DEFINITION_ID = "The 'definition_id' in the presentation submission does not match the id of the presentation definition.",
}

export default SIOPErrors
