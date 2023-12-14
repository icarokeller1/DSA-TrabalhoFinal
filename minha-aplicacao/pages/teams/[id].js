import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Button } from 'react-bootstrap';

const TeamDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await fetch(`/api/teams/${id}`);

        if (response.ok) {
          const teamData = await response.json();
          setTeam(teamData);
        } else {
          console.error('Error fetching team details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    if (id) {
      fetchTeamDetails();
    }
  }, [id]);

  const handleBack = () => {
    router.push('/teams');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {team ? (
            <>
              <Card.Title>{team.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">ID: {team.id}</Card.Subtitle>
              <Card.Text>
                <strong>Cidade:</strong> {team.city}
                <br />
                <strong>Treinador:</strong> {team.coach}
              </Card.Text>
            </>
          ) : (
            <Card.Text>Loading...</Card.Text>
          )}
          <Button variant="primary" onClick={handleBack}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeamDetails;