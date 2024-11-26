import { AuthorizationRequest } from '@sphereon/oid4vci-common';
import { ITokenEndpointOpts, VcIssuer } from '@sphereon/oid4vci-issuer';
import { ISingleEndpointOpts } from '@sphereon/ssi-express-support';
import { Router } from 'express';
import { ICreateCredentialOfferEndpointOpts, IGetCredentialOfferEndpointOpts, IGetIssueStatusEndpointOpts } from './OID4VCIServer';
export declare function getIssueStatusEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, opts: IGetIssueStatusEndpointOpts): void;
export declare function accessTokenEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, opts: ITokenEndpointOpts & ISingleEndpointOpts & {
    baseUrl: string | URL;
}): void;
export declare function getCredentialEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, opts: Pick<ITokenEndpointOpts, 'accessTokenVerificationCallback' | 'accessTokenSignerCallback' | 'tokenExpiresIn' | 'cNonceExpiresIn'> & ISingleEndpointOpts & {
    baseUrl: string | URL;
}): void;
export declare function notificationEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, opts: ISingleEndpointOpts & Pick<ITokenEndpointOpts, 'accessTokenVerificationCallback'> & {
    baseUrl: string | URL;
}): void;
export declare function getCredentialOfferEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, opts?: IGetCredentialOfferEndpointOpts): void;
export declare function createCredentialOfferEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, opts?: ICreateCredentialOfferEndpointOpts & {
    baseUrl?: string;
}): void;
export declare function pushedAuthorizationEndpoint<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>, authRequestsData: Map<string, AuthorizationRequest>, opts?: ISingleEndpointOpts): void;
export declare function getMetadataEndpoints<DIDDoc extends object>(router: Router, issuer: VcIssuer<DIDDoc>): void;
export declare function determinePath(baseUrl: URL | string | undefined, endpoint: string, opts?: {
    skipBaseUrlCheck?: boolean;
    prependUrl?: string;
    stripBasePath?: boolean;
}): string;
export declare function getBaseUrl(url?: URL | string | undefined): string;
export declare function getBasePath(url?: URL | string): string;
//# sourceMappingURL=oid4vci-api-functions.d.ts.map