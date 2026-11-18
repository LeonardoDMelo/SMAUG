const ROLES = {
  USER: 'USER',
  SECONDARY_ADMIN: 'SECONDARY_ADMIN',
  PRIMARY_ADMIN: 'PRIMARY_ADMIN',
};

const PRIMARY_ADMIN_EMAIL = 'leonardodavimelo@live.com';

const isPrimaryAdminEmail = (email = '') =>
  String(email).trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

const isAdminRole = (role) =>
  role === ROLES.PRIMARY_ADMIN || role === ROLES.SECONDARY_ADMIN;

const resolveRoleForEmail = (email, currentRole = ROLES.USER) => {
  if (isPrimaryAdminEmail(email)) {
    return ROLES.PRIMARY_ADMIN;
  }

  if (currentRole === ROLES.PRIMARY_ADMIN) {
    return ROLES.USER;
  }

  return currentRole || ROLES.USER;
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

module.exports = {
  ROLES,
  PRIMARY_ADMIN_EMAIL,
  isPrimaryAdminEmail,
  isAdminRole,
  resolveRoleForEmail,
  publicUser,
};
