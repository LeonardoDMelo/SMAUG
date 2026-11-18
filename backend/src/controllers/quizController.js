const { getOrCreateTodayQuiz, resetTodayQuiz } = require('../services/quizService');
const { processQuizMaster } = require('../services/achievementService');
const prisma = require('../config/prisma');

const sanitizeQuiz = (quiz) => {
  const questions = Array.isArray(quiz.questions)
    ? quiz.questions
    : quiz.questions;

  const safeQuestions = quiz.answered
    ? questions
    : questions.map(({ correctAnswer, ...rest }) => rest);

  return {
    id: quiz.id,
    date: quiz.date,
    answered: quiz.answered,
    score: quiz.score,
    questions: safeQuestions,
  };
};

const getTodayQuiz = async (req, res) => {
  try {
    const quiz = await getOrCreateTodayQuiz(req.userId);
    return res.status(200).json(sanitizeQuiz(quiz));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar quiz do dia' });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ error: 'Envie um array com 5 respostas' });
    }

    const quiz = await getOrCreateTodayQuiz(req.userId);

    if (quiz.answered) {
      return res.status(400).json({ error: 'Quiz de hoje já foi respondido' });
    }

    const questions = Array.isArray(quiz.questions)
      ? quiz.questions
      : quiz.questions;

    const score = questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const updated = await prisma.dailyQuiz.update({
      where: { id: quiz.id },
      data: {
        answered: true,
        score,
      },
    });

    let unlockedAchievements = [];

    if (score === 5) {
      unlockedAchievements = await processQuizMaster(req.userId);
    }

    return res.status(200).json({
      ...sanitizeQuiz(updated),
      unlockedAchievements,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao enviar respostas do quiz' });
  }
};

const resetQuiz = async (req, res) => {
  try {
    const quiz = await resetTodayQuiz(req.userId);
    return res.status(200).json(sanitizeQuiz(quiz));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao resetar o quiz' });
  }
};

module.exports = { getTodayQuiz, submitQuiz, resetQuiz };
