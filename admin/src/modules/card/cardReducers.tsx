import list from 'src/modules/card/list/cardListReducers';
import form from 'src/modules/card/form/cardFormReducers';
import view from 'src/modules/card/view/cardViewReducers';
import destroy from 'src/modules/card/destroy/cardDestroyReducers';
import importerReducer from 'src/modules/card/importer/cardImporterReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  view,
  destroy,
  importer: importerReducer,
});
