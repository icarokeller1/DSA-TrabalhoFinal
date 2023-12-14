import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Alert } from 'react-bootstrap';

const NewBroadcast = () => {
  const router = useRouter();
  const [broadcast, setBroadcast] = useState({
    match_id: '',
    url: '',
    platform: '',
  });
  const [matches, setMatches] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches', error);
      }
    };

    fetchMatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBroadcast((prevBroadcast) => ({ ...prevBroadcast, [name]: value }));
  };

  const handleSaveBroadcast = async () => {
    try {
      const response = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(broadcast),
      });

      if (response.ok) {
        setShowConfirmation(true);
        setBroadcast({
          match_id: '',
          url: '',
          platform: '',
        });
      } else {
        console.error('Error adding broadcast:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding broadcast:', error);
    }
  };

  const handleBackToList = () => {
    router.push('/broadcasts');
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="mt-4 mb-4">Nova Transmissão</h1>
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="formMatch">
          <Form.Label>Partida</Form.Label>
          <Form.Control
            as="select"
            name="match_id"
            value={broadcast.match_id}
            onChange={handleChange}
          >
            <option value="">Selecione uma partida</option>
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {`${match.team1?.name} x ${match.team2?.name}`}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUrl">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite a URL da transmissão"
            name="url"
            value={broadcast.url}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPlatform">
          <Form.Label>Plataforma</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite a plataforma da transmissão"
            name="platform"
            value={broadcast.platform}
            onChange={handleChange}
          />
        </Form.Group>

        {showConfirmation && (
          <Alert variant="success" onClose={() => setShowConfirmation(false)} dismissible>
            Transmissão adicionada com sucesso!
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleBackToList}>
            Voltar para a lista
          </Button>
          <Button variant="primary" onClick={handleSaveBroadcast}>
            Salvar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewBroadcast;