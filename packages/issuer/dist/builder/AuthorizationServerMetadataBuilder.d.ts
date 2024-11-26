import { SigningAlgo } from '@sphereon/oid4vc-common';
import { AuthorizationServerMetadata, OAuthGrantType, OAuthResponseMode, OAuthResponseType, OAuthScope, PKCECodeChallengeMethod, RevocationEndpointAuthMethod, RevocationEndpointAuthSigningAlg, TokenEndpointAuthMethod, TokenEndpointAuthSigningAlg } from '@sphereon/oid4vci-common';
export declare class AuthorizationServerMetadataBuilder {
    private metadata;
    withIssuer(issuer: string): AuthorizationServerMetadataBuilder;
    withAuthorizationEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withTokenEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withTokenEndpointAuthMethodsSupported(methods: Array<TokenEndpointAuthMethod>): AuthorizationServerMetadataBuilder;
    withTokenEndpointAuthSigningAlgValuesSupported(algs: Array<TokenEndpointAuthSigningAlg>): AuthorizationServerMetadataBuilder;
    withRegistrationEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withScopesSupported(scopes: Array<OAuthScope | string>): AuthorizationServerMetadataBuilder;
    withResponseTypesSupported(types: Array<OAuthResponseType>): AuthorizationServerMetadataBuilder;
    withResponseModesSupported(modes: Array<OAuthResponseMode>): AuthorizationServerMetadataBuilder;
    withGrantTypesSupported(types: Array<OAuthGrantType>): AuthorizationServerMetadataBuilder;
    withServiceDocumentation(url: string): AuthorizationServerMetadataBuilder;
    withUILocalesSupported(locales: string[]): AuthorizationServerMetadataBuilder;
    withOpPolicyUri(uri: string): AuthorizationServerMetadataBuilder;
    withOpTosUri(uri: string): AuthorizationServerMetadataBuilder;
    withRevocationEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withRevocationEndpointAuthMethodsSupported(methods: Array<RevocationEndpointAuthMethod>): AuthorizationServerMetadataBuilder;
    withRevocationEndpointAuthSigningAlgValuesSupported(algs: Array<RevocationEndpointAuthSigningAlg>): AuthorizationServerMetadataBuilder;
    withIntrospectionEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withCodeChallengeMethodsSupported(methods: Array<PKCECodeChallengeMethod>): AuthorizationServerMetadataBuilder;
    withPushedAuthorizationRequestEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withRequirePushedAuthorizationRequests(required: boolean): AuthorizationServerMetadataBuilder;
    withPreAuthorizedGrantAnonymousAccessSupported(supported: boolean): AuthorizationServerMetadataBuilder;
    withDPoPSigningAlgValuesSupported(algs: (string | SigningAlgo)[]): AuthorizationServerMetadataBuilder;
    withFrontchannelLogoutSupported(supported: boolean): AuthorizationServerMetadataBuilder;
    withFrontchannelLogoutSessionSupported(supported: boolean): AuthorizationServerMetadataBuilder;
    withBackchannelLogoutSupported(supported: boolean): AuthorizationServerMetadataBuilder;
    withBackchannelLogoutSessionSupported(supported: boolean): AuthorizationServerMetadataBuilder;
    withUserinfoEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withCheckSessionIframe(url: string): AuthorizationServerMetadataBuilder;
    withEndSessionEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withAcrValuesSupported(values: string[]): AuthorizationServerMetadataBuilder;
    withSubjectTypesSupported(types: string[]): AuthorizationServerMetadataBuilder;
    withRequestObjectSigningAlgValuesSupported(algs: string[]): AuthorizationServerMetadataBuilder;
    withDisplayValuesSupported(values: string[]): AuthorizationServerMetadataBuilder;
    withClaimTypesSupported(types: string[]): AuthorizationServerMetadataBuilder;
    withClaimsSupported(claims: string[]): AuthorizationServerMetadataBuilder;
    withClaimsParameterSupported(supported: boolean): AuthorizationServerMetadataBuilder;
    withCredentialEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    withDeferredCredentialEndpoint(endpoint: string): AuthorizationServerMetadataBuilder;
    build(): AuthorizationServerMetadata;
}
//# sourceMappingURL=AuthorizationServerMetadataBuilder.d.ts.map