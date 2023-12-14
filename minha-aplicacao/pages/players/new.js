import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';

const NewPlayer = () => {
  const router = useRouter();
  const [player, setPlayer] = useState({
    name: '',
    team_id: '',
    age: '',
    position: '',
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
    setPlayer((prevPlayer) => ({ ...prevPlayer, [name]: value }));
  };

  const handleSavePlayer = async () => {
    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(player),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setPlayer({
          name: '',
          team_id: '',
          age: '',
          position: '',
        });
      } else {
        console.error('Error adding player:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handleBackToList = () => {
    router.push('/players');
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4 mb-4">Novo Jogador</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do jogador"
            name="name"
            value={player.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTeam">
          <Form.Label>Time</Form.Label>
          <Form.Control
            as="select"
            name="team_id"
            value={player.team_id}
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

        <Form.Group className="mb-3" controlId="formAge">
          <Form.Label>Idade</Form.Label>
          <Form.Control
            type="number"
            placeholder="Digite a idade do jogador"
            name="age"
            value={player.age}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPosition">
          <Form.Label>Posição</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite a posição do jogador"
            name="position"
            value={player.position}
            onChange={handleChange}
          />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Jogador adicionado com sucesso!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSavePlayer}>
            Salvar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewPlayer;