const prisma = require('../config/prisma');
const { processConsoleCreated } = require('../services/achievementService');

const normalizeImages = (images) => {
  if (images === undefined || images === null) return [];
  return Array.isArray(images) ? images : [images];
};

const create = async (req, res) => {
  try {
    const {
      name,
      releaseDate,
      manufacturer,
      generation,
      mediaType,
      images,
      pricePaid,
      estimatedValue,
      rating,
      trivia,
    } = req.body;

    if (
      !name ||
      !releaseDate ||
      !manufacturer ||
      generation === undefined ||
      !mediaType ||
      pricePaid === undefined ||
      estimatedValue === undefined ||
      rating === undefined
    ) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    const consoleItem = await prisma.console.create({
      data: {
        name,
        releaseDate: new Date(releaseDate),
        manufacturer,
        generation: parseInt(generation, 10),
        mediaType,
        images: normalizeImages(images),
        pricePaid: parseFloat(pricePaid),
        estimatedValue: parseFloat(estimatedValue),
        rating: parseInt(rating, 10),
        trivia: trivia || null,
        userId: req.userId,
      },
    });

    const unlockedAchievements = await processConsoleCreated(req.userId);

    return res.status(201).json({ ...consoleItem, unlockedAchievements });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao criar console',
      details: error.message,
    });
  }
};

const list = async (req, res) => {
  try {
    const { manufacturer, generation, mediaType } = req.query;
    const where = { userId: req.userId };

    if (manufacturer) where.manufacturer = manufacturer;
    if (generation) where.generation = parseInt(generation, 10);
    if (mediaType) where.mediaType = mediaType;

    const consoles = await prisma.console.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(consoles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar consoles' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const consoleItem = await prisma.console.findFirst({
      where: { id, userId: req.userId },
      include: { games: true },
    });

    if (!consoleItem) {
      return res.status(404).json({ error: 'Console não encontrado' });
    }

    return res.status(200).json(consoleItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar console' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.console.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Console não encontrado' });
    }

    const {
      name,
      releaseDate,
      manufacturer,
      generation,
      mediaType,
      images,
      pricePaid,
      estimatedValue,
      rating,
      trivia,
    } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (releaseDate !== undefined) data.releaseDate = new Date(releaseDate);
    if (manufacturer !== undefined) data.manufacturer = manufacturer;
    if (generation !== undefined) data.generation = parseInt(generation, 10);
    if (mediaType !== undefined) data.mediaType = mediaType;
    if (images !== undefined) data.images = normalizeImages(images);
    if (pricePaid !== undefined) data.pricePaid = parseFloat(pricePaid);
    if (estimatedValue !== undefined) data.estimatedValue = parseFloat(estimatedValue);
    if (rating !== undefined) data.rating = parseInt(rating, 10);
    if (trivia !== undefined) data.trivia = trivia;

    const consoleItem = await prisma.console.update({
      where: { id },
      data,
    });

    return res.status(200).json(consoleItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao atualizar console',
      details: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.console.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Console não encontrado' });
    }

    await prisma.$transaction([
      prisma.game.deleteMany({
        where: {
          consoleId: id,
          userId: req.userId,
        },
      }),
      prisma.console.delete({
        where: { id },
      }),
    ]);

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    if (error.code === 'P2003') {
      return res.status(409).json({
        error: 'Não foi possível remover o console pois existem jogos vinculados',
      });
    }

    return res.status(500).json({ error: 'Erro ao remover console' });
  }
};

module.exports = { create, list, getById, update, delete: remove };
