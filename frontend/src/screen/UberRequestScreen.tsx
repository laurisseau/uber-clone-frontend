import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import { Context } from '../Provider';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const UberRequestScreen: React.FC = () => {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const params = useParams();
  const { id } = params;

  /*
  useEffect(() => {
    const getUberRequest = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/user/uberRequest/${id}`,
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );

        if (data) {
          if (data.accepted) {
            window.location.href = '/userAccepted';
          }
        }
      } catch (err) {}
    };
    getUberRequest();
  },[id, userInfo?.token]);
*/

  //useEffect(() => {
    const sock = new SockJS('http://127.0.0.1:8080/ws');
    sock.onopen = function () {
      console.log('WebSocket connection established.');
    };
    sock.onclose = function (event) {
      console.log('WebSocket connection closed:', event);
    };
    sock.onerror = function (error) {
      console.error('WebSocket error:', error);
    };
  /*
    var client = Stomp.over(socket);

    client.connect({}, function (frame) {
      console.log('Connected: ' + frame);
    }, function (error) {
      console.error('STOMP error: ' + error);
    });
    */
  //}, []);

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
