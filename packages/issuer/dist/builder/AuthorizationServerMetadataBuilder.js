"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationServerMetadataBuilder = void 0;
class AuthorizationServerMetadataBuilder {
    constructor() {
        this.metadata = {};
    }
    withIssuer(issuer) {
        this.metadata.issuer = issuer;
        return this;
    }
    withAuthorizationEndpoint(endpoint) {
        this.metadata.authorization_endpoint = endpoint;
        return this;
    }
    withTokenEndpoint(endpoint) {
        this.metadata.token_endpoint = endpoint;
        return this;
    }
    withTokenEndpointAuthMethodsSupported(methods) {
        this.metadata.token_endpoint_auth_methods_supported = methods;
        return this;
    }
    withTokenEndpointAuthSigningAlgValuesSupported(algs) {
        this.metadata.token_endpoint_auth_signing_alg_values_supported = algs;
        return this;
    }
    withRegistrationEndpoint(endpoint) {
        this.metadata.registration_endpoint = endpoint;
        return this;
    }
    withScopesSupported(scopes) {
        this.metadata.scopes_supported = scopes;
        return this;
    }
    withResponseTypesSupported(types) {
        this.metadata.response_types_supported = types;
        return this;
    }
    withResponseModesSupported(modes) {
        this.metadata.response_modes_supported = modes;
        return this;
    }
    withGrantTypesSupported(types) {
        this.metadata.grant_types_supported = types;
        return this;
    }
    withServiceDocumentation(url) {
        this.metadata.service_documentation = url;
        return this;
    }
    withUILocalesSupported(locales) {
        this.metadata.ui_locales_supported = locales;
        return this;
    }
    withOpPolicyUri(uri) {
        this.metadata.op_policy_uri = uri;
        return this;
    }
    withOpTosUri(uri) {
        this.metadata.op_tos_uri = uri;
        return this;
    }
    withRevocationEndpoint(endpoint) {
        this.metadata.revocation_endpoint = endpoint;
        return this;
    }
    withRevocationEndpointAuthMethodsSupported(methods) {
        this.metadata.revocation_endpoint_auth_methods_supported = methods;
        return this;
    }
    withRevocationEndpointAuthSigningAlgValuesSupported(algs) {
        this.metadata.revocation_endpoint_auth_signing_alg_values_supported = algs;
        return this;
    }
    withIntrospectionEndpoint(endpoint) {
        this.metadata.introspection_endpoint = endpoint;
        return this;
    }
    withCodeChallengeMethodsSupported(methods) {
        this.metadata.code_challenge_methods_supported = methods;
        return this;
    }
    withPushedAuthorizationRequestEndpoint(endpoint) {
        this.metadata.pushed_authorization_request_endpoint = endpoint;
        return this;
    }
    withRequirePushedAuthorizationRequests(required) {
        this.metadata.require_pushed_authorization_requests = required;
        return this;
    }
    withPreAuthorizedGrantAnonymousAccessSupported(supported) {
        this.metadata['pre-authorized_grant_anonymous_access_supported'] = supported;
        return this;
    }
    withDPoPSigningAlgValuesSupported(algs) {
        this.metadata.dpop_signing_alg_values_supported = algs;
        return this;
    }
    // OIDC specific methods
    withFrontchannelLogoutSupported(supported) {
        this.metadata.frontchannel_logout_supported = supported;
        return this;
    }
    withFrontchannelLogoutSessionSupported(supported) {
        this.metadata.frontchannel_logout_session_supported = supported;
        return this;
    }
    withBackchannelLogoutSupported(supported) {
        this.metadata.backchannel_logout_supported = supported;
        return this;
    }
    withBackchannelLogoutSessionSupported(supported) {
        this.metadata.backchannel_logout_session_supported = supported;
        return this;
    }
    withUserinfoEndpoint(endpoint) {
        this.metadata.userinfo_endpoint = endpoint;
        return this;
    }
    withCheckSessionIframe(url) {
        this.metadata.check_session_iframe = url;
        return this;
    }
    withEndSessionEndpoint(endpoint) {
        this.metadata.end_session_endpoint = endpoint;
        return this;
    }
    withAcrValuesSupported(values) {
        this.metadata.acr_values_supported = values;
        return this;
    }
    withSubjectTypesSupported(types) {
        this.metadata.subject_types_supported = types;
        return this;
    }
    withRequestObjectSigningAlgValuesSupported(algs) {
        this.metadata.request_object_signing_alg_values_supported = algs;
        return this;
    }
    withDisplayValuesSupported(values) {
        this.metadata.display_values_supported = values;
        return this;
    }
    withClaimTypesSupported(types) {
        this.metadata.claim_types_supported = types;
        return this;
    }
    withClaimsSupported(claims) {
        this.metadata.claims_supported = claims;
        return this;
    }
    withClaimsParameterSupported(supported) {
        this.metadata.claims_parameter_supported = supported;
        return this;
    }
    // VCI specific methods
    withCredentialEndpoint(endpoint) {
        this.metadata.credential_endpoint = endpoint;
        return this;
    }
    withDeferredCredentialEndpoint(endpoint) {
        this.metadata.deferred_credential_endpoint = endpoint;
        return this;
    }
    build() {
        if (!this.metadata.issuer) {
            throw new Error('Issuer is required');
        }
        if (!this.metadata.response_types_supported) {
            throw new Error('Response types supported is required');
        }
        return this.metadata;
    }
}
exports.AuthorizationServerMetadataBuilder = AuthorizationServerMetadataBuilder;
//# sourceMappingURL=AuthorizationServerMetadataBuilder.js.map