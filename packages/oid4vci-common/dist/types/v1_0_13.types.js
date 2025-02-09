"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialIssuerMetadataFieldNames = void 0;
// These can be used be a reducer
exports.credentialIssuerMetadataFieldNames = [
    // Required fields
    'credential_issuer',
    'credential_configurations_supported',
    'credential_endpoint',
    // Optional fields from CredentialIssuerMetadataOpts
    'batch_credential_endpoint',
    'deferred_credential_endpoint',
    'notification_endpoint',
    'credential_response_encryption',
    'authorization_servers',
    'token_endpoint',
    'display',
    'credential_supplier_config',
    // Optional fields from v1.0.13
    'credential_identifiers_supported',
    'signed_metadata'
];
//# sourceMappingURL=v1_0_13.types.js.map