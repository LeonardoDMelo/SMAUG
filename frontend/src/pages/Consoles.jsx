import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ConsoleFormModal from '../components/ConsoleFormModal';
import { MANUFACTURERS, MEDIA_TYPES } from '../constants/catalog';
import api from '../services/api';

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const DeleteConfirmModal = ({ open, item, loading, onCancel, onConfirm }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
        <h2 className="mb-2 text-xl font-bold text-white">Excluir console</h2>
        <p className="mb-6 text-sm text-slate-300">
          Tem certeza que deseja excluir o console{' '}
          <span className="font-semibold text-white">{item.name}</span>?
          Os jogos vinculados a ele também serão removidos.
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

const Consoles = () => {
  const [consoles, setConsoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: '',
    generation: '',
    mediaType: '',
  });

  const fetchConsoles = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.manufacturer) params.manufacturer = filters.manufacturer;
      if (filters.generation) params.generation = filters.generation;
      if (filters.mediaType) params.mediaType = filters.mediaType;

      const { data } = await api.get('/consoles', { params });
      setConsoles(data);

      if (!filters.manufacturer && !filters.generation && !filters.mediaType) {
        setCatalog(data);
      }
    } catch {
      setError('Erro ao carregar consoles');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchConsoles();
  }, [fetchConsoles]);

  const filterOptions = useMemo(() => {
    const source = catalog.length ? catalog : consoles;
    return {
      generations: [...new Set(source.map((item) => item.generation))].sort((a, b) => a - b),
    };
  }, [catalog, consoles]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ manufacturer: '', generation: '', mediaType: '' });
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

  const handleSaved = async () => {
    closeModal();
    await fetchConsoles();
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
      await api.delete(`/consoles/${deleteItem.id}`);
      setDeleteItem(null);
      await fetchConsoles();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao remover console');
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
            <h1 className="text-3xl font-bold text-white">Consoles</h1>
            <p className="text-sm text-slate-400">
              Filtre e gerencie sua coleção de hardware
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            + Novo Console
          </button>
        </div>

        <div className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:grid-cols-4">
          <select
            name="manufacturer"
            value={filters.manufacturer}
            onChange={handleFilterChange}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
          >
            <option value="">Empresa</option>
            {MANUFACTURERS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="generation"
            value={filters.generation}
            onChange={handleFilterChange}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
          >
            <option value="">Geração</option>
            {filterOptions.generations.map((item) => (
              <option key={item} value={item}>
                {item}ª geração
              </option>
            ))}
          </select>

          <select
            name="mediaType"
            value={filters.mediaType}
            onChange={handleFilterChange}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
          >
            <option value="">Mídia aceita</option>
            {MEDIA_TYPES.map((item) => (
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

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-slate-400">Carregando consoles...</p>
        ) : consoles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
            <p className="text-slate-400">Nenhum console encontrado.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Cadastrar o primeiro
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {consoles.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-emerald-600/50"
              >
                <div className="aspect-video bg-slate-800">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                    <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-bold text-emerald-400">
                      {item.rating}/10
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-slate-400">
                    {item.manufacturer} · {item.generation}ª geração
                  </p>
                  <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
                    {item.mediaType}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-emerald-400">
                      {formatCurrency(item.estimatedValue)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(item)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-slate-700"
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

      <ConsoleFormModal
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

export default Consoles;
