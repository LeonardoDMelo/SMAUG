const { searchGames, getGameDetails } = require('../services/rawgService');
const { searchSteamGames, getSteamGameDetails } = require('../services/steamService');
const {
  searchLocalConsoleGames,
  getLocalConsoleGame,
} = require('../data/consoleGames');

const parseExternalId = (value) => {
  const raw = String(value || '').trim();

  if (raw.startsWith('local-')) {
    return { source: 'catalog', id: raw };
  }

  const steamMatch = raw.match(/^steam-(\d+)$/i);
  if (steamMatch) {
    return { source: 'steam', id: steamMatch[1] };
  }

  return { source: 'rawg', id: raw };
};

const uniqueByName = (games) => {
  const seen = new Set();
  return games.filter((game) => {
    const key = String(game.name || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const search = async (req, res) => {
  try {
    const query = String(req.query.query || '').trim();

    if (!query) {
      return res.status(400).json({ error: 'Parâmetro query é obrigatório' });
    }

    const localGames = searchLocalConsoleGames(query);
    let remoteGames = [];
    let remoteSource = null;

    try {
      remoteGames = await searchGames(query);
      remoteSource = 'rawg';
    } catch (rawgError) {
      console.warn('RAWG search unavailable, trying Steam:', rawgError.message);
      try {
        remoteGames = await searchSteamGames(query);
        remoteSource = 'steam';
      } catch (steamError) {
        console.warn('Steam search unavailable:', steamError.message);
      }
    }

    const games = uniqueByName([...localGames, ...remoteGames]).slice(0, 12);

    if (!games.length) {
      return res.status(200).json([]);
    }

    if (!localGames.length && remoteSource === 'steam') {
      games.forEach((game) => {
        game.notice = 'steam-only';
      });
    }

    return res.status(200).json(games);
  } catch (error) {
    console.error(error);
    return res.status(502).json({
      error: 'Não foi possível buscar jogos agora. Tente novamente em instantes.',
      details: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { source, id } = parseExternalId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'ID do jogo é obrigatório' });
    }

    if (source === 'catalog') {
      const game = getLocalConsoleGame(id);
      if (!game) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
      }
      return res.status(200).json(game);
    }

    if (source === 'steam') {
      const game = await getSteamGameDetails(id);
      if (!game) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
      }
      return res.status(200).json(game);
    }

    try {
      const game = await getGameDetails(id);
      return res.status(200).json(game);
    } catch (rawgError) {
      console.warn('RAWG details unavailable:', rawgError.message);
      return res.status(502).json({
        error: 'Não foi possível carregar os detalhes do jogo',
        details: rawgError.message,
      });
    }
  } catch (error) {
    console.error(error);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    return res.status(502).json({
      error: 'Erro ao consultar detalhes do jogo',
      details: error.message,
    });
  }
};

module.exports = { search, getById };
