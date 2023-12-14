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

// Rota para obter todas as notícias
router.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.title || ''; // Adiciona essa linha para obter o termo de pesquisa do título
    const result = await pool.query('SELECT * FROM news WHERE title ILIKE $1', [`%${searchTerm}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching news', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para obter uma notícia específica por ID
router.get('/:id', async (req, res) => {
  const newsId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [newsId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching news ${newsId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para adicionar uma nova notícia
router.post('/', async (req, res) => {
  const { title, content, pub_date, author } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO news (title, content, pub_date, author) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, pub_date, author]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding news', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para editar uma notícia existente por ID
router.put('/:id', async (req, res) => {
  const newsId = req.params.id;
  const { title, content, pub_date, author } = req.body;

  try {
    const result = await pool.query(
      'UPDATE news SET title = $1, content = $2, pub_date = $3, author = $4 WHERE id = $5 RETURNING *',
      [title, content, pub_date, author, newsId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating news ${newsId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para excluir uma notícia por ID
router.delete('/:id', async (req, res) => {
  const newsId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [newsId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error deleting news ${newsId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;