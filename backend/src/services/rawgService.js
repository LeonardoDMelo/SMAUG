const axios = require('axios');

const rawgApi = axios.create({
  baseURL: 'https://api.rawg.io/api',
  timeout: 6000,
  headers: {
    'User-Agent': 'SMAUG/1.0 (college collection manager)',
  },
});

const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const searchGames = async (query) => {
  if (!process.env.RAWG_API_KEY) {
    throw new Error('RAWG_API_KEY não configurada');
  }

  const { data } = await rawgApi.get('/games', {
    params: {
      key: process.env.RAWG_API_KEY,
      search: query,
      page_size: 10,
    },
  });

  return (data.results || []).map((game) => ({
    rawgId: game.id,
    name: game.name,
    releaseDate: game.released || null,
    developer: game.developers?.[0]?.name || null,
    genre: (game.genres || []).map((item) => item.name).join(' / ') || null,
    genres: (game.genres || []).map((item) => item.name),
    coverUrl: game.background_image || null,
    rating: game.rating ?? null,
    source: 'rawg',
  }));
};

const getGameDetails = async (rawgId) => {
  if (!process.env.RAWG_API_KEY) {
    throw new Error('RAWG_API_KEY não configurada');
  }

  const { data } = await rawgApi.get(`/games/${rawgId}`, {
    params: {
      key: process.env.RAWG_API_KEY,
    },
  });

  return {
    rawgId: data.id,
    name: data.name,
    releaseDate: data.released || null,
    developer: data.developers?.[0]?.name || null,
    genre: (data.genres || []).map((item) => item.name).join(' / ') || null,
    genres: (data.genres || []).map((item) => item.name),
    coverUrl: data.background_image || null,
    rating: data.rating ?? null,
    synopsis: stripHtml(data.description_raw || data.description || ''),
    source: 'rawg',
  };
};

module.exports = { searchGames, getGameDetails };
