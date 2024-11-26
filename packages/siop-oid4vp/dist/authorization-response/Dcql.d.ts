import { Hasher } from '@sphereon/ssi-types';
import { DcqlPresentation, DcqlQuery } from 'dcql';
import { AuthorizationRequestPayload } from '../types';
/**
 * Finds a valid DcqlQuery inside the given AuthenticationRequestPayload
 * throws exception if the DcqlQuery is not valid
 * returns the decoded dcql query if a valid instance found
 * @param authorizationRequestPayload object that can have a dcql_query inside
 * @param version
 */
export declare const findValidDcqlQuery: (authorizationRequestPayload: AuthorizationRequestPayload) => Promise<DcqlQuery | undefined>;
export declare const getDcqlPresentationResult: (record: DcqlPresentation | string, dcqlQuery: DcqlQuery, opts: {
    hasher?: Hasher;
}) => {
    credentials: [{
        id: string;
        format: "mso_mdoc";
        claims?: [{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            doctype_value?: string;
        };
    } | {
        id: string;
        format: "vc+sd-jwt";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            vct_values?: string[];
        };
    } | {
        id: string;
        format: "jwt_vc_json" | "jwt_vc_json-ld";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
    }, ...({
        id: string;
        format: "mso_mdoc";
        claims?: [{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            doctype_value?: string;
        };
    } | {
        id: string;
        format: "vc+sd-jwt";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            vct_values?: string[];
        };
    } | {
        id: string;
        format: "jwt_vc_json" | "jwt_vc_json-ld";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
    })[]];
    invalid_matches: {
        [x: string]: {
            output: unknown;
            issues: [unknown, ...unknown[]];
            presentation_id: string;
            success: false;
            typed: boolean;
            claim_set_index: number;
        };
    };
    valid_matches: {
        [x: string]: {
            output: {
                credential_format: "mso_mdoc";
                doctype: string;
                namespaces: {
                    [x: string]: {
                        [x: string]: unknown;
                    };
                };
            } | {
                claims: {
                    [x: string]: import("dcql/dist/src/u-dcql").Json;
                };
                credential_format: "vc+sd-jwt";
                vct: string;
            } | {
                claims: {
                    [x: string]: import("dcql/dist/src/u-dcql").Json;
                };
                credential_format: "jwt_vc_json" | "jwt_vc_json-ld";
            };
            presentation_id: string;
            success: true;
            typed: true;
            claim_set_index: number;
        };
    };
    canBeSatisfied: boolean;
    credential_sets?: [{
        options: [string[], ...string[][]];
        required: boolean;
        matching_options: [string[], ...string[][]];
        purpose?: string | number | {
            [x: string]: unknown;
        };
    }, ...{
        options: [string[], ...string[][]];
        required: boolean;
        matching_options: [string[], ...string[][]];
        purpose?: string | number | {
            [x: string]: unknown;
        };
    }[]];
};
export declare const assertValidDcqlPresentationResult: (record: DcqlPresentation | string, dcqlQuery: DcqlQuery, opts: {
    hasher?: Hasher;
}) => Promise<{
    credentials: [{
        id: string;
        format: "mso_mdoc";
        claims?: [{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            doctype_value?: string;
        };
    } | {
        id: string;
        format: "vc+sd-jwt";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            vct_values?: string[];
        };
    } | {
        id: string;
        format: "jwt_vc_json" | "jwt_vc_json-ld";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
    }, ...({
        id: string;
        format: "mso_mdoc";
        claims?: [{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            namespace: string;
            claim_name: string;
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            doctype_value?: string;
        };
    } | {
        id: string;
        format: "vc+sd-jwt";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
        meta?: {
            vct_values?: string[];
        };
    } | {
        id: string;
        format: "jwt_vc_json" | "jwt_vc_json-ld";
        claims?: [{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }, ...{
            path: (string | number)[];
            values?: (string | number | boolean)[];
            id?: string;
        }[]];
        claim_sets?: [string[], ...string[][]];
    })[]];
    canBeSatisfied: boolean;
    invalid_matches: {
        [x: string]: {
            output: unknown;
            issues: [unknown, ...unknown[]];
            success: false;
            typed: boolean;
            claim_set_index: number;
            presentation_id: string;
        };
    };
    valid_matches: {
        [x: string]: {
            output: {
                credential_format: "mso_mdoc";
                doctype: string;
                namespaces: {
                    [x: string]: {
                        [x: string]: unknown;
                    };
                };
            } | {
                credential_format: "vc+sd-jwt";
                vct: string;
                claims: {
                    [x: string]: import("dcql/dist/src/u-dcql").Json;
                };
            } | {
                credential_format: "jwt_vc_json" | "jwt_vc_json-ld";
                claims: {
                    [x: string]: import("dcql/dist/src/u-dcql").Json;
                };
            };
            success: true;
            typed: true;
            claim_set_index: number;
            presentation_id: string;
        };
    };
    credential_sets?: [{
        options: [string[], ...string[][]];
        required: boolean;
        matching_options: [string[], ...string[][]];
        purpose?: string | number | {
            [x: string]: unknown;
        };
    }, ...{
        options: [string[], ...string[][]];
        required: boolean;
        matching_options: [string[], ...string[][]];
        purpose?: string | number | {
            [x: string]: unknown;
        };
    }[]];
}>;
//# sourceMappingURL=Dcql.d.ts.map