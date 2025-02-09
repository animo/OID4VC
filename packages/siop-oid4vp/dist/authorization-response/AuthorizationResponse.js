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
exports.AuthorizationResponse = void 0;
const ssi_types_1 = require("@sphereon/ssi-types");
const authorization_request_1 = require("../authorization-request");
const Opts_1 = require("../authorization-request/Opts");
const id_token_1 = require("../id-token");
const types_1 = require("../types");
const Dcql_1 = require("./Dcql");
const OpenID4VP_1 = require("./OpenID4VP");
const OpenID4VP_2 = require("./OpenID4VP");
const Opts_2 = require("./Opts");
const Payload_1 = require("./Payload");
class AuthorizationResponse {
    constructor({ authorizationResponsePayload, idToken, responseOpts, authorizationRequest, }) {
        this._authorizationRequest = authorizationRequest;
        this._options = responseOpts;
        this._idToken = idToken;
        this._payload = authorizationResponsePayload;
    }
    /**
     * Creates a SIOP Response Object
     *
     * @param requestObject
     * @param responseOpts
     * @param verifyOpts
     */
    static fromRequestObject(requestObject, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_1.assertValidVerifyAuthorizationRequestOpts)(verifyOpts);
            (0, Opts_2.assertValidResponseOpts)(responseOpts);
            if (!requestObject || !requestObject.startsWith('ey')) {
                throw new Error(types_1.SIOPErrors.NO_JWT);
            }
            const authorizationRequest = yield authorization_request_1.AuthorizationRequest.fromUriOrJwt(requestObject);
            return AuthorizationResponse.fromAuthorizationRequest(authorizationRequest, responseOpts, verifyOpts);
        });
    }
    static fromPayload(authorizationResponsePayload, responseOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!authorizationResponsePayload) {
                throw new Error(types_1.SIOPErrors.NO_RESPONSE);
            }
            if (responseOpts) {
                (0, Opts_2.assertValidResponseOpts)(responseOpts);
            }
            const idToken = authorizationResponsePayload.id_token ? yield id_token_1.IDToken.fromIDToken(authorizationResponsePayload.id_token) : undefined;
            return new AuthorizationResponse({
                authorizationResponsePayload,
                idToken,
                responseOpts,
            });
        });
    }
    static fromAuthorizationRequest(authorizationRequest, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_2.assertValidResponseOpts)(responseOpts);
            if (!authorizationRequest) {
                throw new Error(types_1.SIOPErrors.NO_REQUEST);
            }
            const verifiedRequest = yield authorizationRequest.verify(verifyOpts);
            return yield AuthorizationResponse.fromVerifiedAuthorizationRequest(verifiedRequest, responseOpts, verifyOpts);
        });
    }
    static fromVerifiedAuthorizationRequest(verifiedAuthorizationRequest, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_2.assertValidResponseOpts)(responseOpts);
            if (!verifiedAuthorizationRequest) {
                throw new Error(types_1.SIOPErrors.NO_REQUEST);
            }
            const authorizationRequest = verifiedAuthorizationRequest.authorizationRequest;
            // const merged = verifiedAuthorizationRequest.authorizationRequest.requestObject, verifiedAuthorizationRequest.requestObject);
            // const presentationDefinitions = await PresentationExchange.findValidPresentationDefinitions(merged, await authorizationRequest.getSupportedVersion());
            const presentationDefinitions = JSON.parse(JSON.stringify(verifiedAuthorizationRequest.presentationDefinitions));
            const wantsIdToken = yield authorizationRequest.containsResponseType(types_1.ResponseType.ID_TOKEN);
            const hasVpToken = yield authorizationRequest.containsResponseType(types_1.ResponseType.VP_TOKEN);
            const idToken = wantsIdToken ? yield id_token_1.IDToken.fromVerifiedAuthorizationRequest(verifiedAuthorizationRequest, responseOpts) : undefined;
            const idTokenPayload = idToken ? yield idToken.payload() : undefined;
            const authorizationResponsePayload = yield (0, Payload_1.createResponsePayload)(authorizationRequest, responseOpts, idTokenPayload);
            const response = new AuthorizationResponse({
                authorizationResponsePayload,
                idToken,
                responseOpts,
                authorizationRequest,
            });
            if (!hasVpToken)
                return response;
            if (responseOpts.presentationExchange) {
                const wrappedPresentations = response.payload.vp_token
                    ? (0, OpenID4VP_1.extractPresentationsFromVpToken)(response.payload.vp_token, {
                        hasher: verifyOpts.hasher,
                    })
                    : [];
                yield (0, OpenID4VP_1.assertValidVerifiablePresentations)({
                    presentationDefinitions,
                    presentations: wrappedPresentations,
                    verificationCallback: verifyOpts.verification.presentationVerificationCallback,
                    opts: Object.assign(Object.assign({}, responseOpts.presentationExchange), { hasher: verifyOpts.hasher }),
                });
            }
            else if (verifiedAuthorizationRequest.dcqlQuery) {
                (0, Dcql_1.assertValidDcqlPresentationResult)(responseOpts.dcqlQuery.dcqlPresentation, verifiedAuthorizationRequest.dcqlQuery, {
                    hasher: verifyOpts.hasher,
                });
            }
            else {
                throw new Error('vp_token is present, but no presentation definitions or dcql query provided');
            }
            return response;
        });
    }
    verify(verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            // Merge payloads checks for inconsistencies in properties which are present in both the auth request and request object
            const merged = yield this.mergedPayloads({
                consistencyCheck: true,
                hasher: verifyOpts.hasher,
            });
            if (verifyOpts.state && merged.state !== verifyOpts.state) {
                throw Error(types_1.SIOPErrors.BAD_STATE);
            }
            const verifiedIdToken = yield ((_a = this.idToken) === null || _a === void 0 ? void 0 : _a.verify(verifyOpts));
            if (this.payload.vp_token && !verifyOpts.presentationDefinitions && !verifyOpts.dcqlQuery) {
                throw new Error('vp_token is present, but no presentation definitions or dcql query provided');
            }
            const emptyPresentationDefinitions = Array.isArray(verifyOpts.presentationDefinitions) && verifyOpts.presentationDefinitions.length === 0;
            if (!this.payload.vp_token && ((verifyOpts.presentationDefinitions && !emptyPresentationDefinitions) || verifyOpts.dcqlQuery)) {
                throw new Error('Presentation definitions or dcql query provided, but no vp_token present');
            }
            const oid4vp = this.payload.vp_token ? yield (0, OpenID4VP_1.verifyPresentations)(this, verifyOpts) : undefined;
            // Gather all nonces
            const allNonces = new Set();
            if (oid4vp && (((_b = oid4vp.dcql) === null || _b === void 0 ? void 0 : _b.nonce) || ((_c = oid4vp.presentationExchange) === null || _c === void 0 ? void 0 : _c.nonce)))
                allNonces.add((_e = (_d = oid4vp.dcql) === null || _d === void 0 ? void 0 : _d.nonce) !== null && _e !== void 0 ? _e : (_f = oid4vp.presentationExchange) === null || _f === void 0 ? void 0 : _f.nonce);
            if (verifiedIdToken)
                allNonces.add(verifiedIdToken.payload.nonce);
            if (merged.nonce)
                allNonces.add(merged.nonce);
            // We only verify the nonce if there is one. We handle the case if the nonce is undefined
            // but it should be defined elsewhere. So if the nonce is undefined we don't have to verify it
            const firstNonce = Array.from(allNonces)[0];
            if (allNonces.size > 1) {
                throw new Error('both id token and VPs in vp token if present must have a nonce, and all nonces must be the same');
            }
            if (verifyOpts.nonce && firstNonce && firstNonce !== verifyOpts.nonce) {
                throw Error(types_1.SIOPErrors.BAD_NONCE);
            }
            const state = (_g = merged.state) !== null && _g !== void 0 ? _g : verifiedIdToken === null || verifiedIdToken === void 0 ? void 0 : verifiedIdToken.payload.state;
            if (!state) {
                throw Error('State is required');
            }
            return Object.assign(Object.assign(Object.assign({ authorizationResponse: this, verifyOpts, nonce: firstNonce, state, correlationId: verifyOpts.correlationId }, (this.idToken && { idToken: verifiedIdToken })), ((oid4vp === null || oid4vp === void 0 ? void 0 : oid4vp.presentationExchange) && { oid4vpSubmission: oid4vp.presentationExchange })), ((oid4vp === null || oid4vp === void 0 ? void 0 : oid4vp.dcql) && { oid4vpSubmissionDcql: oid4vp.dcql }));
        });
    }
    get authorizationRequest() {
        return this._authorizationRequest;
    }
    get payload() {
        return this._payload;
    }
    get options() {
        return this._options;
    }
    get idToken() {
        return this._idToken;
    }
    getMergedProperty(key, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = yield this.mergedPayloads(opts);
            return merged[key];
        });
    }
    mergedPayloads(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let nonce = this._payload.nonce;
            if ((_a = this._payload) === null || _a === void 0 ? void 0 : _a.vp_token) {
                let presentations;
                try {
                    presentations = (0, OpenID4VP_2.extractPresentationsFromDcqlVpToken)(this._payload.vp_token, opts);
                }
                catch (e) {
                    presentations = (0, OpenID4VP_1.extractPresentationsFromVpToken)(this._payload.vp_token, opts);
                }
                if (!presentations || (Array.isArray(presentations) && presentations.length === 0)) {
                    return Promise.reject(Error('missing presentation(s)'));
                }
                const presentationsArray = Array.isArray(presentations) ? presentations : [presentations];
                // We do not verify them, as that is done elsewhere. So we simply can take the first nonce
                nonce = presentationsArray
                    // FIXME toWrappedVerifiablePresentation() does not extract the nonce yet from mdocs.
                    // However the nonce is validated as part of the mdoc verification process (using the session transcript bytes)
                    // Once it is available we can also test it here, but it will be verified elsewhre as well
                    .filter((presentation) => !ssi_types_1.CredentialMapper.isWrappedMdocPresentation(presentation))
                    .map(OpenID4VP_1.extractNonceFromWrappedVerifiablePresentation)
                    .find((nonce) => nonce !== undefined);
            }
            const idTokenPayload = yield ((_b = this.idToken) === null || _b === void 0 ? void 0 : _b.payload());
            if ((opts === null || opts === void 0 ? void 0 : opts.consistencyCheck) !== false && idTokenPayload) {
                Object.entries(idTokenPayload).forEach((entry) => {
                    if (typeof entry[0] === 'string' && this.payload[entry[0]] && this.payload[entry[0]] !== entry[1]) {
                        throw Error(`Mismatch in Authorization Request and Request object value for ${entry[0]}`);
                    }
                });
            }
            if (!nonce && this._idToken) {
                nonce = (yield this._idToken.payload()).nonce;
            }
            return Object.assign(Object.assign(Object.assign({}, this.payload), idTokenPayload), { nonce });
        });
    }
}
exports.AuthorizationResponse = AuthorizationResponse;
//# sourceMappingURL=AuthorizationResponse.js.map