const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SMAUG API Docs',
};

const setupSwagger = (app) => {
  app.get('/api-docs.json', (req, res) => {
    res.json(openapi);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, swaggerOptions));
};

module.exports = { setupSwagger };
