const prisma = require('../config/prisma');
const { checkAndGrantAchievement } = require('../services/achievementService');

const list = async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { title: 'asc' },
      include: {
        users: {
          where: { userId: req.userId },
          select: {
            id: true,
            unlockedAt: true,
          },
        },
      },
    });

    const data = achievements.map((achievement) => ({
      id: achievement.id,
      code: achievement.code,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlocked: achievement.users.length > 0,
      unlockedAt: achievement.users[0]?.unlockedAt || null,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar conquistas' });
  }
};

const clearUnlocked = async (req, res) => {
  try {
    await prisma.userAchievement.deleteMany({
      where: { userId: req.userId },
    });

    return res.status(200).json({ message: 'Conquistas limpas' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao limpar conquistas' });
  }
};

const grant = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código da conquista é obrigatório' });
    }

    const exists = await prisma.achievement.findUnique({ where: { code } });

    if (!exists) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }

    const unlocked = await checkAndGrantAchievement(req.userId, code);

    return res.status(200).json({
      message: unlocked ? 'Conquista ativada' : 'Conquista já estava desbloqueada',
      code,
      unlockedAchievements: unlocked ? [unlocked] : [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao ativar conquista' });
  }
};

const grantAll = async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      select: { code: true },
    });

    const unlockedAchievements = [];

    for (const achievement of achievements) {
      const unlocked = await checkAndGrantAchievement(req.userId, achievement.code);
      if (unlocked) unlockedAchievements.push(unlocked);
    }

    return res.status(200).json({
      message: 'Todas as conquistas ativadas',
      unlockedAchievements,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao ativar conquistas' });
  }
};

const revoke = async (req, res) => {
  try {
    const { code } = req.params;

    const achievement = await prisma.achievement.findUnique({
      where: { code },
    });

    if (!achievement) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }

    await prisma.userAchievement.deleteMany({
      where: {
        userId: req.userId,
        achievementId: achievement.id,
      },
    });

    return res.status(200).json({ message: 'Conquista removida', code });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao remover conquista' });
  }
};

module.exports = { list, clearUnlocked, grant, grantAll, revoke };
