import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import GameFormModal from '../components/GameFormModal';
import { CONSOLES } from '../constants/catalog';
import api from '../services/api';

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatGenres = (item) => {
  if (Array.isArray(item.genres) && item.genres.length) {
    return item.genres.join(' / ');
  }
  return item.genre || 'Sem gênero';
};

const DeleteConfirmModal = ({ open, item, loading, onCancel, onConfirm }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
        <h2 className="mb-2 text-xl font-bold text-white">Excluir jogo</h2>
        <p className="mb-6 text-sm text-slate-300">
          Tem certeza que deseja excluir o jogo{' '}
          <span className="font-semibold text-white">{item.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Games = () => {
  const [games, setGames] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    consoleNames: [],
    genres: [],
    saga: '',
    developer: '',
  });

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.consoleNames.length) params.consoleNames = filters.consoleNames;
      if (filters.genres.length) params.genres = filters.genres;
      if (filters.saga) params.saga = filters.saga;
      if (filters.developer) params.developer = filters.developer;

      const { data } = await api.get('/games', {
        params,
        paramsSerializer: {
          indexes: null,
        },
      });
      setGames(data);

      if (
        !filters.consoleNames.length &&
        !filters.genres.length &&
        !filters.saga &&
        !filters.developer
      ) {
        setCatalog(data);
      }
    } catch {
      setError('Erro ao carregar jogos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const filterOptions = useMemo(() => {
    const source = catalog.length ? catalog : games;
    const genres = [
      ...new Set(
        source
          .flatMap((item) => {
            if (Array.isArray(item.genres)) return item.genres;
            if (item.genre) return item.genre.split('/').map((part) => part.trim());
            return [];
          })
          .filter(Boolean)
      ),
    ].sort();

    return {
      genres,
      sagas: [...new Set(source.map((item) => item.saga).filter(Boolean))].sort(),
      developers: [...new Set(source.map((item) => item.developer).filter(Boolean))].sort(),
    };
  }, [catalog, games]);

  const toggleFilterValue = (key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ consoleNames: [], genres: [], saga: '', developer: '' });
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaved = (game, isEditing) => {
    if (isEditing) {
      setGames((prev) => prev.map((item) => (item.id === game.id ? game : item)));
      setCatalog((prev) => prev.map((item) => (item.id === game.id ? game : item)));
    } else {
      setGames((prev) => [game, ...prev]);
      setCatalog((prev) => [game, ...prev]);
    }

    closeModal();
  };

  const openDeleteModal = (item) => {
    setDeleteItem(item);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteItem(null);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    setDeleting(true);
    setError('');

    try {
      await api.delete(`/games/${deleteItem.id}`);
      setGames((prev) => prev.filter((game) => game.id !== deleteItem.id));
      setCatalog((prev) => prev.filter((game) => game.id !== deleteItem.id));
      setDeleteItem(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao remover jogo');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Jogos</h1>
            <p className="text-sm text-slate-400">
              Filtre e gerencie os títulos da sua coleção
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            + Novo Jogo
          </button>
        </div>

        <div className="mb-6 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Gênero
              </p>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3">
                {filterOptions.genres.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum gênero cadastrado</p>
                ) : (
                  filterOptions.genres.map((genre) => (
                    <label
                      key={genre}
                      className="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={() => toggleFilterValue('genres', genre)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                      />
                      {genre}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Console
              </p>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3">
                {CONSOLES.map((consoleName) => (
                  <label
                    key={consoleName}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={filters.consoleNames.includes(consoleName)}
                      onChange={() => toggleFilterValue('consoleNames', consoleName)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                    />
                    {consoleName}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <select
              name="saga"
              value={filters.saga}
              onChange={handleFilterChange}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
            >
              <option value="">Saga</option>
              {filterOptions.sagas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="developer"
              value={filters.developer}
              onChange={handleFilterChange}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
            >
              <option value="">Desenvolvedora</option>
              {filterOptions.developers.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-400">Carregando jogos...</p>
        ) : games.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
            <p className="text-slate-400">Nenhum jogo encontrado.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Cadastrar o primeiro
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-emerald-600/50"
              >
                <div className="aspect-[3/4] bg-slate-800">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Sem capa
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="mb-1 line-clamp-2 text-base font-semibold text-white">
                    {item.name}
                  </h2>
                  <p className="mb-1 text-sm text-emerald-400">
                    {item.consoleName || item.console?.name || 'Console'}
                  </p>
                  <p className="mb-3 text-xs text-slate-500">
                    {item.saga || 'Sem saga'} · {formatGenres(item)}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200">
                      {formatCurrency(item.estimatedValue)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-2 text-xs font-medium text-rose-300 transition hover:bg-slate-700"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <GameFormModal
        open={modalOpen}
        item={selectedItem}
        onClose={closeModal}
        onSaved={handleSaved}
      />

      <DeleteConfirmModal
        open={Boolean(deleteItem)}
        item={deleteItem}
        loading={deleting}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Games;
