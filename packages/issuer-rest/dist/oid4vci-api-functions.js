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
exports.getBasePath = exports.getBaseUrl = exports.determinePath = exports.getMetadataEndpoints = exports.pushedAuthorizationEndpoint = exports.createCredentialOfferEndpoint = exports.getCredentialOfferEndpoint = exports.notificationEndpoint = exports.getCredentialEndpoint = exports.accessTokenEndpoint = exports.getIssueStatusEndpoint = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const oid4vci_issuer_1 = require("@sphereon/oid4vci-issuer");
const ssi_express_support_1 = require("@sphereon/ssi-express-support");
const ssi_types_1 = require("@sphereon/ssi-types");
const IssuerTokenEndpoint_1 = require("./IssuerTokenEndpoint");
const expressUtils_1 = require("./expressUtils");
const expiresIn = process.env.EXPIRES_IN ? parseInt(process.env.EXPIRES_IN) : 90;
function getIssueStatusEndpoint(router, issuer, opts) {
    var _a;
    const path = determinePath(opts.baseUrl, (_a = opts === null || opts === void 0 ? void 0 : opts.path) !== null && _a !== void 0 ? _a : '/webapp/credential-offer-status', { stripBasePath: true });
    oid4vci_issuer_1.LOG.log(`[OID4VCI] getIssueStatus endpoint enabled at ${path}`);
    router.post(path, (request, response) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.body;
            const session = yield issuer.credentialOfferSessions.get(id);
            if (!session || !session.credentialOffer) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 404, {
                    error: 'invalid_request',
                    error_description: `Credential offer ${id} not found`,
                });
            }
            const authStatusBody = Object.assign(Object.assign({ createdAt: session.createdAt, lastUpdatedAt: session.lastUpdatedAt, status: session.status }, (session.error && { error: session.error })), (session.clientId && { clientId: session.clientId }));
            return response.send(JSON.stringify(authStatusBody));
        }
        catch (e) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 500, {
                error: 'invalid_request',
                error_description: e.message,
            }, e);
        }
    }));
}
exports.getIssueStatusEndpoint = getIssueStatusEndpoint;
function accessTokenEndpoint(router, issuer, opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const tokenEndpoint = issuer.issuerMetadata.token_endpoint;
    const externalAS = issuer.issuerMetadata.authorization_servers;
    if (externalAS) {
        oid4vci_issuer_1.LOG.log(`[OID4VCI] External Authorization Server ${tokenEndpoint} is being used. Not enabling issuer token endpoint`);
        return;
    }
    else if ((opts === null || opts === void 0 ? void 0 : opts.enabled) === false) {
        oid4vci_issuer_1.LOG.log(`[OID4VCI] Token endpoint is not enabled`);
        return;
    }
    const accessTokenIssuer = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.accessTokenIssuer) !== null && _a !== void 0 ? _a : process.env.ACCESS_TOKEN_ISSUER) !== null && _b !== void 0 ? _b : issuer.issuerMetadata.credential_issuer;
    const preAuthorizedCodeExpirationDuration = (_d = (_c = opts === null || opts === void 0 ? void 0 : opts.preAuthorizedCodeExpirationDuration) !== null && _c !== void 0 ? _c : (0, oid4vci_common_1.getNumberOrUndefined)(process.env.PRE_AUTHORIZED_CODE_EXPIRATION_DURATION)) !== null && _d !== void 0 ? _d : 300;
    const interval = (_f = (_e = opts === null || opts === void 0 ? void 0 : opts.interval) !== null && _e !== void 0 ? _e : (0, oid4vci_common_1.getNumberOrUndefined)(process.env.INTERVAL)) !== null && _f !== void 0 ? _f : 300;
    const tokenExpiresIn = (_g = opts === null || opts === void 0 ? void 0 : opts.tokenExpiresIn) !== null && _g !== void 0 ? _g : 300;
    // todo: this means we cannot sign JWTs or issue access tokens when configured from env vars!
    if ((opts === null || opts === void 0 ? void 0 : opts.accessTokenSignerCallback) === undefined) {
        throw new Error(oid4vci_common_1.JWT_SIGNER_CALLBACK_REQUIRED_ERROR);
    }
    else if (!accessTokenIssuer) {
        throw new Error(oid4vci_common_1.ACCESS_TOKEN_ISSUER_REQUIRED_ERROR);
    }
    const baseUrl = getBaseUrl(opts.baseUrl);
    // issuer is also AS
    const path = determinePath(baseUrl, (_j = (_h = opts === null || opts === void 0 ? void 0 : opts.tokenPath) !== null && _h !== void 0 ? _h : process.env.TOKEN_PATH) !== null && _j !== void 0 ? _j : '/token', {
        skipBaseUrlCheck: false,
        stripBasePath: true,
    });
    // let's fix any baseUrl ending with a slash as path will always start with a slash, and we already removed it at the end of the base url
    const url = new URL(`${baseUrl}${path}`);
    oid4vci_issuer_1.LOG.log(`[OID4VCI] Token endpoint enabled at ${url.toString()}`);
    // this.issuer.issuerMetadata.token_endpoint = url.toString()
    router.post(determinePath(baseUrl, url.pathname, { stripBasePath: true }), (0, IssuerTokenEndpoint_1.verifyTokenRequest)({
        issuer,
        preAuthorizedCodeExpirationDuration,
    }), (0, IssuerTokenEndpoint_1.handleTokenRequest)({
        issuer,
        accessTokenSignerCallback: opts.accessTokenSignerCallback,
        cNonceExpiresIn: issuer.cNonceExpiresIn,
        interval,
        tokenExpiresIn,
        accessTokenIssuer,
    }));
}
exports.accessTokenEndpoint = accessTokenEndpoint;
function getCredentialEndpoint(router, issuer, opts) {
    const endpoint = issuer.issuerMetadata.credential_endpoint;
    const baseUrl = getBaseUrl(opts.baseUrl);
    let path;
    if (!endpoint) {
        path = `/credentials`;
        issuer.issuerMetadata.credential_endpoint = `${baseUrl}${path}`;
    }
    else {
        path = determinePath(baseUrl, endpoint, { stripBasePath: true, skipBaseUrlCheck: false });
    }
    path = determinePath(baseUrl, path, { stripBasePath: true });
    oid4vci_issuer_1.LOG.log(`[OID4VCI] getCredential endpoint enabled at ${path}`);
    router.post(path, (request, response) => __awaiter(this, void 0, void 0, function* () {
        try {
            const credentialRequest = request.body;
            oid4vci_issuer_1.LOG.log(`credential request received`, credentialRequest);
            try {
                const jwt = (0, oid4vci_common_1.extractBearerToken)(request.header('Authorization'));
                yield (0, oid4vci_common_1.validateJWT)(jwt, { accessTokenVerificationCallback: opts.accessTokenVerificationCallback });
            }
            catch (e) {
                oid4vci_issuer_1.LOG.warning(e);
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                    error: 'invalid_token',
                });
            }
            const credential = yield issuer.issueCredential({
                credentialRequest: credentialRequest,
                tokenExpiresIn: opts.tokenExpiresIn,
                cNonceExpiresIn: opts.cNonceExpiresIn,
            });
            return response.send(credential);
        }
        catch (e) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 500, {
                error: 'invalid_request',
                error_description: e.message,
            }, e);
        }
    }));
}
exports.getCredentialEndpoint = getCredentialEndpoint;
function notificationEndpoint(router, issuer, opts) {
    const endpoint = issuer.issuerMetadata.notification_endpoint;
    const baseUrl = getBaseUrl(opts.baseUrl);
    if (!endpoint) {
        oid4vci_issuer_1.LOG.warning('Notification endpoint disabled as no "notification_endpoint" has been configured in issuer metadata');
        return;
    }
    const path = determinePath(baseUrl, endpoint, { stripBasePath: true });
    oid4vci_issuer_1.LOG.log(`[OID4VCI] notification endpoint enabled at ${path}`);
    router.post(path, (request, response) => __awaiter(this, void 0, void 0, function* () {
        try {
            const notificationRequest = request.body;
            oid4vci_issuer_1.LOG.log(`notification ${notificationRequest.event}/${notificationRequest.event_description} received for ${notificationRequest.notification_id}`);
            const jwt = (0, oid4vci_common_1.extractBearerToken)(request.header('Authorization'));
            oid4vci_common_1.EVENTS.emit(oid4vci_common_1.NotificationStatusEventNames.OID4VCI_NOTIFICATION_RECEIVED, {
                eventName: oid4vci_common_1.NotificationStatusEventNames.OID4VCI_NOTIFICATION_RECEIVED,
                id: (0, oid4vc_common_1.uuidv4)(),
                data: notificationRequest,
                initiator: jwt,
                initiatorType: ssi_types_1.InitiatorType.EXTERNAL,
                system: ssi_types_1.System.OID4VCI,
                subsystem: ssi_types_1.SubSystem.API,
            });
            try {
                const jwtResult = yield (0, oid4vci_common_1.validateJWT)(jwt, { accessTokenVerificationCallback: opts.accessTokenVerificationCallback });
                oid4vci_common_1.EVENTS.emit(oid4vci_common_1.NotificationStatusEventNames.OID4VCI_NOTIFICATION_PROCESSED, {
                    eventName: oid4vci_common_1.NotificationStatusEventNames.OID4VCI_NOTIFICATION_PROCESSED,
                    id: (0, oid4vc_common_1.uuidv4)(),
                    data: notificationRequest,
                    initiator: jwtResult.jwt,
                    initiatorType: ssi_types_1.InitiatorType.EXTERNAL,
                    system: ssi_types_1.System.OID4VCI,
                    subsystem: ssi_types_1.SubSystem.API,
                });
            }
            catch (e) {
                oid4vci_issuer_1.LOG.warning(e);
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                    error: 'invalid_token',
                });
            }
            // TODO Send event
            return response.status(204).send();
        }
        catch (e) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                error: 'invalid_notification_request',
                error_description: e.message,
            }, e);
        }
    }));
}
exports.notificationEndpoint = notificationEndpoint;
function getCredentialOfferEndpoint(router, issuer, opts) {
    var _a;
    const path = determinePath(opts === null || opts === void 0 ? void 0 : opts.baseUrl, (_a = opts === null || opts === void 0 ? void 0 : opts.path) !== null && _a !== void 0 ? _a : '/webapp/credential-offers/:id', { stripBasePath: true });
    oid4vci_issuer_1.LOG.log(`[OID4VCI] getCredentialOffer endpoint enabled at ${path}`);
    router.get(path, (request, response) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = request.params;
            const session = yield issuer.credentialOfferSessions.get(id);
            if (!session || !session.credentialOffer) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 404, {
                    error: 'invalid_request',
                    error_description: `Credential offer ${id} not found`,
                });
            }
            return response.send(JSON.stringify(session.credentialOffer.credential_offer));
        }
        catch (e) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 500, {
                error: 'invalid_request',
                error_description: e.message,
            }, e);
        }
    }));
}
exports.getCredentialOfferEndpoint = getCredentialOfferEndpoint;
function createCredentialOfferEndpoint(router, issuer, opts) {
    var _a;
    const path = determinePath(opts === null || opts === void 0 ? void 0 : opts.baseUrl, (_a = opts === null || opts === void 0 ? void 0 : opts.path) !== null && _a !== void 0 ? _a : '/webapp/credential-offers', { stripBasePath: true });
    oid4vci_issuer_1.LOG.log(`[OID4VCI] createCredentialOffer endpoint enabled at ${path}`);
    router.post(path, (request, response) => __awaiter(this, void 0, void 0, function* () {
        var _b;
        try {
            const specVersion = (0, oid4vci_common_1.determineSpecVersionFromOffer)(request.body.original_credential_offer);
            if (specVersion < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                    error: oid4vci_common_1.TokenErrorResponse.invalid_client,
                    error_description: 'credential offer request should be of spec version 1.0.13 or above',
                });
            }
            const grantTypes = (0, oid4vci_common_1.determineGrantTypes)(request.body);
            if (grantTypes.length === 0) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, { error: oid4vci_common_1.TokenErrorResponse.invalid_grant, error_description: 'No grant type supplied' });
            }
            const grants = request.body.grants;
            const credentialConfigIds = request.body.credential_configuration_ids;
            if (!credentialConfigIds || credentialConfigIds.length === 0) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                    error: oid4vci_common_1.TokenErrorResponse.invalid_request,
                    error_description: 'credential_configuration_ids missing credential_configuration_ids in credential offer payload',
                });
            }
            const qrCodeOpts = (_b = request.body.qrCodeOpts) !== null && _b !== void 0 ? _b : opts === null || opts === void 0 ? void 0 : opts.qrCodeOpts;
            const result = yield issuer.createCredentialOfferURI(Object.assign(Object.assign({}, request.body), { qrCodeOpts, grants }));
            const resultResponse = result;
            if ('session' in resultResponse) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete resultResponse.session;
            }
            return response.send(resultResponse);
        }
        catch (e) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 500, {
                error: oid4vci_common_1.TokenErrorResponse.invalid_request,
                error_description: e.message,
            }, e);
        }
    }));
}
exports.createCredentialOfferEndpoint = createCredentialOfferEndpoint;
function pushedAuthorizationEndpoint(router, issuer, authRequestsData, opts) {
    const handleHttpStatus400 = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.body) {
            return res.status(400).send({ error: 'invalid_request', error_description: 'Request body must be present' });
        }
        const required = ['client_id', 'code_challenge_method', 'code_challenge', 'redirect_uri'];
        const conditional = ['authorization_details', 'scope'];
        try {
            (0, expressUtils_1.validateRequestBody)({ required, conditional, body: req.body });
        }
        catch (e) {
            return (0, ssi_express_support_1.sendErrorResponse)(res, 400, {
                error: 'invalid_request',
                error_description: e.message,
            });
        }
        return next();
    });
    router.post('/par', handleHttpStatus400, (req, res) => {
        // FIXME Fake client for testing, it needs to come from a registered client
        const client = {
            scope: ['openid', 'test'],
            redirectUris: ['http://localhost:8080/*', 'https://www.test.com/*', 'https://test.nl', 'http://*/chart', 'http:*'],
        };
        // For security reasons the redirect_uri from the request needs to be matched against the ones present in the registered client
        const matched = client.redirectUris.filter((s) => new RegExp(s.replace('*', '.*')).test(req.body.redirect_uri));
        if (!matched.length) {
            return (0, ssi_express_support_1.sendErrorResponse)(res, 400, {
                error: 'invalid_request',
                error_description: 'redirect_uri is not valid for the given client',
            });
        }
        // The scopes from the request need to be matched against the ones present in the registered client
        if (!req.body.scope.split(',').every((scope) => client.scope.includes(scope))) {
            return (0, ssi_express_support_1.sendErrorResponse)(res, 400, {
                error: 'invalid_scope',
                error_description: 'scope is not valid for the given client',
            });
        }
        //TODO Implement authorization_details verification
        // TODO: Both UUID and requestURI need to be configurable for the server
        const uuid = (0, oid4vc_common_1.uuidv4)();
        const requestUri = `urn:ietf:params:oauth:request_uri:${uuid}`;
        // The redirect_uri is created and set in a map, to keep track of the actual request
        authRequestsData.set(requestUri, req.body);
        // Invalidates the request_uri removing it from the mapping after it is expired, needs to be refactored because
        // some of the properties will be needed in subsequent steps if the authorization succeeds
        // TODO in the /token endpoint the code_challenge must be matched against the hashed code_verifier
        setTimeout(() => {
            authRequestsData.delete(requestUri);
        }, expiresIn * 1000);
        return res.status(201).json({ request_uri: requestUri, expires_in: expiresIn });
    });
}
exports.pushedAuthorizationEndpoint = pushedAuthorizationEndpoint;
function getMetadataEndpoints(router, issuer) {
    const credentialIssuerHandler = (request, response) => {
        return response.send(issuer.issuerMetadata);
    };
    router.get(oid4vci_common_1.WellKnownEndpoints.OPENID4VCI_ISSUER, credentialIssuerHandler);
    const authorizationServerHandler = (request, response) => {
        return response.send(issuer.authorizationServerMetadata);
    };
    router.get(oid4vci_common_1.WellKnownEndpoints.OAUTH_AS, authorizationServerHandler);
}
exports.getMetadataEndpoints = getMetadataEndpoints;
function determinePath(baseUrl, endpoint, opts) {
    const basePath = baseUrl ? getBasePath(baseUrl) : '';
    let path = endpoint;
    if (opts === null || opts === void 0 ? void 0 : opts.prependUrl) {
        path = (0, oid4vci_common_1.adjustUrl)(path, { prepend: opts.prependUrl });
    }
    if ((opts === null || opts === void 0 ? void 0 : opts.skipBaseUrlCheck) !== true) {
        assertEndpointHasIssuerBaseUrl(baseUrl, endpoint);
    }
    if (endpoint.includes('://')) {
        path = new URL(endpoint).pathname;
    }
    path = `/${(0, oid4vci_common_1.trimBoth)(path, '/')}`;
    if ((opts === null || opts === void 0 ? void 0 : opts.stripBasePath) && path.startsWith(basePath)) {
        path = (0, oid4vci_common_1.trimStart)(path, basePath);
        path = `/${(0, oid4vci_common_1.trimBoth)(path, '/')}`;
    }
    return path;
}
exports.determinePath = determinePath;
function assertEndpointHasIssuerBaseUrl(baseUrl, endpoint) {
    if (!validateEndpointHasIssuerBaseUrl(baseUrl, endpoint)) {
        throw Error(`endpoint '${endpoint}' does not have base url '${baseUrl ? getBaseUrl(baseUrl) : '<no baseurl supplied>'}'`);
    }
}
function validateEndpointHasIssuerBaseUrl(baseUrl, endpoint) {
    if (!endpoint) {
        return false;
    }
    else if (!endpoint.includes('://')) {
        return true; //absolute or relative path, not containing a hostname
    }
    else if (!baseUrl) {
        return true;
    }
    return endpoint.startsWith(getBaseUrl(baseUrl));
}
function getBaseUrl(url) {
    var _a;
    let baseUrl = url;
    if (!baseUrl) {
        const envUrl = (0, ssi_express_support_1.env)('BASE_URL', (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.ENV_PREFIX);
        if (envUrl && envUrl.length > 0) {
            baseUrl = new URL(envUrl);
        }
    }
    if (!baseUrl) {
        throw Error(`No base URL provided`);
    }
    return (0, oid4vci_common_1.trimEnd)(baseUrl.toString(), '/');
}
exports.getBaseUrl = getBaseUrl;
function getBasePath(url) {
    const basePath = new URL(getBaseUrl(url)).pathname;
    if (basePath === '' || basePath === '/') {
        return '';
    }
    return `/${(0, oid4vci_common_1.trimBoth)(basePath, '/')}`;
}
exports.getBasePath = getBasePath;
//# sourceMappingURL=oid4vci-api-functions.js.map