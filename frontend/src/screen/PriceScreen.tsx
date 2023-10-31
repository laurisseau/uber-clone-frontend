import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Provider';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import NavbarComp from '../components/NavbarComp';
import { Button, Container, Navbar } from 'react-bootstrap';
import carIcon from '../img/car_10527775.png';

mapboxgl.accessToken =
  'pk.eyJ1IjoibGF1cmlzc2VhdSIsImEiOiJjbG9kd2k0c3QwNjhjMm1uM21mNjkwOXc2In0.U2bI-7bBBhZ_CnXhqiyYiA';

const PriceScreen: React.FC = () => {
  const { state } = useContext(Context);
  const [uberRequest, setUberRequest] = useState<any>({});
  const cost: number = uberRequest?.cost / 100;
  const duration: string = uberRequest?.duration;
  const { userInfo } = state;
  const params = useParams();
  const { id } = params;

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const zoom: number = 9;
  const [markers, setMarkers] = useState<[number, number][]>([]);

  useEffect(() => {
    const getUberRequest = async () => {
      try {
        const token = userInfo?.token;
        if (id && token) {
          const { data } = await axios.get(`/api/user/uberRequest/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (data) {
            setUberRequest(data);
            setLng(data.origin?.lng || 0);
            setLat(data.origin?.lat || 0);

            // Check if both origin and destination are available before setting markers
            if (data.origin && data.destination) {
              setMarkers([
                [data.destination.lng, data.destination.lat],
                [data.origin.lng, data.origin.lat],
              ]);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getUberRequest();
  }, [id, userInfo?.token]);

  useEffect(() => {
    if (mapContainer.current && lng && lat) {
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: zoom,
        });
      }

      if (markers.length > 0 && map.current) {
        markers.forEach((coord) => {
          new mapboxgl.Marker().setLngLat(coord).addTo(map.current!);
        });

        const bounds = new mapboxgl.LngLatBounds();
        markers.forEach((coord) => {
          bounds.extend(coord);
        });

        map.current.fitBounds(bounds, {
          padding: 50,
        });
      }
    }
  }, [lng, lat, zoom, markers]);

  const paymentHandler = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(`payment of ${cost}`)

  }


  return (
    <div>
      <NavbarComp />{' '}
      <div ref={mapContainer} style={{ width: '100%', height: '50vh' }} />
      <div>
        <Container className="mt-5">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={carIcon}
                alt="car icon"
                style={{ width: '50px', height: '50px' }}
              ></img>
              <h3 className="ms-1">UberX</h3>
            </div>

            <div>
              <h5 style={{ textAlign: 'right' }}>${cost}</h5>
              <p>{duration}</p>
            </div>
          </div>
        </Container>

        <Navbar
          className="d-flex justify-content-center border-top"
          bg="light"
          fixed="bottom"
        >
          <Button onClick={paymentHandler} variant="dark" className="mb-4 w-50" size="lg">
            Confirm UberX
          </Button>
        </Navbar>
      </div>
    </div>
  );
};

export default PriceScreen;
