import Link from 'next/link';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const TournamentsIndexPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`/api/tournaments${searchTerm ? `?name=${encodeURIComponent(searchTerm)}` : ''}`);
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments', error);
      }
    };

    fetchTournaments();
  }, [searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Torneios</h1>
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
            <th>Data de Início</th>
            <th>Data de Término</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id}>
              <td>{tournament.id}</td>
              <td>{tournament.name}</td>
              <td>{formatDate(tournament.start_date)}</td>
              <td>{formatDate(tournament.end_date)}</td>
              <td>
                <Link href={`/tournaments/${tournament.id}`}>
                  <button className="btn btn-link">Detalhes</button>
                </Link>
                <Link href={`/tournaments/edit/${tournament.id}`}>
                  <button className="btn btn-warning mx-2">Editar</button>
                </Link>
                {/* Adicione a lógica de exclusão de torneio conforme necessário */}
                <button
                  className="btn btn-danger"
                  onClick={() => console.log('Implemente a lógica de exclusão aqui')}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Adicione o link para a página de criação de torneio conforme necessário */}
      <Link href="/tournaments/new">
        <button className="btn btn-primary mt-4">Adicionar Novo Torneio</button>
      </Link>
    </div>
  );
};

export default TournamentsIndexPage;