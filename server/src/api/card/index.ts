export default (app) => {
  app.post(`/tenant/:tenantId/card`, require("./cardCreate").default);
  app.put(
    `/tenant/:tenantId/category/:id`,
    require("./cardUpdate").default
  );
  app.post(
    `/tenant/:tenantId/category/import`,
    require("./cardImport").default
  );
  app.delete(
    `/tenant/:tenantId/card`,
    require("./cardDestroy").default
  );
  app.get(
    `/tenant/:tenantId/category/autocomplete`,
    require("./cardAutocomplete").default
  );
  app.get(`/tenant/:tenantId/card`, require("./cardList").default);
    app.get(`/tenant/card`, require("./cardList").default);

  app.get(`/tenant/category/all`, require("./cardAll").default);
  app.get(`/tenant/:tenantId/category/:id`, require("./cardFind").default);
};
