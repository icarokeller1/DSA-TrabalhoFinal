import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const EditNewsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState({ title: '', content: '', pub_date: '', author: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch news data by id and set the state
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error(`Error fetching news ${id}`, error);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNews({ ...news, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Simulate a confirmation, you can modify this part based on your needs
      const confirmed = window.confirm('Deseja realmente salvar as alterações?');

      if (confirmed) {
        const response = await fetch(`/api/news/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(news),
        });

        if (response.ok) {
          // News updated successfully, you can redirect or handle as needed
          setShowConfirmation(true);
        } else {
          console.error('Failed to update news');
        }
      }
    } catch (error) {
      console.error('Error updating news', error);
    }
  };

  const handleBackToList = () => {
    router.push('/news');
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Edit News</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter title" name="title" value={news.title} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formContent">
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter content" name="content" value={news.content} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPubDate">
          <Form.Label>Publication Date</Form.Label>
          <Form.Control type="date" name="pub_date" value={news.pub_date} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" placeholder="Enter author" name="author" value={news.author} onChange={handleInputChange} />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            News updated successfully!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditNewsPage;