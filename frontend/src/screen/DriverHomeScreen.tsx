import { Button, Container } from 'react-bootstrap';
import NavbarComp from '../components/NavbarComp';
import { Context } from '../Provider';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

interface UberRequest {
  duration: string;
  id: number;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  payment: { amount: number };
  originAddress: String;
  destinationAddress: String;
  driver_duration: String | undefined;
}

type Leg = {
  duration: { text: String };
};

const DriverHomeScreen: React.FC = () => {
  const [allPaidUberRequest, setAllPaidUberRequest] = useState<UberRequest[]>(
    []
  );
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const { state } = useContext(Context);
  const { userInfo } = state;
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo) {
      if (userInfo?.role !== 'DRIVER') {
        window.location.href = '/';
      }
    }
  }, [userInfo]);

  const getLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        try {
          const { data } = await axios.get(
            `api/permitAll/getCurrentLocation/lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          setCurrentLocation(data.results[0].formatted_address);
        } catch (err) {
          console.error('Error fetching current location from API:', err);
        }
      } catch (error) {
        console.error('Error getting the location:', error);
      }
    } else {
      console.error('Geolocation is not supported');
    }
  };

  getLocation();

  useEffect(() => {
    if (userInfo) {
      setToken(userInfo?.token);
      setUsername(userInfo?.username);
    }
    const getDirections = async (destination: String) => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/driver/getDirections/origin=${currentLocation}&dest=${destination}`,
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );

        let result: Leg | undefined;

        if (
          data &&
          data.routes &&
          data.routes.length > 0 &&
          data.routes[0].legs &&
          data.routes[0].legs.length > 0
        ) {
          result = data.routes[0].legs[0]; // Assign the first leg of the first route to result
        }

        if (result) {
          return result.duration.text;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const getAllPaidUberRequest = async () => {
      if (token) {
        try {
          const { data } = await axios.get<UberRequest[]>(
            `/api/driver/uberRequest`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (data) {
            const updatedUberRequests = await Promise.all(
              data.map(async (uberRequest) => {
                uberRequest['driver_duration'] = await getDirections(
                  uberRequest.originAddress
                );
                return uberRequest;
              })
            );
            setAllPaidUberRequest(updatedUberRequests);
            setReload(false);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    getAllPaidUberRequest();
  }, [
    reload,
    currentLocation,
    token,
    userInfo,
    userInfo?.token,
    userInfo?.username,
  ]);

  const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    onConnect: () => {
      client.subscribe('/topic/paidUberRequest', async (message) => {
        setReload(true);
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
  //-----------------
  const acceptUberRequest = async (id: number) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/driver/uberRequest/${id}`,
        {
          username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data) {
        window.location.href = '/acceptedUberRequest';
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cost = (amount: number) => {
    return amount / 100;
  };

  return (
    <div>
      <NavbarComp />

      <Container className="mt-5">
        {allPaidUberRequest?.map((uberRequest, index) => (
          <div
            key={index}
            className="w-100 mt-4 d-flex align-items-center justify-content-between border-bottom border-dark"
          >
            <div>
              <h5 style={{ textAlign: 'left' }}>
                ${cost(uberRequest.payment.amount)}
              </h5>
              <p>{uberRequest.duration}</p>
            </div>

            <div className="text-right" style={{ textAlign: 'right' }}>
              <Button
                variant="dark"
                onClick={() => acceptUberRequest(uberRequest.id)}
              >
                Accept
              </Button>
              <p className="mt-1">{uberRequest.driver_duration} away</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default DriverHomeScreen;
