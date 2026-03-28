"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error402 extends Error {
    constructor(messageCode) {
        let message;
        if (messageCode) {
            message = messageCode;
        }
        message = message || 'errors.validation.message';
        super(message);
        this.code = 400;
    }
}
exports.default = Error402;
//# sourceMappingURL=Error402.js.map