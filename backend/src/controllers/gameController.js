const prisma = require('../config/prisma');
const { processGameCreated } = require('../services/achievementService');

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const normalizeGenres = (genres, genre) => {
  if (Array.isArray(genres)) {
    return [...new Set(genres.map((item) => String(item).trim()).filter(Boolean))];
  }

  if (typeof genres === 'string' && genres.trim()) {
    return [...new Set(genres.split('/').map((item) => item.trim()).filter(Boolean))];
  }

  if (typeof genre === 'string' && genre.trim()) {
    return [...new Set(genre.split('/').map((item) => item.trim()).filter(Boolean))];
  }

  return [];
};

const create = async (req, res) => {
  try {
    const {
      name,
      releaseDate,
      developer,
      saga,
      genres,
      genre,
      consoleName,
      synopsis,
      trivia,
      coverUrl,
      pricePaid,
      estimatedValue,
      rating,
    } = req.body;

    const normalizedGenres = normalizeGenres(genres, genre);

    if (
      !name ||
      !releaseDate ||
      !developer ||
      normalizedGenres.length === 0 ||
      !consoleName ||
      pricePaid === undefined ||
      estimatedValue === undefined ||
      rating === undefined
    ) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    const ownedConsole = await prisma.console.findFirst({
      where: {
        userId: req.userId,
        name: consoleName,
      },
    });

    const game = await prisma.game.create({
      data: {
        name,
        releaseDate: new Date(releaseDate),
        developer,
        saga: saga || null,
        genres: normalizedGenres,
        consoleName,
        consoleId: ownedConsole?.id || null,
        synopsis: synopsis || null,
        trivia: trivia || null,
        coverUrl: coverUrl || null,
        pricePaid: parseFloat(pricePaid),
        estimatedValue: parseFloat(estimatedValue),
        rating: parseInt(rating, 10),
        userId: req.userId,
      },
      include: {
        console: {
          select: { id: true, name: true },
        },
      },
    });

    const unlockedAchievements = await processGameCreated(req.userId);

    return res.status(201).json({ ...game, unlockedAchievements });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao criar jogo',
      details: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const { saga, developer } = req.query;
    const genres = toArray(req.query.genres || req.query.genre);
    const consoleNames = toArray(req.query.consoleNames || req.query.consoleName);
    const where = { userId: req.userId };

    if (genres.length) where.genres = { hasSome: genres };
    if (consoleNames.length) where.consoleName = { in: consoleNames };
    if (saga) where.saga = saga;
    if (developer) where.developer = developer;

    const games = await prisma.game.findMany({
      where,
      include: {
        console: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(games);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar jogos' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await prisma.game.findFirst({
      where: { id, userId: req.userId },
      include: {
        console: {
          select: { id: true, name: true },
        },
      },
    });

    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar jogo' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.game.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    const {
      name,
      releaseDate,
      developer,
      saga,
      genres,
      genre,
      consoleName,
      synopsis,
      trivia,
      coverUrl,
      pricePaid,
      estimatedValue,
      rating,
    } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (releaseDate !== undefined) data.releaseDate = new Date(releaseDate);
    if (developer !== undefined) data.developer = developer;
    if (saga !== undefined) data.saga = saga;
    if (genres !== undefined || genre !== undefined) {
      data.genres = normalizeGenres(genres, genre);
    }
    if (synopsis !== undefined) data.synopsis = synopsis;
    if (trivia !== undefined) data.trivia = trivia;
    if (coverUrl !== undefined) data.coverUrl = coverUrl;
    if (pricePaid !== undefined) data.pricePaid = parseFloat(pricePaid);
    if (estimatedValue !== undefined) data.estimatedValue = parseFloat(estimatedValue);
    if (rating !== undefined) data.rating = parseInt(rating, 10);

    if (consoleName !== undefined) {
      data.consoleName = consoleName;
      const ownedConsole = await prisma.console.findFirst({
        where: {
          userId: req.userId,
          name: consoleName,
        },
      });
      data.consoleId = ownedConsole?.id || null;
    }

    const game = await prisma.game.update({
      where: { id },
      data,
      include: {
        console: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(200).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao atualizar jogo',
      details: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.game.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    await prisma.game.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao remover jogo' });
  }
};

module.exports = { create, list, getById, update, delete: remove };
