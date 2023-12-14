import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Button } from 'react-bootstrap';

const BroadcastDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [broadcast, setBroadcast] = useState(null);

  useEffect(() => {
    const fetchBroadcastDetails = async () => {
      try {
        const response = await fetch(`/api/broadcasts/${id}`);

        if (response.ok) {
          const broadcastData = await response.json();
          setBroadcast(broadcastData);
        } else {
          console.error('Error fetching broadcast details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching broadcast details:', error);
      }
    };

    if (id) {
      fetchBroadcastDetails();
    }
  }, [id]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {broadcast ? (
            <>
              <Card.Title>Transmissão ID: {broadcast.id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Partida ID: {broadcast.match_id}</Card.Subtitle>
              <Card.Text>
                <strong>URL:</strong> {broadcast.url}
                <br />
                <strong>Plataforma:</strong> {broadcast.platform}
              </Card.Text>
            </>
          ) : (
            <Card.Text>Loading...</Card.Text>
          )}
          <Button variant="primary" onClick={() => router.push('/broadcasts')}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BroadcastDetails;