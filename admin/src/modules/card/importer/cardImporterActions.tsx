import importerActions from 'src/modules/shared/importer/importerActions';
import selectors from 'src/modules/card/importer/cardImporterSelectors';
import CategoryService from 'src/modules/card/cardService';
import fields from 'src/modules/card/importer/cardImporterFields';
import { i18n } from 'src/i18n';

const cardImporterActions = importerActions(
  'CATEGORY_IMPORTER',
  selectors,
  CategoryService.import,
  fields,
  i18n('entities.category.importer.fileName'),
);

export default cardImporterActions;