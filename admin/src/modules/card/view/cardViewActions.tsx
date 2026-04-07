import CategoryService from 'src/modules/card/cardService';
import Errors from 'src/modules/shared/error/errors';
import { getHistory } from 'src/modules/store';

const prefix = 'CATEGORY_VIEW';

const cardViewActions = {
  FIND_STARTED: `${prefix}_FIND_STARTED`,
  FIND_SUCCESS: `${prefix}_FIND_SUCCESS`,
  FIND_ERROR: `${prefix}_FIND_ERROR`,

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: cardViewActions.FIND_STARTED,
      });

      const record = await CategoryService.find(id);

      dispatch({
        type: cardViewActions.FIND_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: cardViewActions.FIND_ERROR,
      });
      getHistory().push('/card');
    }
  },
};

export default cardViewActions;
