import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Button } from 'react-bootstrap';

const TournamentDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await fetch(`/api/tournaments/${id}`);

        if (response.ok) {
          const tournamentData = await response.json();
          setTournament(tournamentData);
        } else {
          console.error('Error fetching tournament details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tournament details:', error);
      }
    };

    if (id) {
      fetchTournamentDetails();
    }
  }, [id]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {tournament ? (
            <>
              <Card.Title>{tournament.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">ID: {tournament.id}</Card.Subtitle>
              <Card.Text>
                <strong>Data de Início:</strong> {tournament.start_date}
                <br />
                <strong>Data de Término:</strong> {tournament.end_date}
              </Card.Text>
            </>
          ) : (
            <Card.Text>Loading...</Card.Text>
          )}
          <Button variant="primary" onClick={() => router.push('/tournaments')}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TournamentDetails;