import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';

const NewMatchPage = () => {
  const router = useRouter();
  const [match, setMatch] = useState({
    team1_id: '',
    team2_id: '',
    date: '',
    result: '',
  });
  const [teams, setTeams] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams', error);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMatch((prevMatch) => ({ ...prevMatch, [name]: value }));
  };

  const handleSaveMatch = async () => {
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(match),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setMatch({
          team1_id: '',
          team2_id: '',
          date: '',
          result: '',
        });
      } else {
        console.error('Error adding match:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handleBackToList = () => {
    router.push('/matches');
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4 mb-4">Nova Partida</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formTeam1">
          <Form.Label>Time 1</Form.Label>
          <Form.Control
            as="select"
            name="team1_id"
            value={match.team1_id}
            onChange={handleChange}
          >
            <option value="">Selecione um time</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTeam2">
          <Form.Label>Time 2</Form.Label>
          <Form.Control
            as="select"
            name="team2_id"
            value={match.team2_id}
            onChange={handleChange}
          >
            <option value="">Selecione um time</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={match.date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formResult">
          <Form.Label>Resultado</Form.Label>
          <Form.Control
            as="select"
            name="result"
            value={match.result}
            onChange={handleChange}
          >
            <option value="">Escolha o resultado</option>
            <option value="Vitória Time 1">Vitória Time 1</option>
            <option value="Vitória Time 2">Vitória Time 2</option>
            <option value="Empate">Empate</option>
          </Form.Control>
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Partida adicionada com sucesso!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSaveMatch}>
            Salvar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewMatchPage;