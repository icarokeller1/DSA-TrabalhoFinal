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

// Rota para obter todos os torneios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tournaments');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tournaments', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para obter um torneio específico por ID
router.get('/:id', async (req, res) => {
  const tournamentId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching tournament ${tournamentId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para adicionar um novo torneio
router.post('/', async (req, res) => {
  const { name, start_date, end_date } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO tournaments (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
      [name, start_date, end_date]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding tournament', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para editar um torneio existente por ID
router.put('/:id', async (req, res) => {
  const tournamentId = req.params.id;
  const { name, start_date, end_date } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tournaments SET name = $1, start_date = $2, end_date = $3 WHERE id = $4 RETURNING *',
      [name, start_date, end_date, tournamentId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating tournament ${tournamentId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para excluir um torneio por ID
router.delete('/:id', async (req, res) => {
  const tournamentId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM tournaments WHERE id = $1 RETURNING *', [tournamentId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error deleting tournament ${tournamentId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;