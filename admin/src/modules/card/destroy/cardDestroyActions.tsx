import listActions from 'src/modules/card/list/cardListActions';
import CategoryService from 'src/modules/card/cardService';
import Errors from 'src/modules/shared/error/errors';
import { i18n } from 'src/i18n';
import { getHistory } from 'src/modules/store';
import Message from 'src/view/shared/message';

const prefix = 'CARD_DESTROY';

const cardDestroyActions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,

  DESTROY_ALL_STARTED: `${prefix}_DESTROY_ALL_STARTED`,
  DESTROY_ALL_SUCCESS: `${prefix}_DESTROY_ALL_SUCCESS`,
  DESTROY_ALL_ERROR: `${prefix}_DESTROY_ALL_ERROR`,

  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: cardDestroyActions.DESTROY_STARTED,
      });

      await CategoryService.destroyAll([id]);

      dispatch({
        type: cardDestroyActions.DESTROY_SUCCESS,
      });

      Message.success(
        i18n('entities.category.destroy.success'),
      );

      dispatch(listActions.doFetchCurrentFilter());

      getHistory().push('/card');
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: cardDestroyActions.DESTROY_ERROR,
      });
    }
  },

  doDestroyAll: (ids) => async (dispatch) => {
    try {
      dispatch({
        type: cardDestroyActions.DESTROY_ALL_STARTED,
      });

      await CategoryService.destroyAll(ids);

      dispatch({
        type: cardDestroyActions.DESTROY_ALL_SUCCESS,
      });

      if (listActions) {
        dispatch(listActions.doClearAllSelected());
        dispatch(listActions.doFetchCurrentFilter());
      }

      Message.success(
        i18n('entities.category.destroyAll.success'),
      );

      getHistory().push('/card');
    } catch (error) {
      Errors.handle(error);

      dispatch(listActions.doFetchCurrentFilter());

      dispatch({
        type: cardDestroyActions.DESTROY_ALL_ERROR,
      });
    }
  },
};

export default cardDestroyActions;
