import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAchievementToast } from '../context/AchievementToastContext';
import api from '../services/api';

const Quiz = () => {
  const { notifyAchievements } = useAchievementToast();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [resetting, setResetting] = useState(false);

  const applyQuiz = (data) => {
    setQuiz(data);
    setAnswers(Array(data.questions?.length || 5).fill(null));
    setResult(data.answered ? data : null);
  };

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/quiz/today');
        applyQuiz(data);
      } catch {
        setError('Erro ao carregar o quiz do dia');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const allAnswered = useMemo(
    () => answers.length > 0 && answers.every((answer) => answer !== null),
    [answers]
  );

  const selectAnswer = (questionIndex, optionIndex) => {
    if (quiz?.answered || result) return;

    setAnswers((prev) =>
      prev.map((answer, index) => (index === questionIndex ? optionIndex : answer))
    );
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/quiz/submit', { answers });
      const { unlockedAchievements, ...quizData } = data;
      await notifyAchievements(unlockedAchievements);
      applyQuiz(quizData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar respostas');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (resetting) return;

    setResetting(true);
    setError('');

    try {
      const { data } = await api.post('/quiz/reset');
      applyQuiz(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao resetar o quiz');
    } finally {
      setResetting(false);
    }
  };

  const showResult = Boolean(result?.answered || quiz?.answered);
  const score = result?.score ?? quiz?.score ?? 0;
  const questions = result?.questions || quiz?.questions || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-cyan-500/20 p-3 text-cyan-400">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Quiz Diário</h1>
              <p className="text-sm text-slate-400">
                Teste seus conhecimentos sobre a história dos videogames
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || loading}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-slate-900 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Gerando...' : 'Resetar quiz (demo)'}
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-xl border border-slate-700 bg-slate-800"
              />
            ))}
          </div>
        ) : !quiz ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 px-6 py-16 text-center text-slate-400">
            Não foi possível carregar o quiz.
          </div>
        ) : showResult ? (
          <section className="space-y-6">
            <div className="rounded-xl border border-emerald-500/40 bg-slate-900 p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <p className="mb-2 text-sm uppercase tracking-wider text-emerald-400">
                Resultado de hoje
              </p>
              <h2 className="mb-3 text-3xl font-bold text-white">
                Você acertou {score}/5 perguntas hoje!
              </h2>
              <p className="text-slate-400">
                Volte amanhã para um novo desafio, ou use o botão de reset para demonstrar outra geração de perguntas.
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, questionIndex) => {
                const selected = answers[questionIndex];
                const correct = question.correctAnswer;
                const hasSelection = selected !== null && selected !== undefined;
                const isCorrect = hasSelection && selected === correct;

                return (
                  <article
                    key={question.id || questionIndex}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-white">
                        {questionIndex + 1}. {question.question}
                      </h3>
                      {typeof correct === 'number' && hasSelection ? (
                        isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 animate-pulse text-emerald-400" />
                        ) : (
                          <XCircle className="h-5 w-5 shrink-0 animate-pulse text-rose-400" />
                        )
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isCorrectOption = correct === optionIndex;

                        let optionClass =
                          'border-slate-600 bg-slate-900 text-slate-300';

                        if (typeof correct === 'number') {
                          if (isCorrectOption) {
                            optionClass =
                              'border-emerald-500 bg-emerald-500/15 text-emerald-300';
                          } else if (isSelected) {
                            optionClass =
                              'border-rose-500 bg-rose-500/15 text-rose-300';
                          }
                        }

                        return (
                          <div
                            key={`${question.id}-${optionIndex}`}
                            className={`rounded-lg border px-3 py-2 text-sm transition ${optionClass}`}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>

                    {typeof correct === 'number' && hasSelection && (
                      <p
                        className={`mt-3 text-xs font-medium ${
                          isCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isCorrect
                          ? 'Resposta correta'
                          : `Correta: ${question.options[correct]}`}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            {questions.map((question, questionIndex) => (
              <article
                key={question.id || questionIndex}
                className="rounded-xl border border-slate-700 bg-slate-800 p-5"
              >
                <h3 className="mb-4 font-semibold text-white">
                  {questionIndex + 1}. {question.question}
                </h3>

                <div className="grid gap-2">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[questionIndex] === optionIndex;

                    return (
                      <button
                        key={`${question.id}-${optionIndex}`}
                        type="button"
                        onClick={() => selectAnswer(questionIndex, optionIndex)}
                        className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                          selected
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
                            : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-400 hover:bg-slate-900/80'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}

            <button
              type="button"
              disabled={!allAnswered || submitting}
              onClick={handleSubmit}
              className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Enviar Respostas'}
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Quiz;
