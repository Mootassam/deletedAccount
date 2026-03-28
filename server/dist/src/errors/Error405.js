"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error405 extends Error {
    constructor(message) {
        super(message);
        this.code = 400;
    }
}
exports.default = Error405;
//# sourceMappingURL=Error405.js.map