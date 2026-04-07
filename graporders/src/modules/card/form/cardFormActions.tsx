import Errors from 'src/modules/shared/error/errors';
import Message from 'src/view/shared/message';
import { getHistory } from 'src/modules/store';
import { i18n } from "../../../i18n";
import CardService from 'src/modules/card/cardService';

const prefix = 'CARD_FORM';

const cardFormActions = {
  INIT_STARTED: `${prefix}_INIT_STARTED`,
  INIT_SUCCESS: `${prefix}_INIT_SUCCESS`,
  INIT_ERROR: `${prefix}_INIT_ERROR`,

  CREATE_STARTED: `${prefix}_CREATE_STARTED`,
  CREATE_SUCCESS: `${prefix}_CREATE_SUCCESS`,
  CREATE_ERROR: `${prefix}_CREATE_ERROR`,

  UPDATE_STARTED: `${prefix}_UPDATE_STARTED`,
  UPDATE_SUCCESS: `${prefix}_UPDATE_SUCCESS`,
  UPDATE_ERROR: `${prefix}_UPDATE_ERROR`,

  doInit: (id) => async (dispatch) => {
    try {
      dispatch({
        type: cardFormActions.INIT_STARTED,
      });

      let record = {};

      const isEdit = Boolean(id);

      if (isEdit) {
        record = await CardService.find(id);
      }

      dispatch({
        type: cardFormActions.INIT_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: cardFormActions.INIT_ERROR,
      });

      getHistory().push('/withdraw ');
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: cardFormActions.CREATE_STARTED,
      });

      await CardService.create(values);

      dispatch({
        type: cardFormActions.CREATE_SUCCESS,
      });

      Message.success(
        i18n('entities.transaction.create.success'),
      );

      getHistory().push('/withdraw ');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: cardFormActions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (id, values) => async (dispatch, getState) => {
    try {
      dispatch({
        type: cardFormActions.UPDATE_STARTED,
      });

      await CardService.update(id, values);

      dispatch({
        type: cardFormActions.UPDATE_SUCCESS,
      });

      Message.success(
        i18n('entities.transaction.update.success'),
      );

      getHistory().push('/withdraw ');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: cardFormActions.UPDATE_ERROR,
      });
    }
  },
};

export default cardFormActions;
