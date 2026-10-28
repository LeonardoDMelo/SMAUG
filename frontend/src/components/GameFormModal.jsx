import { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, Search, X } from 'lucide-react';
import api from '../services/api';
import { useAchievementToast } from '../context/AchievementToastContext';
import { CONSOLES } from '../constants/catalog';

const initialForm = {
  name: '',
  releaseDate: '',
  developer: '',
  saga: '',
  genres: [],
  consoleName: '',
  synopsis: '',
  trivia: '',
  coverUrl: '',
  pricePaid: '',
  estimatedValue: '',
  rating: '',
};

const selectClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500';

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

const normalizeItemGenres = (item) => {
  if (Array.isArray(item?.genres) && item.genres.length) return item.genres;
  if (typeof item?.genre === 'string' && item.genre.trim()) {
    return item.genre.split('/').map((part) => part.trim()).filter(Boolean);
  }
  return [];
};

const GameFormModal = ({ open, onClose, onSaved, item = null }) => {
  const { notifyAchievements } = useAchievementToast();
  const [form, setForm] = useState(initialForm);
  const [genreInput, setGenreInput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rawgQuery, setRawgQuery] = useState('');
  const [rawgResults, setRawgResults] = useState([]);
  const [rawgLoading, setRawgLoading] = useState(false);
  const [rawgOpen, setRawgOpen] = useState(false);
  const [rawgFilling, setRawgFilling] = useState(false);
  const searchRef = useRef(null);
  const isEditing = Boolean(item?.id);

  useEffect(() => {
    if (!open) return;

    setError('');
    setGenreInput('');
    setRawgQuery('');
    setRawgResults([]);
    setRawgOpen(false);
    setRawgFilling(false);

    if (item) {
      setForm({
        name: item.name || '',
        releaseDate: toDateInput(item.releaseDate),
        developer: item.developer || '',
        saga: item.saga || '',
        genres: normalizeItemGenres(item),
        consoleName: item.consoleName || item.console?.name || '',
        synopsis: item.synopsis || '',
        trivia: item.trivia || '',
        coverUrl: item.coverUrl || '',
        pricePaid: item.pricePaid?.toString() || '',
        estimatedValue: item.estimatedValue?.toString() || '',
        rating: item.rating?.toString() || '',
      });
    } else {
      setForm(initialForm);
    }
  }, [open, item]);

  useEffect(() => {
    if (!open) return undefined;

    const query = rawgQuery.trim();

    if (query.length < 3) {
      setRawgResults([]);
      setRawgOpen(false);
      setRawgLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setRawgLoading(true);

      try {
        const { data } = await api.get('/external/games/search', {
          params: { query },
          signal: controller.signal,
        });
        setRawgResults(Array.isArray(data) ? data : []);
        setRawgOpen(true);
      } catch (err) {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
        setRawgResults([]);
        setRawgOpen(false);
      } finally {
        setRawgLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [rawgQuery, open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setRawgOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!open) return null;

  const consoleOptions = CONSOLES.includes(form.consoleName) || !form.consoleName
    ? CONSOLES
    : [form.consoleName, ...CONSOLES];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addGenre = () => {
    const value = genreInput.trim();
    if (!value) return;

    setForm((prev) => {
      if (prev.genres.some((genre) => genre.toLowerCase() === value.toLowerCase())) {
        return prev;
      }
      return { ...prev, genres: [...prev.genres, value] };
    });
    setGenreInput('');
  };

  const removeGenre = (genreToRemove) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleGenreKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addGenre();
    }
  };

  const handleSelectRawgGame = async (game) => {
    setRawgFilling(true);
    setError('');
    setRawgOpen(false);
    setRawgQuery(game.name || '');

    setForm((prev) => ({
      ...prev,
      name: game.name || prev.name,
      releaseDate: toDateInput(game.releaseDate) || prev.releaseDate,
      developer: game.developer || prev.developer,
      genres: normalizeItemGenres(game).length
        ? normalizeItemGenres(game)
        : prev.genres,
      coverUrl: game.coverUrl || prev.coverUrl,
    }));

    try {
      const { data } = await api.get(`/external/games/${game.rawgId}`);

      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        releaseDate: toDateInput(data.releaseDate) || prev.releaseDate,
        developer: data.developer || prev.developer,
        genres: normalizeItemGenres(data).length
          ? normalizeItemGenres(data)
          : prev.genres,
        coverUrl: data.coverUrl || prev.coverUrl,
        synopsis: data.synopsis || prev.synopsis,
      }));
    } catch {
      setError('Dados básicos preenchidos, mas a sinopse não pôde ser carregada.');
    } finally {
      setRawgFilling(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.genres.length === 0) {
      setError('Adicione pelo menos um gênero');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        releaseDate: form.releaseDate,
        developer: form.developer,
        saga: form.saga || null,
        genres: form.genres,
        consoleName: form.consoleName,
        synopsis: form.synopsis || null,
        trivia: form.trivia || null,
        coverUrl: form.coverUrl || null,
        pricePaid: form.pricePaid,
        estimatedValue: form.estimatedValue,
        rating: form.rating,
      };

      const { data } = isEditing
        ? await api.put(`/games/${item.id}`, payload)
        : await api.post('/games', payload);

      const { unlockedAchievements, ...game } = data;
      await notifyAchievements(unlockedAchievements);

      setForm(initialForm);
      setGenreInput('');
      setRawgQuery('');
      onSaved(game, isEditing);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          (isEditing ? 'Erro ao atualizar jogo' : 'Erro ao cadastrar jogo')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Jogo' : 'Novo Jogo'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Fechar
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="relative sm:col-span-2" ref={searchRef}>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Buscar Dados na Web (RAWG)
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={rawgQuery}
                onChange={(event) => setRawgQuery(event.target.value)}
                onFocus={() => {
                  if (rawgResults.length > 0) setRawgOpen(true);
                }}
                placeholder="Digite ao menos 3 caracteres..."
                className={`${selectClass} bg-slate-800 pl-10 pr-10`}
              />
              {(rawgLoading || rawgFilling) && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-400" />
              )}
            </div>

            {rawgOpen && (
              <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 shadow-xl">
                {rawgResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-400">
                    Nenhum jogo encontrado
                  </p>
                ) : (
                  rawgResults.map((game) => (
                    <button
                      key={game.rawgId}
                      type="button"
                      onClick={() => handleSelectRawgGame(game)}
                      className="flex w-full items-center gap-3 border-b border-slate-700 px-3 py-2 text-left last:border-b-0 hover:bg-slate-700/70"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-900">
                        {game.coverUrl ? (
                          <img
                            src={game.coverUrl}
                            alt={game.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-slate-500">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">
                          {game.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {game.releaseDate || 'Sem data'}
                          {game.genre ? ` · ${game.genre}` : ''}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nome
            </span>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Data de lançamento
            </span>
            <input
              type="date"
              name="releaseDate"
              required
              value={form.releaseDate}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Console
            </span>
            <select
              name="consoleName"
              required
              value={form.consoleName}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Selecione</option>
              {consoleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Desenvolvedora
            </span>
            <input
              name="developer"
              required
              value={form.developer}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saga
            </span>
            <input
              name="saga"
              value={form.saga}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <div className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Gêneros
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={genreInput}
                onChange={(event) => setGenreInput(event.target.value)}
                onKeyDown={handleGenreKeyDown}
                placeholder="Digite um gênero"
                className={selectClass}
              />
              <button
                type="button"
                onClick={addGenre}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </button>
            </div>

            {form.genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.genres.map((genre) => (
                  <span
                    key={genre}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="rounded-full p-0.5 hover:bg-emerald-500/20"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Resultado: {form.genres.length ? form.genres.join(' / ') : 'nenhum gênero'}
            </p>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nota (1-10)
            </span>
            <input
              type="number"
              name="rating"
              required
              min="1"
              max="10"
              value={form.rating}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              URL da capa
            </span>
            <input
              name="coverUrl"
              placeholder="https://..."
              value={form.coverUrl}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Preço pago
            </span>
            <input
              type="number"
              name="pricePaid"
              required
              step="0.01"
              min="0"
              value={form.pricePaid}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Valor estimado
            </span>
            <input
              type="number"
              name="estimatedValue"
              required
              step="0.01"
              min="0"
              value={form.estimatedValue}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sinopse
            </span>
            <textarea
              name="synopsis"
              rows="3"
              value={form.synopsis}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Trivia
            </span>
            <textarea
              name="trivia"
              rows="2"
              value={form.trivia}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <div className="flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || rawgFilling}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar Jogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameFormModal;
