import Link from 'next/link';
import { useState, useEffect } from 'react';

const BroadcastsIndexPage = () => {
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await fetch('/api/broadcasts');
        const data = await response.json();
        setBroadcasts(data);
      } catch (error) {
        console.error('Error fetching broadcasts', error);
      }
    };

    fetchBroadcasts();
  }, []);

  const handleDeleteBroadcast = async (id) => {
    try {
      const response = await fetch(`/api/broadcasts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualiza a lista de transmissões após a exclusão
        const updatedBroadcasts = broadcasts.filter((broadcast) => broadcast.id !== id);
        setBroadcasts(updatedBroadcasts);
      } else {
        console.error('Error deleting broadcast');
      }
    } catch (error) {
      console.error('Error deleting broadcast', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Transmissões</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Partida ID</th>
            <th>URL</th>
            <th>Plataforma</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {broadcasts.map((broadcast) => (
            <tr key={broadcast.id}>
              <td>{broadcast.id}</td>
              <td>{broadcast.match_id}</td>
              <td>{broadcast.url}</td>
              <td>{broadcast.platform}</td>
              <td>
                <Link href={`/broadcasts/${broadcast.id}`}>
                  <button className="btn btn-link">Detalhes</button>
                </Link>
                <Link href={`/broadcasts/edit/${broadcast.id}`}>
                  <button className="btn btn-warning mx-2">Editar</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteBroadcast(broadcast.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/broadcasts/new">
        <button className="btn btn-primary mt-4">Adicionar Nova Transmissão</button>
      </Link>
    </div>
  );
};

export default BroadcastsIndexPage;