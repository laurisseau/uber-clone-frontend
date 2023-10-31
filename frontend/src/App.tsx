import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screen/HomeScreen';
import PriceScreen from './screen/PriceScreen';
import LoginScreen from './screen/LoginScreen';
import SignupScreen from './screen/SignupScreen';

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/Prices/:id" element={<PriceScreen />} />
          <Route path="/Login" element={<LoginScreen />} />
          <Route path="/Signup" element={<SignupScreen />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;