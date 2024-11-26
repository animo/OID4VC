import { DynamicRegistrationClientMetadata, SigningAlgo } from '@sphereon/oid4vc-common';
export type OAuthResponseType = 'code' | 'token' | 'id_token' | 'code token' | 'code id_token' | 'token id_token' | 'code token id_token';
export type TokenEndpointAuthMethod = 'client_secret_basic' | 'client_secret_post' | 'client_secret_jwt' | 'private_key_jwt' | 'none';
export type TokenEndpointAuthSigningAlg = 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'PS256' | 'PS384' | 'PS512' | 'HS256' | 'HS384' | 'HS512';
export type OAuthScope = 'openid' | 'profile' | 'email' | 'address' | 'phone' | 'offline_access';
export type OAuthResponseMode = 'query' | 'fragment' | 'form_post';
export type OAuthGrantType = 'authorization_code' | 'implicit' | 'password' | 'client_credentials' | 'refresh_token' | 'urn:ietf:params:oauth:grant-type:device_code' | 'urn:ietf:params:oauth:grant-type:saml2-bearer' | 'urn:ietf:params:oauth:grant-type:jwt-bearer';
export type RevocationEndpointAuthMethod = 'client_secret_basic' | 'client_secret_post' | 'client_secret_jwt' | 'private_key_jwt' | 'none';
export type RevocationEndpointAuthSigningAlg = 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'PS256' | 'PS384' | 'PS512' | 'HS256' | 'HS384' | 'HS512';
export type PKCECodeChallengeMethod = 'plain' | 'S256';
export interface AuthorizationServerMetadata extends DynamicRegistrationClientMetadata {
    issuer: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    token_endpoint_auth_methods_supported?: Array<TokenEndpointAuthMethod>;
    token_endpoint_auth_signing_alg_values_supported?: Array<TokenEndpointAuthSigningAlg>;
    registration_endpoint?: string;
    scopes_supported?: Array<OAuthScope | string>;
    response_types_supported: Array<OAuthResponseType>;
    response_modes_supported?: Array<OAuthResponseMode>;
    grant_types_supported?: Array<OAuthGrantType>;
    service_documentation?: string;
    ui_locales_supported?: string[];
    op_policy_uri?: string;
    op_tos_uri?: string;
    revocation_endpoint?: string;
    revocation_endpoint_auth_methods_supported?: Array<RevocationEndpointAuthMethod>;
    revocation_endpoint_auth_signing_alg_values_supported?: Array<RevocationEndpointAuthSigningAlg>;
    introspection_endpoint?: string;
    code_challenge_methods_supported?: Array<PKCECodeChallengeMethod>;
    pushed_authorization_request_endpoint?: string;
    require_pushed_authorization_requests?: boolean;
    'pre-authorized_grant_anonymous_access_supported': boolean;
    dpop_signing_alg_values_supported?: (string | SigningAlgo)[];
    frontchannel_logout_supported?: boolean;
    frontchannel_logout_session_supported?: boolean;
    backchannel_logout_supported?: boolean;
    backchannel_logout_session_supported?: boolean;
    userinfo_endpoint?: string;
    check_session_iframe?: string;
    end_session_endpoint?: string;
    acr_values_supported?: string[];
    subject_types_supported?: string[];
    request_object_signing_alg_values_supported?: string[];
    display_values_supported?: string[];
    claim_types_supported?: string[];
    claims_supported?: string[];
    claims_parameter_supported?: boolean;
    credential_endpoint?: string;
    deferred_credential_endpoint?: string;
    [x: string]: any;
}
export declare const authorizationServerMetadataFieldNames: Array<keyof AuthorizationServerMetadata>;
export declare enum WellKnownEndpoints {
    OPENID_CONFIGURATION = "/.well-known/openid-configuration",
    OAUTH_AS = "/.well-known/oauth-authorization-server",
    OPENID4VCI_ISSUER = "/.well-known/openid-credential-issuer"
}
export type AuthorizationServerType = 'OIDC' | 'OAuth 2.0' | 'OID4VCI';
export interface EndpointMetadata {
    issuer: string;
    token_endpoint: string;
    credential_endpoint: string;
    deferred_credential_endpoint?: string;
    authorization_server?: string;
    authorization_endpoint?: string;
}
//# sourceMappingURL=ServerMetadata.d.ts.map