const prisma = require('../config/prisma');

const STATIC_QUESTIONS = [
  {
    id: 1,
    question: 'Qual empresa lançou o Nintendo Entertainment System (NES)?',
    options: ['Sega', 'Nintendo', 'Sony', 'Atari'],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Em que ano o PlayStation original foi lançado no Japão?',
    options: ['1992', '1994', '1996', '1998'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'Qual personagem é o mascote oficial da Sega?',
    options: ['Mario', 'Pac-Man', 'Sonic', 'Crash Bandicoot'],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'Qual console popularizou os jogos em DVD na sexta geração?',
    options: ['Nintendo 64', 'PlayStation 2', 'Dreamcast', 'GameCube'],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'Qual foi o primeiro console doméstico da história?',
    options: ['Atari 2600', 'Magnavox Odyssey', 'NES', 'Intellivision'],
    correctAnswer: 1,
  },
];

const getTodayUtcRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return { start, end };
};

const getOrCreateTodayQuiz = async (userId) => {
  const { start, end } = getTodayUtcRange();

  const existing = await prisma.dailyQuiz.findFirst({
    where: {
      userId,
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.dailyQuiz.create({
    data: {
      userId,
      date: start,
      questions: STATIC_QUESTIONS,
      answered: false,
      score: null,
    },
  });
};

module.exports = { getOrCreateTodayQuiz, STATIC_QUESTIONS };
