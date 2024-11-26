"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidVerifiablePresentations = exports.putPresentationSubmissionInLocation = exports.createPresentationSubmission = exports.extractPresentationsFromVpToken = exports.extractPresentationsFromDcqlVpToken = exports.extractDcqlPresentationFromDcqlVpToken = exports.verifyPresentations = exports.extractNonceFromWrappedVerifiablePresentation = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const pex_1 = require("@sphereon/pex");
const ssi_types_1 = require("@sphereon/ssi-types");
const dcql_1 = require("dcql");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const Dcql_1 = require("./Dcql");
const PresentationExchange_1 = require("./PresentationExchange");
const types_2 = require("./types");
const extractNonceFromWrappedVerifiablePresentation = (wrappedVp) => {
    var _a;
    // SD-JWT uses kb-jwt for the nonce
    if (ssi_types_1.CredentialMapper.isWrappedSdJwtVerifiablePresentation(wrappedVp)) {
        // SD-JWT uses kb-jwt for the nonce
        // TODO: replace this once `kbJwt.payload` is available on the decoded sd-jwt (pr in ssi-sdk)
        // If it doesn't end with ~, it contains a kbJwt
        if (!wrappedVp.presentation.compactSdJwtVc.endsWith('~')) {
            const kbJwt = wrappedVp.presentation.compactSdJwtVc.split('~').pop();
            const { payload } = (0, oid4vc_common_1.parseJWT)(kbJwt);
            return payload.nonce;
        }
        // No kb-jwt means no nonce (error will be handled later)
        return undefined;
    }
    if (wrappedVp.format === 'jwt_vp') {
        return wrappedVp.decoded.nonce;
    }
    // For LDP-VP a challenge is also fine
    if (wrappedVp.format === 'ldp_vp') {
        const w3cPresentation = wrappedVp.decoded;
        const proof = Array.isArray(w3cPresentation.proof) ? w3cPresentation.proof[0] : w3cPresentation.proof;
        return (_a = proof.nonce) !== null && _a !== void 0 ? _a : proof.challenge;
    }
    return undefined;
};
exports.extractNonceFromWrappedVerifiablePresentation = extractNonceFromWrappedVerifiablePresentation;
const verifyPresentations = (authorizationResponse, verifyOpts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    let idPayload;
    if (authorizationResponse.idToken) {
        idPayload = yield authorizationResponse.idToken.payload();
    }
    let wrappedPresentations = [];
    const presentationDefinitions = verifyOpts.presentationDefinitions
        ? Array.isArray(verifyOpts.presentationDefinitions)
            ? verifyOpts.presentationDefinitions
            : [verifyOpts.presentationDefinitions]
        : [];
    let presentationSubmission;
    let dcqlPresentation;
    let dcqlQuery = (_a = verifyOpts.dcqlQuery) !== null && _a !== void 0 ? _a : (_b = authorizationResponse === null || authorizationResponse === void 0 ? void 0 : authorizationResponse.authorizationRequest) === null || _b === void 0 ? void 0 : _b.payload.dcql_query;
    if (dcqlQuery) {
        dcqlQuery = dcql_1.DcqlQuery.parse(dcqlQuery);
        dcqlPresentation = (0, exports.extractDcqlPresentationFromDcqlVpToken)(authorizationResponse.payload.vp_token, { hasher: verifyOpts.hasher });
        wrappedPresentations = Object.values(dcqlPresentation);
        const verifiedPresentations = yield Promise.all(wrappedPresentations.map((presentation) => verifyOpts.verification.presentationVerificationCallback(presentation.original)));
        (0, Dcql_1.assertValidDcqlPresentationResult)(authorizationResponse.payload.vp_token, dcqlQuery, { hasher: verifyOpts.hasher });
        if (verifiedPresentations.some((verified) => !verified)) {
            const message = verifiedPresentations
                .map((verified) => verified.reason)
                .filter(Boolean)
                .join(', ');
            throw Error(`Failed to verify presentations. ${message}`);
        }
    }
    else {
        const presentations = authorizationResponse.payload.vp_token
            ? (0, exports.extractPresentationsFromVpToken)(authorizationResponse.payload.vp_token, { hasher: verifyOpts.hasher })
            : [];
        wrappedPresentations = Array.isArray(presentations) ? presentations : [presentations];
        // todo: Probably wise to check against request for the location of the submission_data
        presentationSubmission = (_d = (_c = idPayload === null || idPayload === void 0 ? void 0 : idPayload._vp_token) === null || _c === void 0 ? void 0 : _c.presentation_submission) !== null && _d !== void 0 ? _d : authorizationResponse.payload.presentation_submission;
        yield (0, exports.assertValidVerifiablePresentations)({
            presentationDefinitions,
            presentations,
            verificationCallback: verifyOpts.verification.presentationVerificationCallback,
            opts: {
                presentationSubmission,
                restrictToFormats: verifyOpts.restrictToFormats,
                restrictToDIDMethods: verifyOpts.restrictToDIDMethods,
                hasher: verifyOpts.hasher,
            },
        });
    }
    const presentationsWithoutMdoc = wrappedPresentations.filter((p) => p.format !== 'mso_mdoc');
    const nonces = new Set(presentationsWithoutMdoc.map(exports.extractNonceFromWrappedVerifiablePresentation));
    if (presentationsWithoutMdoc.length > 0 && nonces.size !== 1) {
        throw Error(`${nonces.size} nonce values found for ${presentationsWithoutMdoc.length}. Should be 1`);
    }
    // Nonce may be undefined in case there's only mdoc presentations (verified differently)
    const nonce = Array.from(nonces)[0];
    if (presentationsWithoutMdoc.length > 0 && typeof nonce !== 'string') {
        throw new Error('Expected all presentations to contain a nonce value');
    }
    const revocationVerification = ((_e = verifyOpts.verification) === null || _e === void 0 ? void 0 : _e.revocationOpts)
        ? verifyOpts.verification.revocationOpts.revocationVerification
        : types_1.RevocationVerification.IF_PRESENT;
    if (revocationVerification !== types_1.RevocationVerification.NEVER) {
        if (!((_f = verifyOpts.verification.revocationOpts) === null || _f === void 0 ? void 0 : _f.revocationVerificationCallback)) {
            throw Error(`Please provide a revocation callback as revocation checking of credentials and presentations is not disabled`);
        }
        for (const vp of wrappedPresentations) {
            yield (0, helpers_1.verifyRevocation)(vp, verifyOpts.verification.revocationOpts.revocationVerificationCallback, revocationVerification);
        }
    }
    if (presentationDefinitions) {
        return { presentationExchange: { nonce, presentations: wrappedPresentations, presentationDefinitions, submissionData: presentationSubmission } };
    }
    else {
        return { dcql: { nonce, presentation: dcqlPresentation, dcqlQuery } };
    }
});
exports.verifyPresentations = verifyPresentations;
const extractDcqlPresentationFromDcqlVpToken = (vpToken, opts) => {
    const dcqlPresentation = Object.fromEntries(Object.entries(dcql_1.DcqlPresentation.parse(vpToken)).map(([credentialQueryId, vp]) => [
        credentialQueryId,
        ssi_types_1.CredentialMapper.toWrappedVerifiablePresentation(vp, { hasher: opts.hasher }),
    ]));
    return dcqlPresentation;
};
exports.extractDcqlPresentationFromDcqlVpToken = extractDcqlPresentationFromDcqlVpToken;
const extractPresentationsFromDcqlVpToken = (vpToken, opts) => {
    return Object.values((0, exports.extractDcqlPresentationFromDcqlVpToken)(vpToken, opts));
};
exports.extractPresentationsFromDcqlVpToken = extractPresentationsFromDcqlVpToken;
const extractPresentationsFromVpToken = (vpToken, opts) => {
    const tokens = Array.isArray(vpToken) ? vpToken : [vpToken];
    const wrappedTokens = tokens.map((vp) => ssi_types_1.CredentialMapper.toWrappedVerifiablePresentation(vp, { hasher: opts === null || opts === void 0 ? void 0 : opts.hasher }));
    return tokens.length === 1 ? wrappedTokens[0] : wrappedTokens;
};
exports.extractPresentationsFromVpToken = extractPresentationsFromVpToken;
const createPresentationSubmission = (verifiablePresentations, opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    let submission_data;
    for (const verifiablePresentation of verifiablePresentations) {
        const wrappedPresentation = ssi_types_1.CredentialMapper.toWrappedVerifiablePresentation(verifiablePresentation);
        let submission = ssi_types_1.CredentialMapper.isWrappedW3CVerifiablePresentation(wrappedPresentation) &&
            ((_h = (_g = wrappedPresentation.presentation.presentation_submission) !== null && _g !== void 0 ? _g : wrappedPresentation.decoded.presentation_submission) !== null && _h !== void 0 ? _h : (typeof wrappedPresentation.original !== 'string' && wrappedPresentation.original.presentation_submission));
        if (typeof submission === 'string') {
            submission = JSON.parse(submission);
        }
        if (!submission && (opts === null || opts === void 0 ? void 0 : opts.presentationDefinitions) && !ssi_types_1.CredentialMapper.isWrappedMdocPresentation(wrappedPresentation)) {
            console.log(`No submission_data in VPs and not provided. Will try to deduce, but it is better to create the submission data beforehand`);
            for (const definitionOpt of opts.presentationDefinitions) {
                const definition = 'definition' in definitionOpt ? definitionOpt.definition : definitionOpt;
                const result = new pex_1.PEX().evaluatePresentation(definition, wrappedPresentation.original, {
                    generatePresentationSubmission: true,
                    presentationSubmissionLocation: pex_1.PresentationSubmissionLocation.EXTERNAL,
                });
                if (result.areRequiredCredentialsPresent) {
                    submission = result.value;
                    break;
                }
            }
        }
        if (!submission) {
            throw Error('Verifiable Presentation has no submission_data, it has not been provided separately, and could also not be deduced');
        }
        // let's merge all submission data into one object
        if (!submission_data) {
            submission_data = submission;
        }
        else {
            // We are pushing multiple descriptors into one submission_data, as it seems this is something which is assumed in OpenID4VP, but not supported in Presentation Exchange (a single VP always has a single submission_data)
            Array.isArray(submission_data.descriptor_map)
                ? submission_data.descriptor_map.push(...submission.descriptor_map)
                : (submission_data.descriptor_map = [...submission.descriptor_map]);
        }
    }
    if (typeof submission_data === 'string') {
        submission_data = JSON.parse(submission_data);
    }
    return submission_data;
});
exports.createPresentationSubmission = createPresentationSubmission;
const putPresentationSubmissionInLocation = (authorizationRequest, responsePayload, resOpts, idTokenPayload) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l, _m, _o, _p, _q;
    const version = yield authorizationRequest.getSupportedVersion();
    const idTokenType = yield authorizationRequest.containsResponseType(types_1.ResponseType.ID_TOKEN);
    const authResponseType = yield authorizationRequest.containsResponseType(types_1.ResponseType.VP_TOKEN);
    // const requestPayload = await authorizationRequest.mergedPayloads();
    if (!resOpts.presentationExchange) {
        return;
    }
    else if (resOpts.presentationExchange.verifiablePresentations.length === 0) {
        throw Error('Presentation Exchange options set, but no verifiable presentations provided');
    }
    if (!resOpts.presentationExchange.presentationSubmission &&
        (!resOpts.presentationExchange.verifiablePresentations || resOpts.presentationExchange.verifiablePresentations.length === 0)) {
        throw Error(`Either a presentationSubmission or verifiable presentations are needed at this point`);
    }
    const submissionData = (_j = resOpts.presentationExchange.presentationSubmission) !== null && _j !== void 0 ? _j : (yield (0, exports.createPresentationSubmission)(resOpts.presentationExchange.verifiablePresentations, {
        presentationDefinitions: yield authorizationRequest.getPresentationDefinitions(),
    }));
    const location = (_l = (_k = resOpts.presentationExchange) === null || _k === void 0 ? void 0 : _k.vpTokenLocation) !== null && _l !== void 0 ? _l : (idTokenType && version < types_1.SupportedVersion.SIOPv2_D11 ? types_2.VPTokenLocation.ID_TOKEN : types_2.VPTokenLocation.AUTHORIZATION_RESPONSE);
    switch (location) {
        case types_2.VPTokenLocation.TOKEN_RESPONSE: {
            throw Error('Token response for VP token is not supported yet');
        }
        case types_2.VPTokenLocation.ID_TOKEN: {
            if (!idTokenPayload) {
                throw Error('Cannot place submission data _vp_token in id token if no id token is present');
            }
            else if (version >= types_1.SupportedVersion.SIOPv2_D11) {
                throw Error(`This version of the OpenID4VP spec does not allow to store the vp submission data in the ID token`);
            }
            else if (!idTokenType) {
                throw Error(`Cannot place vp token in ID token as the RP didn't provide an "openid" scope in the request`);
            }
            if ((_m = idTokenPayload._vp_token) === null || _m === void 0 ? void 0 : _m.presentation_submission) {
                if (submissionData !== idTokenPayload._vp_token.presentation_submission) {
                    throw Error('Different submission data was provided as an option, but exising submission data was already present in the id token');
                }
            }
            else {
                if (!idTokenPayload._vp_token) {
                    idTokenPayload._vp_token = { presentation_submission: submissionData };
                }
                else {
                    idTokenPayload._vp_token.presentation_submission = submissionData;
                }
            }
            break;
        }
        case types_2.VPTokenLocation.AUTHORIZATION_RESPONSE: {
            if (!authResponseType) {
                throw Error('Cannot place vp token in Authorization Response as there is no vp_token scope in the auth request');
            }
            if (responsePayload.presentation_submission) {
                if (submissionData !== responsePayload.presentation_submission) {
                    throw Error('Different submission data was provided as an option, but exising submission data was already present in the authorization response');
                }
            }
            else {
                responsePayload.presentation_submission = submissionData;
            }
        }
    }
    responsePayload.vp_token =
        ((_o = resOpts.presentationExchange) === null || _o === void 0 ? void 0 : _o.verifiablePresentations.length) === 1 && ((_p = submissionData.descriptor_map[0]) === null || _p === void 0 ? void 0 : _p.path) === '$'
            ? resOpts.presentationExchange.verifiablePresentations[0]
            : (_q = resOpts.presentationExchange) === null || _q === void 0 ? void 0 : _q.verifiablePresentations;
});
exports.putPresentationSubmissionInLocation = putPresentationSubmissionInLocation;
const assertValidVerifiablePresentations = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const { presentations } = args;
    if (!presentations || (Array.isArray(presentations) && presentations.length === 0)) {
        return Promise.reject(Error('missing presentation(s)'));
    }
    // Handle mdocs, keep them out of pex
    const presentationsArray = Array.isArray(presentations) ? presentations : [presentations];
    // Sphereon bypasses mdoc from pex
    // if (presentationsArray.every((p) => p.format === 'mso_mdoc')) {
    //   return
    // }
    // presentationsArray = presentationsArray.filter((p) => p.format !== 'mso_mdoc')
    if ((!args.presentationDefinitions || args.presentationDefinitions.filter((a) => a.definition).length === 0) &&
        (!presentationsArray || (Array.isArray(presentationsArray) && presentationsArray.filter((vp) => vp.presentation).length === 0))) {
        return;
    }
    PresentationExchange_1.PresentationExchange.assertValidPresentationDefinitionWithLocations(args.presentationDefinitions);
    if (args.presentationDefinitions &&
        args.presentationDefinitions.length &&
        (!presentationsArray || (Array.isArray(presentationsArray) && presentationsArray.length === 0))) {
        return Promise.reject(Error(types_1.SIOPErrors.AUTH_REQUEST_EXPECTS_VP));
    }
    else if ((!args.presentationDefinitions || args.presentationDefinitions.length === 0) &&
        presentationsArray &&
        ((Array.isArray(presentationsArray) && presentationsArray.length > 0) || !Array.isArray(presentationsArray))) {
        return Promise.reject(Error(types_1.SIOPErrors.AUTH_REQUEST_DOESNT_EXPECT_VP));
    }
    else if (args.presentationDefinitions && !args.opts.presentationSubmission) {
        return Promise.reject(Error(`No presentation submission present. Please use presentationSubmission opt argument!`));
    }
    else if (args.presentationDefinitions && presentationsArray) {
        yield PresentationExchange_1.PresentationExchange.validatePresentationsAgainstDefinitions(args.presentationDefinitions, args.presentations, args.verificationCallback, args.opts);
    }
});
exports.assertValidVerifiablePresentations = assertValidVerifiablePresentations;
//# sourceMappingURL=OpenID4VP.js.map