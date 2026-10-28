import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAchievementToast } from '../context/AchievementToastContext';
import { CONSOLES, MANUFACTURERS, MEDIA_TYPES } from '../constants/catalog';

const initialForm = {
  name: '',
  releaseDate: '',
  manufacturer: '',
  generation: '',
  mediaType: '',
  images: '',
  pricePaid: '',
  estimatedValue: '',
  rating: '',
  trivia: '',
};

const selectClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500';

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

const ConsoleFormModal = ({ open, onClose, onSaved, item = null }) => {
  const { notifyAchievements } = useAchievementToast();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(item?.id);

  useEffect(() => {
    if (!open) return;

    setError('');

    if (item) {
      setForm({
        name: item.name || '',
        releaseDate: toDateInput(item.releaseDate),
        manufacturer: item.manufacturer || '',
        generation: item.generation?.toString() || '',
        mediaType: item.mediaType || '',
        images: Array.isArray(item.images) ? item.images.join(', ') : '',
        pricePaid: item.pricePaid?.toString() || '',
        estimatedValue: item.estimatedValue?.toString() || '',
        rating: item.rating?.toString() || '',
        trivia: item.trivia || '',
      });
    } else {
      setForm(initialForm);
    }
  }, [open, item]);

  if (!open) return null;

  const consoleOptions = CONSOLES.includes(form.name) || !form.name
    ? CONSOLES
    : [form.name, ...CONSOLES];

  const manufacturerOptions = MANUFACTURERS.includes(form.manufacturer) || !form.manufacturer
    ? MANUFACTURERS
    : [form.manufacturer, ...MANUFACTURERS];

  const mediaOptions = MEDIA_TYPES.includes(form.mediaType) || !form.mediaType
    ? MEDIA_TYPES
    : [form.mediaType, ...MEDIA_TYPES];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const images = form.images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

      const payload = {
        name: form.name,
        releaseDate: form.releaseDate,
        manufacturer: form.manufacturer,
        generation: form.generation,
        mediaType: form.mediaType,
        images,
        pricePaid: form.pricePaid,
        estimatedValue: form.estimatedValue,
        rating: form.rating,
        trivia: form.trivia || null,
      };

      const { data } = isEditing
        ? await api.put(`/consoles/${item.id}`, payload)
        : await api.post('/consoles', payload);

      const { unlockedAchievements, ...consoleItem } = data;
      await notifyAchievements(unlockedAchievements);

      setForm(initialForm);
      onSaved(consoleItem, isEditing);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          (isEditing ? 'Erro ao atualizar console' : 'Erro ao cadastrar console')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Editar Console' : 'Novo Console'}
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
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nome
            </span>
            <select
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Selecione o console</option>
              {consoleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              Empresa
            </span>
            <select
              name="manufacturer"
              required
              value={form.manufacturer}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Selecione</option>
              {manufacturerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Geração
            </span>
            <input
              type="number"
              name="generation"
              required
              min="1"
              value={form.generation}
              onChange={handleChange}
              className={selectClass}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mídia aceita
            </span>
            <select
              name="mediaType"
              required
              value={form.mediaType}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Selecione</option>
              {mediaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Imagens (URLs separadas por vírgula)
            </span>
            <input
              name="images"
              placeholder="https://..."
              value={form.images}
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
              Trivia
            </span>
            <textarea
              name="trivia"
              rows="3"
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
              disabled={submitting}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsoleFormModal;
