import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';

const NewTeamPage = () => {
  const router = useRouter();
  const [team, setTeam] = useState({
    name: '',
    city: '',
    coach: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prevTeam) => ({ ...prevTeam, [name]: value }));
  };

  const handleSaveTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setTeam({
          name: '',
          city: '',
          coach: '',
        });
      } else {
        console.error('Error adding team:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleBackToList = () => {
    router.push('/teams');
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4 mb-4">Novo Time</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nome do Time</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do time"
            name="name"
            value={team.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCity">
          <Form.Label>Cidade</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite a cidade do time"
            name="city"
            value={team.city}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCoach">
          <Form.Label>Treinador</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do treinador"
            name="coach"
            value={team.coach}
            onChange={handleChange}
          />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Time adicionado com sucesso!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSaveTeam}>
            Salvar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewTeamPage;