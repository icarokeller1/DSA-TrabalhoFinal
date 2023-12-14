import Link from 'next/link';
import { useState, useEffect } from 'react';

const PlayersIndexPage = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`/api/players${searchTerm ? `?name=${encodeURIComponent(searchTerm)}` : ''}`);
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players', error);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();
        const teamsData = data.reduce((acc, team) => {
          acc[team.id] = team;
          return acc;
        }, {});
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams', error);
      }
    };

    fetchPlayers();
    fetchTeams();
  }, [searchTerm]);

  const handleDeletePlayer = async (id) => {
    try {
      const response = await fetch(`/api/players/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualiza a lista de jogadores após a exclusão
        const updatedPlayers = players.filter((player) => player.id !== id);
        setPlayers(updatedPlayers);
      } else {
        console.error('Error deleting player');
      }
    } catch (error) {
      console.error('Error deleting player', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Jogadores</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Posição</th>
            <th>Time</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.age}</td>
              <td>{player.position}</td>
              <td>{teams[player.team_id]?.name}</td>
              <td>
                <Link href={`/players/${player.id}`}>
                  <button className="btn btn-link">Detalhes</button>
                </Link>
                {/* Adicionando o botão Editar na lista de jogadores */}
                <Link href={`/players/edit/${player.id}`}>
                  <button className="btn btn-warning mx-2">Editar</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeletePlayer(player.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/players/new">
        <button className="btn btn-primary mt-4">Adicionar Novo Jogador</button>
      </Link>
    </div>
  );
};

export default PlayersIndexPage;