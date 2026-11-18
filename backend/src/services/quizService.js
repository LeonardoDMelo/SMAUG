const prisma = require('../config/prisma');

const QUESTION_BANK = [
  {
    question: 'Qual empresa lançou o Nintendo Entertainment System (NES)?',
    options: ['Sega', 'Nintendo', 'Sony', 'Atari'],
    correctAnswer: 1,
  },
  {
    question: 'Em que ano o PlayStation original foi lançado no Japão?',
    options: ['1992', '1994', '1996', '1998'],
    correctAnswer: 1,
  },
  {
    question: 'Qual personagem é o mascote oficial da Sega?',
    options: ['Mario', 'Pac-Man', 'Sonic', 'Crash Bandicoot'],
    correctAnswer: 2,
  },
  {
    question: 'Qual console popularizou os jogos em DVD na sexta geração?',
    options: ['Nintendo 64', 'PlayStation 2', 'Dreamcast', 'GameCube'],
    correctAnswer: 1,
  },
  {
    question: 'Qual foi o primeiro console doméstico da história?',
    options: ['Atari 2600', 'Magnavox Odyssey', 'NES', 'Intellivision'],
    correctAnswer: 1,
  },
  {
    question: 'Qual empresa desenvolveu o Xbox original?',
    options: ['Sony', 'Nintendo', 'Microsoft', 'Sega'],
    correctAnswer: 2,
  },
  {
    question: 'Em qual console estreou Super Mario 64?',
    options: ['Super Nintendo', 'Nintendo 64', 'GameCube', 'Wii'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses consoles pertence à Sega?',
    options: ['PlayStation', 'Dreamcast', 'Xbox 360', 'Game Boy'],
    correctAnswer: 1,
  },
  {
    question: 'O controle DualShock é associado a qual marca?',
    options: ['Nintendo', 'Microsoft', 'Sega', 'Sony'],
    correctAnswer: 3,
  },
  {
    question: 'Qual jogo da Nintendo popularizou o open world no Switch?',
    options: [
      'Super Mario Odyssey',
      'The Legend of Zelda: Breath of the Wild',
      'Animal Crossing: New Horizons',
      'Splatoon 2',
    ],
    correctAnswer: 1,
  },
  {
    question: 'O cartucho foi o formato principal de qual geração?',
    options: ['Oitava geração', 'Sétima geração', 'Terceira e quarta gerações', 'Nona geração'],
    correctAnswer: 2,
  },
  {
    question: 'Qual console da Sony veio imediatamente depois do PlayStation 2?',
    options: ['PlayStation', 'PlayStation 3', 'PlayStation 4', 'PSP'],
    correctAnswer: 1,
  },
  {
    question: 'Halo: Combat Evolved foi um título de lançamento de qual console?',
    options: ['Xbox', 'Xbox 360', 'PlayStation 2', 'GameCube'],
    correctAnswer: 0,
  },
  {
    question: 'Qual empresa criou o Mega Drive / Genesis?',
    options: ['Nintendo', 'Sega', 'Atari', 'NEC'],
    correctAnswer: 1,
  },
  {
    question: 'O Game Boy Color é um console portátil de qual empresa?',
    options: ['Sony', 'Sega', 'Nintendo', 'SNK'],
    correctAnswer: 2,
  },
  {
    question: 'Qual desses é um console da Microsoft?',
    options: ['Wii U', 'PlayStation Vita', 'Xbox Series X|S', 'Dreamcast'],
    correctAnswer: 2,
  },
  {
    question: 'Final Fantasy VII original foi um marco principalmente em qual console?',
    options: ['Super Nintendo', 'PlayStation', 'Nintendo 64', 'Saturn'],
    correctAnswer: 1,
  },
  {
    question: 'Qual mídia o PlayStation 3 usava como formato principal?',
    options: ['Cartucho', 'CD', 'Blu-ray', 'HuCard'],
    correctAnswer: 2,
  },
  {
    question: 'O Neo Geo AES é um console associado a qual empresa?',
    options: ['SNK', 'NEC', 'Atari', 'Tectoy'],
    correctAnswer: 0,
  },
  {
    question: 'Qual destes jogos é um clássico do Atari 2600?',
    options: ['Halo 3', 'Pitfall!', 'Uncharted 2', 'The Last of Us'],
    correctAnswer: 1,
  },
  {
    question: 'Qual empresa criou o Wii?',
    options: ['Sony', 'Microsoft', 'Nintendo', 'Sega'],
    correctAnswer: 2,
  },
  {
    question: 'O controle Kinect foi um acessório de qual console?',
    options: ['PlayStation 3', 'Xbox 360', 'Wii', 'Dreamcast'],
    correctAnswer: 1,
  },
  {
    question: 'Qual portátil da Sony usava UMD?',
    options: ['PlayStation Vita', 'Nintendo DS', 'PlayStation Portable (PSP)', 'Game Boy Advance'],
    correctAnswer: 2,
  },
  {
    question: 'Em qual console estreou The Legend of Zelda: Ocarina of Time?',
    options: ['Super Nintendo', 'GameCube', 'Nintendo 64', 'Wii'],
    correctAnswer: 2,
  },
  {
    question: 'Qual desses consoles é da NEC?',
    options: ['PC Engine / TurboGrafx-16', 'Master System', 'Jaguar', 'Xbox'],
    correctAnswer: 0,
  },
  {
    question: 'O GameCube usava principalmente qual tipo de mídia?',
    options: ['DVD padrão', 'MiniDisc', 'Disco óptico próprio (mini-DVD)', 'Blu-ray'],
    correctAnswer: 2,
  },
  {
    question: 'Qual mascote é associado à Nintendo?',
    options: ['Sonic', 'Crash Bandicoot', 'Mario', 'Master Chief'],
    correctAnswer: 2,
  },
  {
    question: 'O Saturn foi um console de qual empresa?',
    options: ['Nintendo', 'Sega', 'Sony', 'Atari'],
    correctAnswer: 1,
  },
  {
    question: 'Qual jogo popularizou o survival horror no PlayStation original?',
    options: ['Halo', 'Resident Evil', 'Gears of War', 'Jet Set Radio'],
    correctAnswer: 1,
  },
  {
    question: 'O Nintendo Switch pode ser jogado de qual forma?',
    options: ['Somente na TV', 'Somente portátil', 'Na TV e como portátil', 'Somente com Kinect'],
    correctAnswer: 2,
  },
  {
    question: 'Qual console da Microsoft veio depois do Xbox 360?',
    options: ['Xbox', 'Xbox One', 'Xbox Series S apenas', 'Dreamcast'],
    correctAnswer: 1,
  },
  {
    question: 'Chrono Trigger é um RPG clássico principalmente de qual console?',
    options: ['PlayStation 2', 'Nintendo 64', 'Super Nintendo / Super Famicom', 'Xbox'],
    correctAnswer: 2,
  },
  {
    question: 'Qual empresa desenvolveu o PlayStation?',
    options: ['Nintendo', 'Sega', 'Sony', 'Microsoft'],
    correctAnswer: 2,
  },
  {
    question: 'O Master System foi popularizado no Brasil principalmente pela:',
    options: ['Sony', 'Tectoy', 'Microsoft', 'Atari'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses jogos estreou no Game Boy?',
    options: ['Halo 2', 'Pokémon Red', 'Uncharted 2', 'Bloodborne'],
    correctAnswer: 1,
  },
  {
    question: 'O Dreamcast foi o último console doméstico de qual empresa?',
    options: ['Nintendo', 'Sega', 'Atari', 'SNK'],
    correctAnswer: 1,
  },
  {
    question: 'Qual acessório caracterizou o Wii em seu lançamento?',
    options: ['Touch screen', 'Controle com sensor de movimento', 'Blu-ray', 'UMD'],
    correctAnswer: 1,
  },
  {
    question: 'Metal Gear Solid original é mais associado a qual console?',
    options: ['Nintendo 64', 'PlayStation', 'Saturn', 'Xbox'],
    correctAnswer: 1,
  },
  {
    question: 'Qual console usava o formato HuCard?',
    options: ['Mega Drive', 'PC Engine / TurboGrafx-16', 'NES', 'Xbox 360'],
    correctAnswer: 1,
  },
  {
    question: 'Gears of War se tornou um cartão-postal de qual geração Xbox?',
    options: ['Xbox original', 'Xbox 360', 'Xbox One', 'Xbox Series X|S'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses é um portátil da Nintendo?',
    options: ['PSP', 'PlayStation Vita', 'Nintendo DS', 'Lynx'],
    correctAnswer: 2,
  },
  {
    question: 'O Atari Jaguar foi um console de qual empresa?',
    options: ['Sega', 'Atari', 'NEC', 'SNK'],
    correctAnswer: 1,
  },
  {
    question: 'Qual jogo da Naughty Dog marcou o PlayStation 3 com uma história dramática?',
    options: ['Crash Bandicoot', 'The Last of Us', 'Spyro the Dragon', 'Gran Turismo'],
    correctAnswer: 1,
  },
  {
    question: 'O Super Nintendo / Super Famicom pertence a qual geração clássica?',
    options: ['Terceira', 'Quarta', 'Sexta', 'Oitava'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses consoles usava GD-ROM?',
    options: ['PlayStation 2', 'Dreamcast', 'GameCube', 'Wii'],
    correctAnswer: 1,
  },
  {
    question: 'Bloodborne é um exclusivo clássico de qual plataforma?',
    options: ['Xbox One', 'Nintendo Switch', 'PlayStation 4', 'Wii U'],
    correctAnswer: 2,
  },
  {
    question: 'Qual empresa lançou o Intellivision, rival do Atari 2600?',
    options: ['Mattel', 'Nintendo', 'Sega', 'Sony'],
    correctAnswer: 0,
  },
  {
    question: 'O Nintendo 64 ficou famoso pelo controle em formato de:',
    options: ['Dois analógicos simétricos', 'Três “alças” / formato de M', 'Touch pad central', 'Volante embutido'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses títulos é um beat \'em up clássico do Mega Drive?',
    options: ['Halo 3', 'Streets of Rage 2', 'The Last of Us', 'Forza Horizon 5'],
    correctAnswer: 1,
  },
  {
    question: 'O PlayStation Vita foi o sucessor direto de qual portátil?',
    options: ['Game Boy', 'Nintendo DS', 'PSP', 'Neo Geo Pocket Color'],
    correctAnswer: 2,
  },
  {
    question: 'Qual console da Nintendo veio imediatamente antes do Switch?',
    options: ['Wii', 'GameCube', 'Wii U', 'Nintendo 64'],
    correctAnswer: 2,
  },
  {
    question: 'Shadow of the Colossus é um clássico principalmente de qual console?',
    options: ['Xbox', 'PlayStation 2', 'GameCube', 'Dreamcast'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses jogos é um rail shooter famoso do Nintendo 64?',
    options: ['Star Fox 64', 'Halo', 'Tekken 3', 'Shenmue'],
    correctAnswer: 0,
  },
  {
    question: 'O Xbox Series X|S pertence a qual geração atual da Microsoft?',
    options: ['Sétima', 'Oitava', 'Nona', 'Quinta'],
    correctAnswer: 2,
  },
  {
    question: 'Qual empresa desenvolveu o Neo Geo Pocket Color?',
    options: ['Nintendo', 'SNK', 'Sega', 'Sony'],
    correctAnswer: 1,
  },
  {
    question: 'Donkey Kong Country é um platformer clássico de qual console?',
    options: ['NES', 'Super Nintendo / Super Famicom', 'Nintendo 64', 'PlayStation'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses consoles da Sony é de mesa da nona geração?',
    options: ['PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'PSP'],
    correctAnswer: 2,
  },
  {
    question: 'Jet Set Radio é um ícone cultural principalmente de qual console?',
    options: ['PlayStation 2', 'Dreamcast', 'Xbox 360', 'Wii'],
    correctAnswer: 1,
  },
  {
    question: 'Qual mídia o PlayStation original usava?',
    options: ['Cartucho', 'CD', 'Blu-ray', 'DVD'],
    correctAnswer: 1,
  },
  {
    question: 'GoldenEye 007 ficou famoso no multiplayer local de qual console?',
    options: ['PlayStation', 'Nintendo 64', 'Saturn', 'Xbox'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses é um console portátil da série Game Boy?',
    options: ['Game Boy Advance', 'PSP', 'Lynx', 'Game Gear apenas da Sony'],
    correctAnswer: 0,
  },
  {
    question: 'God of War (2005) estreou em qual console?',
    options: ['PlayStation 3', 'PlayStation 2', 'PSP', 'Xbox'],
    correctAnswer: 1,
  },
  {
    question: 'Qual empresa lançou o Super Nintendo no Ocidente?',
    options: ['Sega', 'Sony', 'Nintendo', 'Atari'],
    correctAnswer: 2,
  },
  {
    question: 'O controle analogico DualSense pertence a qual console?',
    options: ['PlayStation 4', 'PlayStation 5', 'Xbox Series X|S', 'Switch'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses jogos é um metroidvania clássico do PlayStation?',
    options: ['Castlevania: Symphony of the Night', 'Halo CE', 'Mario Kart 8', 'Fable'],
    correctAnswer: 0,
  },
  {
    question: 'O Sega CD era um add-on de qual console?',
    options: ['Master System', 'Saturn', 'Genesis / Mega Drive', 'Dreamcast'],
    correctAnswer: 2,
  },
  {
    question: 'Qual console da Nintendo introduziu o analog stick de forma icônica nos anos 90?',
    options: ['NES', 'Super Nintendo', 'Nintendo 64', 'Game Boy'],
    correctAnswer: 2,
  },
  {
    question: 'Persona 5 Royal é mais associado a qual plataforma de lançamento?',
    options: ['Xbox 360', 'PlayStation 4', 'GameCube', 'Dreamcast'],
    correctAnswer: 1,
  },
  {
    question: 'Qual desses consoles foi lançado pela Atari?',
    options: ['Master System', 'Atari 2600', 'Neo Geo AES', 'Wii'],
    correctAnswer: 1,
  },
  {
    question: 'Uncharted 2: Among Thieves é um marco de qual console?',
    options: ['PlayStation 2', 'PlayStation 3', 'PSP', 'Xbox 360'],
    correctAnswer: 1,
  },
];

const shuffle = (list) => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const extractQuestionTexts = (quiz) => {
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  return questions.map((item) => item?.question).filter(Boolean);
};

const toQuizQuestions = (items) =>
  items.map((item, index) => ({
    id: index + 1,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
  }));

const pickVariedQuestions = (exclude = []) => {
  const blocked = new Set(exclude);
  const fresh = QUESTION_BANK.filter((item) => !blocked.has(item.question));
  const pool = fresh.length >= 5 ? fresh : QUESTION_BANK;

  return toQuizQuestions(shuffle(pool).slice(0, 5));
};

const getRecentQuestionTexts = async (userId, extraExclude = []) => {
  const recent = await prisma.dailyQuiz.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 8,
    select: { questions: true },
  });

  return [...extraExclude, ...recent.flatMap(extractQuestionTexts)];
};

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

  const excluded = await getRecentQuestionTexts(userId);

  return prisma.dailyQuiz.create({
    data: {
      userId,
      date: start,
      questions: pickVariedQuestions(excluded),
      answered: false,
      score: null,
    },
  });
};

const resetTodayQuiz = async (userId) => {
  const { start, end } = getTodayUtcRange();

  const current = await prisma.dailyQuiz.findFirst({
    where: {
      userId,
      date: {
        gte: start,
        lt: end,
      },
    },
    select: { questions: true },
  });

  const excluded = await getRecentQuestionTexts(userId, extractQuestionTexts(current));

  await prisma.dailyQuiz.deleteMany({
    where: {
      userId,
      date: {
        gte: start,
        lt: end,
      },
    },
  });

  return prisma.dailyQuiz.create({
    data: {
      userId,
      date: start,
      questions: pickVariedQuestions(excluded),
      answered: false,
      score: null,
    },
  });
};

module.exports = {
  QUESTION_BANK,
  getOrCreateTodayQuiz,
  resetTodayQuiz,
};
