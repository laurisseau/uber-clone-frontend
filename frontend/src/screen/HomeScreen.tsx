import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import NavbarComp from '../components/NavbarComp';
import { Container, Form } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { Context } from '../Provider';

interface Address {
  street: string;
  city: string;
  state: string;
}

type Leg = {
  distance: { text: String };
  duration: { text: String };
  start_location: { lat: number; lng: number };
  end_location: { lat: number; lng: number };
  start_address: String;
  end_address: String;
};

const HomeScreen: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const { state, dispatch: ctxDispatch } = useContext(Context);
  const { userInfo } = state;

  //console.log(userInfo)

  const [currentLocationSuggestions, setCurrentLocationSuggestions] = useState<
    Address[]
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Address[]
  >([]);

  useEffect(() => {
    if (userInfo?.role === 'DRIVER') {
      window.location.href = '/driverhome';
    }
  }, [userInfo]);

  const getDirections = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/user/getDirections/origin=${currentLocation}&dest=${destination}`,
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
        const distance = result.distance.text;
        const duration = result.duration.text;
        const destination = result.end_location;
        const origin = result.start_location;
        const originAddress = result.start_address;
        const destinationAddress = result.end_address;

        uberRequest(
          distance,
          duration,
          destination,
          origin,
          originAddress,
          destinationAddress
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const uberRequest = async (
    distance: String,
    duration: String,
    destination: { lat: number; lng: number },
    origin: { lat: number; lng: number },
    originAddress: String,
    destinationAddress: String
  ) => {
    try {
      const username = userInfo?.username;
      const number = userInfo?.number;
      const token = userInfo?.token;

      const requestData = {
        username,
        origin,
        destination,
        number,
        duration,
        distance,
        originAddress,
        destinationAddress,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:8080/api/user/uberRequest',
        requestData,
        config
      );

      if (data) {
        window.location.href = `/prices/${data.id}`;
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleDestinationChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);
    /*
    try {
      const response: AxiosResponse<Address[]> = await axios.get(
        `http://localhost:8080/api/permitAll/Autocomplete/dest=${value}`
      );
      if (response.status === 200) {
        if (value === '') {
          setDestinationSuggestions([]);
        } else {
          setDestinationSuggestions(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    */
  };

  const handleCurrentLocationChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCurrentLocation(value);
    /*
    try {
      const response: AxiosResponse<Address[]> = await axios.get(
        `http://localhost:8080/api/permitAll/Autocomplete/dest=${value}`
      );
      if (response.status === 200) {
        if (value === '') {
          setCurrentLocationSuggestions([]);
        } else {
          setCurrentLocationSuggestions(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    */
  };

  const handleDestinationSuggestionClick = (selectedAddress: Address) => {
    const { street, city, state } = selectedAddress;
    setDestination(`${street}, ${city}, ${state}`);
    setDestinationSuggestions([]); // Clear suggestions after selection
  };

  const handleCurrentLocationSuggestionClick = (selectedAddress: Address) => {
    const { street, city, state } = selectedAddress;
    setCurrentLocation(`${street}, ${city}, ${state}`);
    setCurrentLocationSuggestions([]); // Clear suggestions after selection
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        try {
          //const { data } = await axios.get(`api/permitAll/getCurrentLocation/lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
          //console.log(data.results)
          //setCurrentLocation(data.results[0].formatted_address);
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

  return (
    <div className="home">
      <NavbarComp />

      <Container className="d-flex justify-content-between align-items-center pb-4 mt-5">
        <div className="home-left-box">
          <h1 className="mb-5">Where do you want to go?</h1>
          <p>Request a ride, hop in, and go.</p>
          <Form onSubmit={getDirections}>
            <Form.Group
              className="mb-3 address-form-width"
              controlId="location"
            >
              <Form.Control
                value={currentLocation}
                onChange={handleCurrentLocationChange}
                className="address-form-height"
                type="address"
                placeholder="Enter location"
              />
              {/* Display suggestions */}
              <ul className="suggestions-list">
                {currentLocationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleCurrentLocationSuggestionClick(suggestion)
                    }
                  >
                    <div className="suggestion-item">
                      <span className="street-line">
                        {suggestion.street}, {suggestion.city},{' '}
                        {suggestion.state}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Form.Group>

            <Form.Group
              className="mb-3 address-form-width"
              controlId="destination"
            >
              <Form.Control
                className="address-form-height"
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={handleDestinationChange}
              />
              {/* Display suggestions */}
              <ul className="suggestions-list">
                {destinationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleDestinationSuggestionClick(suggestion)}
                  >
                    <div className="suggestion-item">
                      <span className="street-line">
                        {suggestion.street}, {suggestion.city},{' '}
                        {suggestion.state}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Form.Group>

            <button className="home-button mt-2">See price</button>
          </Form>
        </div>

        <div>
          <img
            className="home-img"
            alt="ride with uber"
            src="https://img.freepik.com/free-vector/car-driving-concept-illustration_114360-8011.jpg?w=740&t=st=1698558635~exp=1698559235~hmac=d5515dade7d3f2caad01e43f4448986f4d8d854d88787d6c56895defeed33f07"
          ></img>
        </div>
      </Container>
    </div>
  );
};

export default HomeScreen;
