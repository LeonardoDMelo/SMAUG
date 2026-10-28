const prisma = require('../config/prisma');

const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [
      totalConsoles,
      totalGames,
      consoleSums,
      gameSums,
      gamesByConsoleGroup,
      gamesForGenres,
    ] = await Promise.all([
      prisma.console.count({ where: { userId } }),
      prisma.game.count({ where: { userId } }),
      prisma.console.aggregate({
        where: { userId },
        _sum: { pricePaid: true, estimatedValue: true },
      }),
      prisma.game.aggregate({
        where: { userId },
        _sum: { pricePaid: true, estimatedValue: true },
      }),
      prisma.game.groupBy({
        by: ['consoleName'],
        where: { userId },
        _count: { _all: true },
        orderBy: { consoleName: 'asc' },
      }),
      prisma.game.findMany({
        where: { userId },
        select: { genres: true },
      }),
    ]);

    const totalSpent =
      (consoleSums._sum.pricePaid || 0) + (gameSums._sum.pricePaid || 0);

    const totalEstimatedValue =
      (consoleSums._sum.estimatedValue || 0) +
      (gameSums._sum.estimatedValue || 0);

    const gamesByConsole = gamesByConsoleGroup.map((item) => ({
      name: item.consoleName,
      value: item._count._all,
    }));

    const genreCounts = {};
    for (const game of gamesForGenres) {
      for (const genre of game.genres || []) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    }

    const gamesByGenre = Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json({
      totalConsoles,
      totalGames,
      totalSpent,
      totalEstimatedValue,
      gamesByConsole,
      gamesByGenre,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

module.exports = { getStats };
