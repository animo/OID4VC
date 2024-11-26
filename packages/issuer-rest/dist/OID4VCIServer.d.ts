import { QRCodeOpts, TxCode } from '@sphereon/oid4vci-common';
import { ITokenEndpointOpts, VcIssuer } from '@sphereon/oid4vci-issuer';
import { ExpressSupport, HasEndpointOpts, ISingleEndpointOpts } from '@sphereon/ssi-express-support';
import express, { Express } from 'express';
export type ICreateCredentialOfferURIResponse = {
    uri: string;
    userPin?: string;
    txCode?: TxCode;
};
export interface IGetCredentialOfferEndpointOpts extends ISingleEndpointOpts {
    baseUrl: string;
}
export interface ICreateCredentialOfferEndpointOpts extends ISingleEndpointOpts {
    getOfferPath?: string;
    qrCodeOpts?: QRCodeOpts;
}
export interface IGetIssueStatusEndpointOpts extends ISingleEndpointOpts {
    baseUrl: string | URL;
}
export interface IOID4VCIServerOpts extends HasEndpointOpts {
    endpointOpts?: {
        tokenEndpointOpts?: ITokenEndpointOpts;
        notificationOpts?: ISingleEndpointOpts;
        createCredentialOfferOpts?: ICreateCredentialOfferEndpointOpts;
        getCredentialOfferOpts?: IGetCredentialOfferEndpointOpts;
        getStatusOpts?: IGetIssueStatusEndpointOpts;
        parOpts?: ISingleEndpointOpts;
    };
    baseUrl?: string;
}
export declare class OID4VCIServer<DIDDoc extends object> {
    private readonly _issuer;
    private authRequestsData;
    private readonly _app;
    private readonly _baseUrl;
    private readonly _expressSupport;
    private readonly _router;
    constructor(expressSupport: ExpressSupport, opts: IOID4VCIServerOpts & {
        issuer?: VcIssuer<DIDDoc>;
    });
    get app(): Express;
    get router(): express.Router;
    get issuer(): VcIssuer<DIDDoc>;
    stop(): Promise<void>;
    private isTokenEndpointDisabled;
    private isStatusEndpointEnabled;
    private assertAccessTokenHandling;
    get baseUrl(): URL;
}
//# sourceMappingURL=OID4VCIServer.d.ts.map