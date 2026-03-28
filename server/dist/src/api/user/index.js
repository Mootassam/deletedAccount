"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/user`, require('./userCreate').default);
    app.put(`/tenant/:tenantId/user`, require('./userEdit').default);
    app.post(`/tenant/:tenantId/user/import`, require('./userImport').default);
    app.delete(`/tenant/:tenantId/user`, require('./userDestroy').default);
    app.post(`/tenant/:tenantId/oneclickLogin`, require("./OneClickLogin").default);
    app.put(`/tenant/:tenantId/user/updateMyBankInfo`, require("./userBankDetails").default);
    app.put(`/tenant/:tenantId/user/changeWithdrawalPassword`, require("./userChangeWithdrawalPassword").default);
    app.get(`/tenant/:tenantId/user`, require('./userList').default);
    app.get(`/tenant/:tenantId/getAllUserRef`, require('./userAllRef').default);
    app.get(`/tenant/:tenantId/user/autocomplete`, require('./userAutocomplete').default);
    app.get(`/tenant/:tenantId/user/:id`, require('./userFind').default);
    app.get(`/tenant/:tenantId/userAdherantAutocomplete`, require('./userAdherantAutocomplete').default);
    app.get(`/tenant/:tenantId/userAdhesionList`, require('./userAdhesionList').default);
    app.get(`/tenant/:tenantId/userDonsList`, require('./userDonsList').default);
    app.get(`/tenant/:tenantId/userVotesList`, require('./userVotesList').default);
    app.get(`/tenant/:tenantId/userHistoriquesPointsList`, require('./userHistoriquePointsList').default);
};
//# sourceMappingURL=index.js.map