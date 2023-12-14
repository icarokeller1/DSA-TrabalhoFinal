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

// Rota para obter todas as transmissões
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM broadcasts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching broadcasts', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para obter uma transmissão específica por ID
router.get('/:id', async (req, res) => {
  const broadcastId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM broadcasts WHERE id = $1', [broadcastId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching broadcast ${broadcastId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para adicionar uma nova transmissão
router.post('/', async (req, res) => {
  const { match_id, url, platform } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO broadcasts (match_id, url, platform) VALUES ($1, $2, $3) RETURNING *',
      [match_id, url, platform]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding broadcast', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para editar uma transmissão existente por ID
router.put('/:id', async (req, res) => {
  const broadcastId = req.params.id;
  const { match_id, url, platform } = req.body;

  try {
    const result = await pool.query(
      'UPDATE broadcasts SET match_id = $1, url = $2, platform = $3 WHERE id = $4 RETURNING *',
      [match_id, url, platform, broadcastId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating broadcast ${broadcastId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para excluir uma transmissão por ID
router.delete('/:id', async (req, res) => {
  const broadcastId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM broadcasts WHERE id = $1 RETURNING *', [broadcastId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error deleting broadcast ${broadcastId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;