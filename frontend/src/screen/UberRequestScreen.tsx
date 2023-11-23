import LoadingBox from '../components/LoadingBox';
import { Container } from 'react-bootstrap';
import { Client } from '@stomp/stompjs';

const UberRequestScreen: React.FC = () => {
  const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    onConnect: () => {
      client.subscribe('/topic/acceptUberRequest', (message) => {
        const updatedUberRequest = JSON.parse(message.body);
        if (updatedUberRequest.accepted) {
          window.location.href = '/userAccepted';
        }
      });
    },
    onDisconnect: () => {
      //console.log('Disconnected from the WebSocket');
    },
    onStompError: (error) => {
      //console.error('WebSocket error:', error);
    },
  });

  client.activate();

  return (
    <Container>
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div
          className="text-center"
          style={{
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            fontSize: '1.2em',
          }}
        >
          <LoadingBox size={50} />
          <p style={{ fontSize: '1.5em', marginBottom: '10px' }}>
            Looking for your driver...
          </p>
          <p style={{ fontSize: '1em', fontStyle: 'italic' }}>
            If a driver doesn't accept your request in 5 minutes, you will be
            refunded.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default UberRequestScreen;
