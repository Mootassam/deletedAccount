import { createSelector } from 'reselect';

const selectRaw = (state) => state.category.destroy;

const selectLoading = createSelector([selectRaw], (raw) =>
  Boolean(raw.loading),
);

const cardDestroySelectors = {
  selectLoading,
};

export default cardDestroySelectors;
