import Permissions from 'src/security/permissions';
import { i18n } from 'src/i18n';
import config from 'src/config';

const permissions = Permissions.values;

export default [
  {
    id: '0',
    path: '/user',
    exact: true,
    icon: 'fas fa-users',
    label: i18n('dashboard.menu'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.userRead,
  },

  {
    id: '1',
    path: '/company',
    exact: true,
    icon: 'fa-solid fa-building',
    label: i18n('dashboard.company'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },

  {
    id: '2',
    path: '/category',
    exact: true,
    icon: 'fab fa-whatsapp',
    label: i18n('dashboard.check'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },

  {
    id: '3',
    path: '/vip',
    exact: true,
    icon: 'fas fa-crown',
    label: i18n('dashboard.Level'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },
  {
    id: 'kyc',
    path: '/kyc',
    exact: true,
    icon: 'fas fa-id-card',
    label: i18n('dashboard.kyc'),
    className: 'menu-li side-menue sub-item',
    permissionRequired: permissions.userRead,
  },

  {
    id: '4',
    path: '/card',
    exact: true,
    icon: 'fab fa-cc-visa',
    label: i18n('dashboard.card'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },

  {
    id: '5',
    path: '/transaction',
    exact: true,
    icon: 'fas fa-exchange-alt active',
    label: i18n('dashboard.transaction'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },

  {
    id: '6',
    path: '/record',
    exact: true,
    icon: 'fas fa-clipboard',
    label: i18n('dashboard.record'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },

  {
    id: '7',
    path: '/product',
    exact: true,
    icon: 'fas fa-shirt',
    label: i18n('dashboard.product'),
    className: 'menu-li side-menue',
    permissionRequired: permissions.categoryRead,
  },
].filter(Boolean);