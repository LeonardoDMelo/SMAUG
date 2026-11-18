const prisma = require('../config/prisma');
const {
  ROLES,
  isPrimaryAdminEmail,
  publicUser,
} = require('../constants/roles');

const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json(users.map(publicUser));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isSecondaryAdmin } = req.body;

    let nextRole = role;

    if (typeof isSecondaryAdmin === 'boolean') {
      nextRole = isSecondaryAdmin ? ROLES.SECONDARY_ADMIN : ROLES.USER;
    }

    if (![ROLES.USER, ROLES.SECONDARY_ADMIN].includes(nextRole)) {
      return res.status(400).json({
        error: 'Papel inválido. Use USER ou SECONDARY_ADMIN',
      });
    }

    const target = await prisma.user.findUnique({ where: { id } });

    if (!target) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (isPrimaryAdminEmail(target.email) || target.role === ROLES.PRIMARY_ADMIN) {
      return res.status(403).json({
        error: 'Não é permitido alterar o administrador principal',
      });
    }

    if (target.id === req.userId) {
      return res.status(403).json({
        error: 'Você não pode alterar o próprio papel por esta tela',
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: nextRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message:
        nextRole === ROLES.SECONDARY_ADMIN
          ? 'Usuário promovido a administrador secundário'
          : 'Usuário definido como usuário comum',
      user: publicUser(updated),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar papel do usuário' });
  }
};

module.exports = { listUsers, updateUserRole };
