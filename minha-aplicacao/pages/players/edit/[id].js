import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const EditTeamPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState({ name: '', city: '', coach: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch team data by id and set the state
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${id}`);
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error(`Error fetching team ${id}`, error);
      }
    };

    if (id) {
      fetchTeam();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeam({ ...team, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Simulate a confirmation, you can modify this part based on your needs
      const confirmed = window.confirm('Deseja realmente salvar as alterações?');

      if (confirmed) {
        const response = await fetch(`/api/teams/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(team),
        });

        if (response.ok) {
          // Team updated successfully, you can redirect or handle as needed
          setShowConfirmation(true);
        } else {
          console.error('Failed to update team');
        }
      }
    } catch (error) {
      console.error('Error updating team', error);
    }
  };

  const handleBackToList = () => {
    router.push('/teams');
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Edit Team</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name="name" value={team.name} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="Enter city" name="city" value={team.city} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCoach">
          <Form.Label>Coach</Form.Label>
          <Form.Control type="text" placeholder="Enter coach" name="coach" value={team.coach} onChange={handleInputChange} />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Team updated successfully!
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

export default EditTeamPage;