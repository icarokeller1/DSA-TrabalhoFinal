const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

// Configuração do banco de dados
const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'aula',
});

// Rota para obter todas as partidas
router.get('/', async (req, res) => {
  const { teamName } = req.query;

  let query = 'SELECT * FROM matches';
  let params = [];

  if (teamName) {
    // Se o parâmetro teamName estiver presente, filtrar por time
    query += ' INNER JOIN teams ON matches.team1_id = teams.id OR matches.team2_id = teams.id WHERE teams.name ILIKE $1';
    params = [`%${teamName}%`];
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching matches', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para obter uma partida específica por ID
router.get('/:id', async (req, res) => {
  const matchId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM matches WHERE id = $1', [matchId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching match ${matchId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para adicionar uma nova partida
router.post('/', async (req, res) => {
  const { team1_id, team2_id, date, result: matchResult } = req.body; // Renomeado para matchResult

  try {
    const result = await pool.query(
      'INSERT INTO matches (team1_id, team2_id, date, result) VALUES ($1, $2, $3, $4) RETURNING *',
      [team1_id, team2_id, date, matchResult] // Atualizado para usar matchResult
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding match', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para editar uma partida existente por ID
router.put('/:id', async (req, res) => {
  const matchId = req.params.id;
  const { team1_id, team2_id, date, result } = req.body;

  try {
    const result = await pool.query(
      'UPDATE matches SET team1_id = $1, team2_id = $2, date = $3, result = $4 WHERE id = $5 RETURNING *',
      [team1_id, team2_id, date, result, matchId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating match ${matchId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para excluir uma partida por ID
router.delete('/:id', async (req, res) => {
  const matchId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM matches WHERE id = $1 RETURNING *', [matchId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error deleting match ${matchId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;