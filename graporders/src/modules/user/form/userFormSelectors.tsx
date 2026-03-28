import { createSelector } from 'reselect';

const selectRaw = (state) => state.user.form;

const selectUser = createSelector(
  [selectRaw],
  (raw) => raw.user,
);

const selectInitLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.initLoading),
);

const selectFetchinigLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.fetching),
);

const selectList = createSelector(
  [selectRaw],
  (raw) => raw.list,
);
const selectSaveLoading = createSelector(
  [selectRaw],
  (raw) => Boolean(raw.saveLoading),
);

const userFormSelectors = {
  selectInitLoading,
  selectSaveLoading,
  selectUser,
  selectFetchinigLoading,
  selectList,
  selectRaw,
};

export default userFormSelectors;
