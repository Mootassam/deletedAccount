"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/company`, require("./CompanyCreate").default);
    app.put(`/tenant/:tenantId/company/:id`, require("./CompanyCreate").default);
    app.get(`/tenant/:tenantId/company`, require("./CompanyList").default);
    app.get(`/tenant/:tenantId/company/:id`, require("./CompanyFind").default);
};
//# sourceMappingURL=index.js.map