import Link from 'next/link';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const NewsIndexPage = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news${searchTerm ? `?title=${encodeURIComponent(searchTerm)}` : ''}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news', error);
      }
    };

    fetchNews();
  }, [searchTerm]);

  const handleDeleteNews = async (id) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Atualiza a lista de notícias após a exclusão
        const updatedNews = news.filter((item) => item.id !== id);
        setNews(updatedNews);
      } else {
        console.error('Error deleting news');
      }
    } catch (error) {
      console.error('Error deleting news', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Notícias</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Pesquisar por título"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Data de Publicação</th>
            <th>Autor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{format(new Date(item.pub_date), 'dd/MM/yyyy')}</td>
              <td>{item.author}</td>
              <td>
                <Link href={`/news/${item.id}`}>
                  <button className="btn btn-link">Detalhes</button>
                </Link>
                <Link href={`/news/edit/${item.id}`}>
                  <button className="btn btn-warning mx-2">Editar</button>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteNews(item.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/news/new">
        <button className="btn btn-primary mt-4">Adicionar Nova Notícia</button>
      </Link>
    </div>
  );
};

export default NewsIndexPage;