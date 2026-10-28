const { searchGames, getGameDetails } = require('../services/rawgService');

const search = async (req, res) => {
  try {
    const query = String(req.query.query || '').trim();

    if (!query) {
      return res.status(400).json({ error: 'Parâmetro query é obrigatório' });
    }

    const games = await searchGames(query);
    return res.status(200).json(games);
  } catch (error) {
    console.error(error);
    const status = error.response?.status || 502;
    return res.status(status >= 500 ? 502 : status).json({
      error: 'Erro ao consultar a RAWG API',
      details: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do jogo é obrigatório' });
    }

    const game = await getGameDetails(id);
    return res.status(200).json(game);
  } catch (error) {
    console.error(error);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Jogo não encontrado na RAWG' });
    }

    const status = error.response?.status || 502;
    return res.status(status >= 500 ? 502 : status).json({
      error: 'Erro ao consultar detalhes na RAWG API',
      details: error.message,
    });
  }
};

module.exports = { search, getById };
