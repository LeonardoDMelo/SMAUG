const { EventEmitter } = require('events');
const prisma = require('../config/prisma');

const achievementEvents = new EventEmitter();
const achievementEmitter = achievementEvents;

const formatUnlocked = (achievement, unlockedAt) => ({
  id: achievement.id,
  code: achievement.code,
  title: achievement.title,
  description: achievement.description,
  icon: achievement.icon,
  unlockedAt,
});

const checkAndGrantAchievement = async (userId, achievementCode) => {
  const achievement = await prisma.achievement.findUnique({
    where: { code: achievementCode },
  });

  if (!achievement) {
    return null;
  }

  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (existing) {
    return null;
  }

  const created = await prisma.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
    },
  });

  return formatUnlocked(achievement, created.unlockedAt);
};

const processConsoleCreated = async (userId) => {
  const unlocked = [];
  const consoleCount = await prisma.console.count({ where: { userId } });
  const gameCount = await prisma.game.count({ where: { userId } });

  if (consoleCount >= 1) {
    const achievement = await checkAndGrantAchievement(userId, 'FIRST_CONSOLE');
    if (achievement) unlocked.push(achievement);
  }

  if (consoleCount + gameCount >= 10) {
    const achievement = await checkAndGrantAchievement(userId, 'COLLECTOR_10');
    if (achievement) unlocked.push(achievement);
  }

  return unlocked;
};

const processGameCreated = async (userId) => {
  const unlocked = [];
  const gameCount = await prisma.game.count({ where: { userId } });
  const consoleCount = await prisma.console.count({ where: { userId } });

  if (gameCount >= 1) {
    const achievement = await checkAndGrantAchievement(userId, 'FIRST_GAME');
    if (achievement) unlocked.push(achievement);
  }

  if (consoleCount + gameCount >= 10) {
    const achievement = await checkAndGrantAchievement(userId, 'COLLECTOR_10');
    if (achievement) unlocked.push(achievement);
  }

  return unlocked;
};

const processQuizMaster = async (userId) => {
  const unlocked = [];
  const achievement = await checkAndGrantAchievement(userId, 'QUIZ_MASTER');
  if (achievement) unlocked.push(achievement);
  return unlocked;
};

achievementEvents.on('CONSOLE_CREATED', async ({ userId }) => {
  try {
    await processConsoleCreated(userId);
  } catch (error) {
    console.error(error);
  }
});

achievementEvents.on('GAME_CREATED', async ({ userId }) => {
  try {
    await processGameCreated(userId);
  } catch (error) {
    console.error(error);
  }
});

achievementEmitter.on('QUIZ_MASTER', async (userId) => {
  try {
    await processQuizMaster(userId);
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  achievementEvents,
  achievementEmitter,
  checkAndGrantAchievement,
  processConsoleCreated,
  processGameCreated,
  processQuizMaster,
};
