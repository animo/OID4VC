"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SIOPErrors;
(function (SIOPErrors) {
    // todo: INVALID_REQUEST mapping onto response conforming to spec
    SIOPErrors["INVALID_CLIENT_ID_MUST_MATCH_REDIRECT_URI"] = "Invalid request object payload. The redirect_uri must match the client_id with client_id_scheme 'redirect_uri'.";
    SIOPErrors["INVALID_CLIENT_ID_MUST_MATCH_RESPONSE_URI"] = "Invalid request object payload. The response_uri must match the client_id with client_id_scheme 'redirect_uri'.";
    SIOPErrors["INVALID_REQUEST"] = "The request contained invalid or conflicting parameters";
    SIOPErrors["AUTH_REQUEST_EXPECTS_VP"] = "authentication request expects a verifiable presentation in the response";
    SIOPErrors["AUTH_REQUEST_DOESNT_EXPECT_VP"] = "authentication request doesn't expect a verifiable presentation in the response";
    SIOPErrors["BAD_STATE"] = "The state in the payload does not match the supplied state";
    SIOPErrors["BAD_NONCE"] = "The nonce in the payload does not match the supplied nonce";
    SIOPErrors["NO_ALG_SUPPORTED"] = "Algorithm not supported.";
    SIOPErrors["BAD_PARAMS"] = "Wrong parameters provided.";
    SIOPErrors["BAD_IDTOKEN_RESPONSE_OPTS"] = "Id-token response options are not set.";
    SIOPErrors["NO_REQUEST_VERSION"] = "No request spec version provided.";
    SIOPErrors["NO_REQUEST"] = "No request (payload) provided.";
    SIOPErrors["NO_RESPONSE"] = "No response (payload) provided.";
    SIOPErrors["NO_PRESENTATION_SUBMISSION"] = "The VP did not contain a presentation submission. Did you forget to call PresentationExchange.checkSubmissionFrom?";
    SIOPErrors["BAD_VERIFIER_ATTESTATION"] = "Invalid verifier attestation. Bad JWT structure.";
    SIOPErrors["BAD_VERIFIER_ATTESTATION_REDIRECT_URIS"] = "Invalid verifier attestation. redirect_uri cannot be found in the the attestation jwts's redirect_uris.";
    SIOPErrors["CREDENTIAL_FORMATS_NOT_SUPPORTED"] = "CREDENTIAL_FORMATS_NOT_SUPPORTED";
    SIOPErrors["CREDENTIALS_FORMATS_NOT_PROVIDED"] = "Credentials format not provided by RP/OP";
    SIOPErrors["COULD_NOT_FIND_VCS_MATCHING_PD"] = "Could not find VerifiableCredentials matching presentationDefinition object in the provided VC list";
    SIOPErrors["DIDAUTH_REQUEST_PAYLOAD_NOT_CREATED"] = "DidAuthRequestPayload not created";
    SIOPErrors["DID_METHODS_NOT_SUPORTED"] = "DID_METHODS_NOT_SUPPORTED";
    SIOPErrors["ERROR_VERIFYING_SIGNATURE"] = "Error verifying the DID Auth Token signature.";
    SIOPErrors["INVALID_JWT"] = "Received an invalid JWT.";
    SIOPErrors["MISSING_X5C_HEADER_WITH_CLIENT_ID_SCHEME_X509"] = "Missing x5c header with client_id_scheme 'x509_san_dns' | 'x509_san_uri'.";
    SIOPErrors["MISSING_KID_HEADER_WITH_CLIENT_ID_SCHEME_DID"] = "Missing kid header with client_id_scheme 'did'.";
    SIOPErrors["MISSING_ATTESTATION_JWT_WITH_CLIENT_ID_SCHEME_ATTESTATION"] = "Missing jwt header jwt with client_id_scheme 'verifier_attestation'.";
    SIOPErrors["MISSING_ATTESTATION_JWT_TYP"] = "Attestation JWT missing typ 'verifier-attestation+jwt'.";
    SIOPErrors["INVALID_CLIENT_ID_SCHEME"] = "Invalid client_id_scheme.";
    SIOPErrors["INVALID_REQUEST_OBJECT_ENTITY_ID_SCHEME_CLIENT_ID"] = "Request Object uses client_id_scheme 'entity_id', but the entity_id is missing or not an https endpoint.";
    SIOPErrors["EXPIRED"] = "The token has expired";
    SIOPErrors["INVALID_AUDIENCE"] = "Audience is invalid. Should be a string value.";
    SIOPErrors["NO_AUDIENCE"] = "No audience found in JWT payload or not configured";
    SIOPErrors["NO_JWT"] = "no JWT was supplied";
    SIOPErrors["NO_NONCE"] = "No nonce found in JWT payload";
    SIOPErrors["NO_REFERENCE_URI"] = "referenceUri must be defined when REFERENCE option is used";
    SIOPErrors["REFERENCE_URI_NO_PAYLOAD"] = "referenceUri specified, but object to host there is not present";
    SIOPErrors["NO_SELF_ISSUED_ISS"] = "The Response Token Issuer Claim (iss) MUST start with https://self-isued.me/v2";
    SIOPErrors["REGISTRATION_NOT_SET"] = "Registration metadata not set.";
    SIOPErrors["REQUEST_CLAIMS_PRESENTATION_NON_EXCLUSIVE"] = "Request claims can't have multiple of 'presentation_definition', 'presentation_definition_uri' and 'dcql_query";
    SIOPErrors["REQUEST_CLAIMS_PRESENTATION_DEFINITION_NOT_VALID"] = "Presentation definition in the request claims is not valid";
    SIOPErrors["REQUEST_OBJECT_TYPE_NOT_SET"] = "Request object type is not set.";
    SIOPErrors["RESPONSE_OPTS_PRESENTATIONS_SUBMISSION_IS_NOT_VALID"] = "presentation_submission object inside the response opts vp should be valid";
    SIOPErrors["RESPONSE_STATUS_UNEXPECTED"] = "Received unexpected response status";
    SIOPErrors["REG_OBJ_N_REG_URI_CANT_BE_SET_SIMULTANEOUSLY"] = "Registration can either be passed by value or passed by reference. Hence, registration object and registration URI can not be set simultaneously";
    SIOPErrors["REG_OBJ_MALFORMED"] = "The registration object is malformed.";
    SIOPErrors["REG_PASS_BY_REFERENCE_INCORRECTLY"] = "Request error";
    SIOPErrors["REGISTRATION_OBJECT_TYPE_NOT_SET"] = "Registration object type is not set.";
    SIOPErrors["SIOP_VERSION_NOT_SUPPORTED"] = "The SIOP spec version could not inferred from the authentication request payload";
    SIOPErrors["NO_VERIFIABLE_PRESENTATION_NO_CREDENTIALS"] = "Either no verifiable presentation or no credentials found in the verifiable presentation";
    SIOPErrors["VERIFY_BAD_PARAMS"] = "Verify bad parameters";
    SIOPErrors["VERIFIABLE_PRESENTATION_SIGNATURE_NOT_VALID"] = "The signature of the verifiable presentation is not valid";
    SIOPErrors["VERIFIABLE_PRESENTATION_VERIFICATION_FUNCTION_MISSING"] = "The verifiable presentation verification function is missing";
    SIOPErrors["PRESENTATION_SUBMISSION_DEFINITION_ID_DOES_NOT_MATCHING_DEFINITION_ID"] = "The 'definition_id' in the presentation submission does not match the id of the presentation definition.";
})(SIOPErrors || (SIOPErrors = {}));
exports.default = SIOPErrors;
//# sourceMappingURL=Errors.js.map