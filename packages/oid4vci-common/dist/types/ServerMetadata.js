"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WellKnownEndpoints = exports.authorizationServerMetadataFieldNames = void 0;
// These can be used be a reducer
exports.authorizationServerMetadataFieldNames = [
    'issuer',
    'authorization_endpoint',
    'token_endpoint',
    'jwks_uri',
    'registration_endpoint',
    'scopes_supported',
    'response_types_supported',
    'response_modes_supported',
    'grant_types_supported',
    'token_endpoint_auth_methods_supported',
    'token_endpoint_auth_signing_alg_values_supported',
    'service_documentation',
    'ui_locales_supported',
    'op_policy_uri',
    'op_tos_uri',
    'revocation_endpoint',
    'revocation_endpoint_auth_methods_supported',
    'revocation_endpoint_auth_signing_alg_values_supported',
    'introspection_endpoint',
    'introspection_endpoint_auth_methods_supported',
    'introspection_endpoint_auth_signing_alg_values_supported',
    'code_challenge_methods_supported',
    'signed_metadata'
];
var WellKnownEndpoints;
(function (WellKnownEndpoints) {
    WellKnownEndpoints["OPENID_CONFIGURATION"] = "/.well-known/openid-configuration";
    WellKnownEndpoints["OAUTH_AS"] = "/.well-known/oauth-authorization-server";
    WellKnownEndpoints["OPENID4VCI_ISSUER"] = "/.well-known/openid-credential-issuer";
})(WellKnownEndpoints || (exports.WellKnownEndpoints = WellKnownEndpoints = {}));
//# sourceMappingURL=ServerMetadata.js.map