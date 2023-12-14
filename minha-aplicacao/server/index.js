const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { parse } = require('url');
const bodyParser = require('body-parser');
const apiPlayersRoutes = require('./api/players');
const apiTeamsRoutes = require('./api/teams');
const apiMatchesRoutes = require('./api/matches');
const apiTournamentsRoutes = require('./api/tournaments');
const apiNewsRoutes = require('./api/news');
const apiBroadcastsRoutes = require('./api/broadcasts');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  // Use as rotas da API
  server.use('/api/players', apiPlayersRoutes);
  server.use('/api/teams', apiTeamsRoutes);
  server.use('/api/matches', apiMatchesRoutes);
  server.use('/api/tournaments', apiTournamentsRoutes);
  server.use('/api/news', apiNewsRoutes);
  server.use('/api/broadcasts', apiBroadcastsRoutes);

  // Lida com todas as outras rotas
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = createServer(server);

  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});