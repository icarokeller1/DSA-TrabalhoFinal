import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const EditMatchPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState({ team1_id: '', team2_id: '', date: '', result: '' });
  const [teams, setTeams] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch match data by id and set the state
    const fetchMatch = async () => {
      try {
        const response = await fetch(`/api/matches/${id}`);
        const data = await response.json();
        setMatch(data);
      } catch (error) {
        console.error(`Error fetching match ${id}`, error);
      }
    };

    // Fetch teams for dropdown
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
      fetchMatch();
      fetchTeams();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMatch({ ...match, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Simulate a confirmation, you can modify this part based on your needs
      const confirmed = window.confirm('Deseja realmente salvar as alterações?');

      if (confirmed) {
        const response = await fetch(`/api/matches/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(match),
        });

        if (response.ok) {
          // Match updated successfully, you can redirect or handle as needed
          setShowConfirmation(true);
        } else {
          console.error('Failed to update match');
        }
      }
    } catch (error) {
      console.error('Error updating match', error);
    }
  };

  const handleBackToList = () => {
    router.push('/matches');
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Editar Partida</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formTeam1">
          <Form.Label>Time 1</Form.Label>
          <Form.Control as="select" name="team1_id" value={match.team1_id} onChange={handleInputChange}>
            <option value="">Selecione um time</option>
            {Object.entries(teams).map(([teamId, teamName]) => (
              <option key={teamId} value={teamId}>
                {teamName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTeam2">
          <Form.Label>Time 2</Form.Label>
          <Form.Control as="select" name="team2_id" value={match.team2_id} onChange={handleInputChange}>
            <option value="">Selecione um time</option>
            {Object.entries(teams).map(([teamId, teamName]) => (
              <option key={teamId} value={teamId}>
                {teamName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label>Data</Form.Label>
          <Form.Control type="date" name="date" value={match.date} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formResult">
          <Form.Label>Resultado</Form.Label>
          <Form.Control as="select" name="result" value={match.result} onChange={handleInputChange}>
            <option value="Vitoria time 1">Vitória time 1</option>
            <option value="Vitoria time 2">Vitória time 2</option>
            <option value="Empate">Empate</option>
          </Form.Control>
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Partida atualizada com sucesso!
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

export default EditMatchPage;