import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';

const NewTournament = () => {
  const router = useRouter();
  const [tournament, setTournament] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament((prevTournament) => ({ ...prevTournament, [name]: value }));
  };

  const handleSaveTournament = async () => {
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournament),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setTournament({
          name: '',
          start_date: '',
          end_date: '',
        });
      } else {
        console.error('Error adding tournament:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  };

  const handleBackToList = () => {
    router.push('/tournaments');
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4 mb-4">Novo Torneio</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite o nome do torneio"
            name="name"
            value={tournament.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStartDate">
          <Form.Label>Data de Início</Form.Label>
          <Form.Control
            type="date"
            placeholder="Selecione a data de início"
            name="start_date"
            value={tournament.start_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEndDate">
          <Form.Label>Data de Término</Form.Label>
          <Form.Control
            type="date"
            placeholder="Selecione a data de término"
            name="end_date"
            value={tournament.end_date}
            onChange={handleChange}
          />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Torneio adicionado com sucesso!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSaveTournament}>
            Salvar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewTournament;