export const ROLES = {
  USER: 'USER',
  SECONDARY_ADMIN: 'SECONDARY_ADMIN',
  PRIMARY_ADMIN: 'PRIMARY_ADMIN',
};

export const PRIMARY_ADMIN_EMAIL = 'leonardodavimelo@live.com';

export const isAdminRole = (role) =>
  role === ROLES.PRIMARY_ADMIN || role === ROLES.SECONDARY_ADMIN;

export const isPrimaryAdminRole = (role) => role === ROLES.PRIMARY_ADMIN;

export const roleLabel = (role) => {
  switch (role) {
    case ROLES.PRIMARY_ADMIN:
      return 'Adm principal';
    case ROLES.SECONDARY_ADMIN:
      return 'Adm secundário';
    default:
      return 'Usuário comum';
  }
};
