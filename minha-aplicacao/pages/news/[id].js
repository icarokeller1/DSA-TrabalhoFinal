import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Button } from 'react-bootstrap';

const DetalhesNoticia = () => {
  const router = useRouter();
  const { id } = router.query;
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const buscarDetalhesNoticia = async () => {
      try {
        const resposta = await fetch(`/api/news/${id}`);

        if (resposta.ok) {
          const dadosNoticia = await resposta.json();
          setNoticia(dadosNoticia);
        } else {
          console.error('Erro ao buscar detalhes da notícia:', resposta.statusText);
        }
      } catch (erro) {
        console.error('Erro ao buscar detalhes da notícia:', erro);
      }
    };

    if (id) {
      buscarDetalhesNoticia();
    }
  }, [id]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {noticia ? (
            <>
              <Card.Title>{noticia.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">ID: {noticia.id}</Card.Subtitle>
              <Card.Text>
                <strong>Conteúdo:</strong> {noticia.content}
                <br />
                <strong>Data de Publicação:</strong> {new Date(noticia.pub_date).toLocaleDateString()}
                <br />
                <strong>Autor:</strong> {noticia.author}
              </Card.Text>
            </>
          ) : (
            <Card.Text>Carregando...</Card.Text>
          )}
          <Button variant="primary" onClick={() => router.push('/news')}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DetalhesNoticia;