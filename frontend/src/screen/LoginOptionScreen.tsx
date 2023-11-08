import NavbarComp from "../components/NavbarComp";
import Options from "../components/Options";

const LoginOptionScreen: React.FC = () => {
  return (
    <div>
      <NavbarComp />
      <Options
        driverText="Sign in to drive"
        userText="Sign in to ride"
        driverLink="Driver/Login"
        userLink="Login"
      />
    </div>
  );
};

export default LoginOptionScreen;
