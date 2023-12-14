import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Button } from 'react-bootstrap';

const PlayerDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await fetch(`/api/players/${id}`);

        if (response.ok) {
          const playerData = await response.json();
          setPlayer(playerData);
        } else {
          console.error('Error fetching player details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching player details:', error);
      }
    };

    if (id) {
      fetchPlayerDetails();
    }
  }, [id]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {player ? (
            <>
              <Card.Title>{player.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">ID: {player.id}</Card.Subtitle>
              <Card.Text>
                <strong>Team ID:</strong> {player.team_id}
                <br />
                <strong>Age:</strong> {player.age}
                <br />
                <strong>Position:</strong> {player.position}
              </Card.Text>
            </>
          ) : (
            <Card.Text>Loading...</Card.Text>
          )}
          <Button variant="primary" onClick={() => router.push('/players')}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlayerDetails;