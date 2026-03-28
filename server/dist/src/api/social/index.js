"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/social/add`, require('./create').default);
    app.post(`/socail/update`, require('./update').default);
};
//# sourceMappingURL=index.js.map