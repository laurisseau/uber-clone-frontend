import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import PriceScreen from './screen/PriceScreen';
import LoginScreen from './screen/LoginScreen';
import SignupScreen from './screen/SignupScreen';
import PaymentScreen from './screen/PaymentScreen';
import UberRequestScreen from './screen/UberRequestScreen';
import SignupOptionScreen from './screen/SignupOptionScreen';
import LoginOptionScreen from './screen/LoginOptionScreen';
import DriverSignupScreen from './screen/DriverSignupScreen';
import DriverLoginScreen from './screen/DriverLoginScreen';
import DriverHomeScreen from './screen/DriverHomeScreen';
import UserAcceptedScreen from './screen/UserAcceptedScreen';
import AcceptedUberRequestScreen from './screen/AcceptedUberRequestScreen';


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/Prices/:id" element={<PriceScreen />} />
          <Route path="/Payment/:id" element={<PaymentScreen />} />
          <Route path="/LoginOptions/Login" element={<LoginScreen />} />
          <Route path="/SignupOptions/Signup" element={<SignupScreen />} />
          <Route path="/uberRequest/:id" element={<UberRequestScreen />} />
          <Route path="/SignupOptions" element={<SignupOptionScreen />} />
          <Route path="/LoginOptions" element={<LoginOptionScreen />} />
          <Route
            path="/SignupOptions/Driver/Signup"
            element={<DriverSignupScreen />}
          />
          <Route
            path="/LoginOptions/Driver/Login"
            element={<DriverLoginScreen />}
          />
          <Route path="/DriverHome" element={<DriverHomeScreen />} />
          <Route path="/userAccepted/:id" element={<UserAcceptedScreen />} />
          <Route path="/acceptedUberRequest" element={<AcceptedUberRequestScreen />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;
