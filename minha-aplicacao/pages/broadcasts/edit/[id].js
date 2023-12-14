import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Container, Alert } from 'react-bootstrap';

const EditBroadcastPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [broadcast, setBroadcast] = useState({ match_id: '', url: '', platform: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch broadcast data by id and set the state
    const fetchBroadcast = async () => {
      try {
        const response = await fetch(`/api/broadcasts/${id}`);
        const data = await response.json();
        setBroadcast(data);
      } catch (error) {
        console.error(`Error fetching broadcast ${id}`, error);
      }
    };

    if (id) {
      fetchBroadcast();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBroadcast({ ...broadcast, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Simulate a confirmation, you can modify this part based on your needs
      const confirmed = window.confirm('Deseja realmente salvar as alterações?');

      if (confirmed) {
        const response = await fetch(`/api/broadcasts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(broadcast),
        });

        if (response.ok) {
          // Broadcast updated successfully, you can redirect or handle as needed
          setShowConfirmation(true);
        } else {
          console.error('Failed to update broadcast');
        }
      }
    } catch (error) {
      console.error('Error updating broadcast', error);
    }
  };

  const handleBackToList = () => {
    router.push('/broadcasts');
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1>Edit Broadcast</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formMatchID">
          <Form.Label>Match ID</Form.Label>
          <Form.Control type="text" placeholder="Enter match ID" name="match_id" value={broadcast.match_id} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formURL">
          <Form.Label>URL</Form.Label>
          <Form.Control type="text" placeholder="Enter URL" name="url" value={broadcast.url} onChange={handleInputChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPlatform">
          <Form.Label>Platform</Form.Label>
          <Form.Control type="text" placeholder="Enter platform" name="platform" value={broadcast.platform} onChange={handleInputChange} />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Broadcast updated successfully!
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

export default EditBroadcastPage;