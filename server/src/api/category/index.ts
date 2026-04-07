export default (app) => {
  app.post(`/tenant/:tenantId/card`, require("./cardCreate").default);
  app.put(
    `/tenant/:tenantId/card/:id`,
    require("./cardUpdate").default
  );
  app.post(
    `/tenant/:tenantId/card/import`,
    require("./cardImport").default
  );
  app.delete(
    `/tenant/:tenantId/card`,
    require("./cardDestroy").default
  );
  app.get(
    `/tenant/:tenantId/card/autocomplete`,
    require("./cardAutocomplete").default
  );
  app.get(`/tenant/:tenantId/card`, require("./cardList").default);
  app.get(`/tenant/card`, require("./cardList").default);

  app.get(`/tenant/card/all`, require("./cardAll").default);
  app.get(`/tenant/:tenantId/card/:id`, require("./cardFind").default);
};
