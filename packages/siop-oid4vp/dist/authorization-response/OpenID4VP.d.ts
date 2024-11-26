import { IPresentationDefinition } from '@sphereon/pex';
import { Format } from '@sphereon/pex-models';
import { CompactSdJwtVc, Hasher, PresentationSubmission, W3CVerifiablePresentation, WrappedVerifiablePresentation } from '@sphereon/ssi-types';
import { DcqlPresentation } from 'dcql';
import { AuthorizationRequest } from '../authorization-request';
import { AuthorizationResponsePayload, IDTokenPayload, VerifiedOpenID4VPSubmission, VerifiedOpenID4VPSubmissionDcql } from '../types';
import { AuthorizationResponse } from './AuthorizationResponse';
import { AuthorizationResponseOpts, PresentationDefinitionWithLocation, PresentationVerificationCallback, VerifyAuthorizationResponseOpts } from './types';
export declare const extractNonceFromWrappedVerifiablePresentation: (wrappedVp: WrappedVerifiablePresentation) => string | undefined;
export declare const verifyPresentations: (authorizationResponse: AuthorizationResponse, verifyOpts: VerifyAuthorizationResponseOpts) => Promise<{
    presentationExchange?: VerifiedOpenID4VPSubmission;
    dcql?: VerifiedOpenID4VPSubmissionDcql;
}>;
export declare const extractDcqlPresentationFromDcqlVpToken: (vpToken: DcqlPresentation.Input | string, opts?: {
    hasher?: Hasher;
}) => {
    [credentialQueryId: string]: WrappedVerifiablePresentation;
};
export declare const extractPresentationsFromDcqlVpToken: (vpToken: DcqlPresentation.Input | string, opts?: {
    hasher?: Hasher;
}) => WrappedVerifiablePresentation[];
export declare const extractPresentationsFromVpToken: (vpToken: Array<W3CVerifiablePresentation | CompactSdJwtVc | string> | W3CVerifiablePresentation | CompactSdJwtVc | string, opts?: {
    hasher?: Hasher;
}) => WrappedVerifiablePresentation[] | WrappedVerifiablePresentation;
export declare const createPresentationSubmission: (verifiablePresentations: W3CVerifiablePresentation[], opts?: {
    presentationDefinitions: (PresentationDefinitionWithLocation | IPresentationDefinition)[];
}) => Promise<PresentationSubmission>;
export declare const putPresentationSubmissionInLocation: (authorizationRequest: AuthorizationRequest, responsePayload: AuthorizationResponsePayload, resOpts: AuthorizationResponseOpts, idTokenPayload?: IDTokenPayload) => Promise<void>;
export declare const assertValidVerifiablePresentations: (args: {
    presentationDefinitions: PresentationDefinitionWithLocation[];
    presentations: Array<WrappedVerifiablePresentation> | WrappedVerifiablePresentation;
    verificationCallback: PresentationVerificationCallback;
    opts?: {
        limitDisclosureSignatureSuites?: string[];
        restrictToFormats?: Format;
        restrictToDIDMethods?: string[];
        presentationSubmission?: PresentationSubmission;
        hasher?: Hasher;
    };
}) => Promise<void>;
//# sourceMappingURL=OpenID4VP.d.ts.map