const axios = require('axios');

const steamApi = axios.create({
  timeout: 8000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  },
});

const MONTHS = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
};

const parseSteamDate = (value) => {
  if (!value || typeof value !== 'string') return null;
  const text = value.trim();

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return iso[0];

  const english = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (english) {
    const month = MONTHS[english[1].toLowerCase()];
    if (!month) return null;
    return `${english[3]}-${month}-${english[2].padStart(2, '0')}`;
  }

  const yearOnly = text.match(/^(\d{4})$/);
  if (yearOnly) return `${yearOnly[1]}-01-01`;

  return null;
};

const coverFromAppId = (appId) =>
  `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;

const searchSteamGames = async (query) => {
  const { data } = await steamApi.get(
    'https://store.steampowered.com/api/storesearch/',
    {
      params: {
        term: query,
        l: 'english',
        cc: 'US',
      },
    }
  );

  return (data.items || [])
    .filter((item) => item?.type === 'app' && item.id)
    .slice(0, 10)
    .map((item) => ({
      rawgId: `steam-${item.id}`,
      name: item.name,
      releaseDate: null,
      developer: null,
      genre: null,
      genres: [],
      coverUrl: item.tiny_image || coverFromAppId(item.id),
      rating: null,
      source: 'steam',
    }));
};

const getSteamGameDetails = async (appId) => {
  const { data } = await steamApi.get(
    'https://store.steampowered.com/api/appdetails',
    {
      params: {
        appids: appId,
        cc: 'US',
        l: 'english',
      },
    }
  );

  const payload = data?.[appId];

  if (!payload?.success || !payload.data) {
    return null;
  }

  const game = payload.data;
  const genres = (game.genres || []).map((item) => item.description).filter(Boolean);

  return {
    rawgId: `steam-${appId}`,
    name: game.name,
    releaseDate: parseSteamDate(game.release_date?.date),
    developer: game.developers?.[0] || null,
    genre: genres.join(' / ') || null,
    genres,
    coverUrl: game.header_image || coverFromAppId(appId),
    rating: null,
    synopsis: game.short_description || game.about_the_game?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '',
    source: 'steam',
  };
};

module.exports = { searchSteamGames, getSteamGameDetails };
