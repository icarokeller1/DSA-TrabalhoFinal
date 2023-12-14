import Link from 'next/link';
import { useState, useEffect } from 'react';

const TeamsIndexPage = () => {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/teams${searchTerm ? `?name=${encodeURIComponent(searchTerm)}` : ''}`);
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams', error);
      }
    };

    fetchTeams();
  }, [searchTerm]);

  const handleDeleteTeam = async (id) => {
    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualiza a lista de times após a exclusão
        const updatedTeams = teams.filter((team) => team.id !== id);
        setTeams(updatedTeams);
      } else {
        console.error('Error deleting team');
      }
    } catch (error) {
      console.error('Error deleting team', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Times</h1>
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
            <th>Cidade</th>
            <th>Treinador</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.id}>
              <td>{team.id}</td>
              <td>{team.name}</td>
              <td>{team.city}</td>
              <td>{team.coach}</td>
              <td>
                <Link href={`/teams/${team.id}`}>
                  <button className="btn btn-link">Detalhes</button>
                </Link>
                <Link href={`/teams/edit/${team.id}`}>
                  <button className="btn btn-warning mx-2">Editar</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTeam(team.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/teams/new">
        <button className="btn btn-primary mt-4">Adicionar Novo Time</button>
      </Link>
    </div>
  );
};

export default TeamsIndexPage;