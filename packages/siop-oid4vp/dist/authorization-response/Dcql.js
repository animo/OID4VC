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
exports.assertValidDcqlPresentationResult = exports.getDcqlPresentationResult = exports.findValidDcqlQuery = void 0;
const dcql_1 = require("dcql");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const OpenID4VP_1 = require("./OpenID4VP");
/**
 * Finds a valid DcqlQuery inside the given AuthenticationRequestPayload
 * throws exception if the DcqlQuery is not valid
 * returns the decoded dcql query if a valid instance found
 * @param authorizationRequestPayload object that can have a dcql_query inside
 * @param version
 */
const findValidDcqlQuery = (authorizationRequestPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const dcqlQuery = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.dcql_query').map((d) => d.value);
    const definitions = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition');
    const definitionsFromList = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition[*]');
    const definitionRefs = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition_uri');
    const definitionRefsFromList = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition_uri[*]');
    const hasPD = (definitions && definitions.length > 0) || (definitionsFromList && definitionsFromList.length > 0);
    const hasPdRef = (definitionRefs && definitionRefs.length > 0) || (definitionRefsFromList && definitionRefsFromList.length > 0);
    const hasDcql = dcqlQuery && dcqlQuery.length > 0;
    if ([hasPD, hasPdRef, hasDcql].filter(Boolean).length > 1) {
        throw new Error(types_1.SIOPErrors.REQUEST_CLAIMS_PRESENTATION_NON_EXCLUSIVE);
    }
    if (dcqlQuery.length === 0)
        return undefined;
    if (dcqlQuery.length > 1) {
        throw new Error('Found multiple dcql_query in vp_token. Only one is allowed');
    }
    return dcql_1.DcqlQuery.parse(JSON.parse(dcqlQuery[0]));
});
exports.findValidDcqlQuery = findValidDcqlQuery;
const getDcqlPresentationResult = (record, dcqlQuery, opts) => {
    const dcqlPresentation = Object.fromEntries(Object.entries((0, OpenID4VP_1.extractDcqlPresentationFromDcqlVpToken)(record, opts)).map(([queryId, p]) => {
        if (p.format === 'mso_mdoc') {
            return [
                queryId,
                { credential_format: 'mso_mdoc', doctype: p.vcs[0].credential.toJson().docType, namespaces: p.vcs[0].decoded },
            ];
        }
        else if (p.format === 'vc+sd-jwt') {
            return [queryId, { credential_format: 'vc+sd-jwt', vct: p.vcs[0].decoded.vct, claims: p.vcs[0].decoded }];
        }
        else {
            throw new Error('DcqlPresentation atm only supports mso_mdoc and vc+sd-jwt');
        }
    }));
    return dcql_1.DcqlPresentationResult.fromDcqlPresentation(dcqlPresentation, { dcqlQuery });
};
exports.getDcqlPresentationResult = getDcqlPresentationResult;
const assertValidDcqlPresentationResult = (record, dcqlQuery, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, exports.getDcqlPresentationResult)(record, dcqlQuery, opts);
    return dcql_1.DcqlPresentationResult.validate(result);
});
exports.assertValidDcqlPresentationResult = assertValidDcqlPresentationResult;
//# sourceMappingURL=Dcql.js.map