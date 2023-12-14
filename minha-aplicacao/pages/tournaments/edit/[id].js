import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const EditTournamentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tournament, setTournament] = useState({ name: '', start_date: '', end_date: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch tournament data by id and set the state
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${id}`);
        const data = await response.json();
        setTournament(data);
      } catch (error) {
        console.error(`Error fetching tournament ${id}`, error);
      }
    };

    if (id) {
      fetchTournament();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTournament({ ...tournament, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Simulate a confirmation, you can modify this part based on your needs
      const confirmed = window.confirm('Deseja realmente salvar as alterações?');

      if (confirmed) {
        const response = await fetch(`/api/tournaments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tournament),
        });

        if (response.ok) {
          // Tournament updated successfully, you can redirect or handle as needed
          setShowConfirmation(true);
        } else {
          console.error('Failed to update tournament');
        }
      }
    } catch (error) {
      console.error('Error updating tournament', error);
    }
  };

  const handleBackToList = () => {
    router.push('/tournaments');
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Edit Tournament</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formTournamentName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name="name" value={tournament.name} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" name="start_date" value={tournament.start_date} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control type="date" name="end_date" value={tournament.end_date} onChange={handleInputChange} />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Tournament updated successfully!
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

export default EditTournamentPage;