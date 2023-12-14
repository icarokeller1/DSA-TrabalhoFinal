import Link from 'next/link';
import { useState, useEffect } from 'react';

const MatchesIndexPage = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`/api/matches${searchTerm ? `?teamName=${encodeURIComponent(searchTerm)}` : ''}`);
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches', error);
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

    fetchMatches();
    fetchTeams();
  }, [searchTerm]);

  const handleDeleteMatch = async (id) => {
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualiza a lista de partidas após a exclusão
        const updatedMatches = matches.filter((match) => match.id !== id);
        setMatches(updatedMatches);
      } else {
        console.error('Error deleting match');
      }
    } catch (error) {
      console.error('Error deleting match', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Partidas</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Pesquisar por time"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Time 1</th>
            <th>Time 2</th>
            <th>Data</th>
            <th>Resultado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{match.id}</td>
              <td>{teams[match.team1_id]?.name}</td>
              <td>{teams[match.team2_id]?.name}</td>
              <td>{new Date(match.date).toLocaleDateString()}</td>
              <td>{match.result}</td>
              <td>
                <Link href={`/matches/${match.id}`}>
                  <button className="btn btn-link">Detalhes</button>
                </Link>
                <Link href={`/matches/edit/${match.id}`}>
                  <button className="btn btn-warning mx-2">Editar</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteMatch(match.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/matches/new">
        <button className="btn btn-primary mt-4">Adicionar Nova Partida</button>
      </Link>
    </div>
  );
};

export default MatchesIndexPage;