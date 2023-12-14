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

// Rota para obter todos os times
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    let query = 'SELECT * FROM teams';

    if (name) {
      query += ` WHERE LOWER(name) LIKE LOWER('%${name}%')`;
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para obter um time específico por ID
router.get('/:id', async (req, res) => {
  const teamId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM teams WHERE id = $1', [teamId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching team ${teamId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para adicionar um novo time
router.post('/', async (req, res) => {
  const { name, city, coach } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO teams (name, city, coach) VALUES ($1, $2, $3) RETURNING *',
      [name, city, coach]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding team', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para editar um time existente por ID
router.put('/:id', async (req, res) => {
  const teamId = req.params.id;
  const { name, city, coach } = req.body;

  try {
    const result = await pool.query(
      'UPDATE teams SET name = $1, city = $2, coach = $3 WHERE id = $4 RETURNING *',
      [name, city, coach, teamId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating team ${teamId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para excluir um time por ID
router.delete('/:id', async (req, res) => {
  const teamId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM teams WHERE id = $1 RETURNING *', [teamId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error deleting team ${teamId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;