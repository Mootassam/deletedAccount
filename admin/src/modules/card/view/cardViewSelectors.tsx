import { createSelector } from 'reselect';

const selectRaw = (state) => state.category.view;

const selectRecord = createSelector(
  [selectRaw],
  (raw) => raw.record,
);

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const cardViewSelectors = {
  selectLoading,
  selectRecord,
  selectRaw,
};

export default cardViewSelectors;
