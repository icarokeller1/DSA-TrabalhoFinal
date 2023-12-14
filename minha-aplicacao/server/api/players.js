require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configuração do banco de dados
const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'aula',
});

const createTablesScriptPath = path.join(__dirname, 'create_tables.sql');

// Função para verificar a existência da tabela teams
const checkTeamsTable = async () => {
  try {
    const result = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'teams')");
    const teamsTableExists = result.rows[0].exists;

    if (!teamsTableExists) {
      // Se a tabela teams não existir, execute o script de criação de tabelas
      const createTablesScript = fs.readFileSync(createTablesScriptPath, 'utf8');
      await pool.query(createTablesScript);
      console.log('Tabelas criadas com sucesso.');
    }
  } catch (error) {
    console.error('Error checking/creating tables:', error);
  }
};

checkTeamsTable();

// Rota para obter todos os jogadores
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;

    if (name) {
      // Se um parâmetro de pesquisa por nome for fornecido
      const result = await pool.query('SELECT * FROM players WHERE name ILIKE $1', [`%${name}%`]);
      res.json(result.rows);
    } else {
      // Caso contrário, obtém todos os jogadores
      const result = await pool.query('SELECT * FROM players');
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching players', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para obter um jogador específico por ID
router.get('/:id', async (req, res) => {
  const playerId = req.params.id;

  // Verifica se é uma chamada para a rota de todos os jogadores
  if (!playerId) {
    // Retorna um erro indicando que o ID do jogador é inválido
    return res.status(400).json({ error: 'Invalid player ID' });
  }

  try {
    const result = await pool.query('SELECT * FROM players WHERE id = $1', [playerId]);
    // Verifica se o jogador foi encontrado
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    
    console.error(`Error fetching player ${playerId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para adicionar um novo jogador
router.post('/', async (req, res) => {
  const { name, team_id, age, position } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO players (name, team_id, age, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, team_id, age, position]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding player', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para editar um jogador existente por ID
router.put('/:id', async (req, res) => {
  const playerId = req.params.id;
  const { name, team_id, age, position } = req.body;

  try {
    const result = await pool.query(
      'UPDATE players SET name = $1, team_id = $2, age = $3, position = $4 WHERE id = $5 RETURNING *',
      [name, team_id, age, position, playerId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating player ${playerId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para excluir um jogador por ID
router.delete('/:id', async (req, res) => {
  const playerId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM players WHERE id = $1 RETURNING *', [playerId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error deleting player ${playerId}`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;