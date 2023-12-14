import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';

const NewNews = () => {
  const router = useRouter();
  const [news, setNews] = useState({
    title: '',
    content: '',
    pub_date: '',
    author: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({ ...prevNews, [name]: value }));
  };

  const handleSaveNews = async () => {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(news),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setNews({
          title: '',
          content: '',
          pub_date: '',
          author: '',
        });
      } else {
        console.error('Error adding news:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleBackToList = () => {
    router.push('/news');
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4 mb-4">Nova Notícia</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o título da notícia"
            name="title"
            value={news.title}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formContent">
          <Form.Label>Conteúdo</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Digite o conteúdo da notícia"
            name="content"
            value={news.content}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPubDate">
          <Form.Label>Data de Publicação</Form.Label>
          <Form.Control
            type="date"
            name="pub_date"
            value={news.pub_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Autor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o autor da notícia"
            name="author"
            value={news.author}
            onChange={handleChange}
          />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Notícia adicionada com sucesso!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSaveNews}>
            Salvar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewNews;