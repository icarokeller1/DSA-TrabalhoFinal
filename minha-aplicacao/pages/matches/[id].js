import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Button } from 'react-bootstrap';

const MatchDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`/api/matches/${id}`);

        if (response.ok) {
          const matchData = await response.json();
          setMatch(matchData);
        } else {
          console.error('Error fetching match details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    // Fetch teams for displaying team names
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();
        const teamsData = data.reduce((acc, team) => {
          acc[team.id] = team.name;
          return acc;
        }, {});
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams', error);
      }
    };

    if (id) {
      fetchMatchDetails();
      fetchTeams();
    }
  }, [id]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          {match ? (
            <>
              <Card.Title>Partida ID: {match.id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Data: {match.date}</Card.Subtitle>
              <Card.Text>
                <strong>Time 1:</strong> {teams[match.team1_id]}
                <br />
                <strong>Time 2:</strong> {teams[match.team2_id]}
                <br />
                <strong>Resultado:</strong> {match.result}
              </Card.Text>
            </>
          ) : (
            <Card.Text>Loading...</Card.Text>
          )}
          <Button variant="primary" onClick={() => router.push('/matches')}>
            Voltar
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MatchDetails;