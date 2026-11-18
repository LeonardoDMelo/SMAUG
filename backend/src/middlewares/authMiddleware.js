const prisma = require('../config/prisma');
const { verifyToken } = require('../utils/jwt');
const {
  ROLES,
  isAdminRole,
  isPrimaryAdminEmail,
  resolveRoleForEmail,
} = require('../constants/roles');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const expectedRole = resolveRoleForEmail(user.email, user.role);

    if (user.role !== expectedRole) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: expectedRole },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      req.user = updated;
    } else {
      req.user = user;
    }

    req.userId = req.user.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!isAdminRole(req.user?.role)) {
    return res.status(403).json({
      error: 'Acesso restrito a administradores',
    });
  }
  next();
};

const requirePrimaryAdmin = (req, res, next) => {
  if (
    req.user?.role !== ROLES.PRIMARY_ADMIN ||
    !isPrimaryAdminEmail(req.user?.email)
  ) {
    return res.status(403).json({
      error: 'Acesso restrito ao administrador principal',
    });
  }
  next();
};

module.exports = authMiddleware;
module.exports.requireAdmin = requireAdmin;
module.exports.requirePrimaryAdmin = requirePrimaryAdmin;
