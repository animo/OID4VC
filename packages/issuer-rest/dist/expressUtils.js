"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestBody = void 0;
const validateRequestBody = ({ required, conditional, body, }) => {
    const keys = Object.keys(body);
    let message;
    if (required && !required.every((k) => keys.includes(k))) {
        message = `Request must contain ${required.toString()}`;
    }
    if (conditional && !conditional.some((k) => keys.includes(k))) {
        message = message ? `and request must contain ether ${conditional.toString()}` : `Request must contain ether ${conditional.toString()}`;
    }
    if (message) {
        throw new Error(message);
    }
};
exports.validateRequestBody = validateRequestBody;
//# sourceMappingURL=expressUtils.js.map