import NavbarComp from '../components/NavbarComp';
import Options from '../components/Options';

const SignupOptionScreen: React.FC = () => {
  return (
    <div>
      <NavbarComp />
      <Options
        driverText="Sign up to drive"
        userText="Create a rider account"
        driverLink="Driver/Signup"
        userLink="Signup"
      />
    </div>
  );
};

export default SignupOptionScreen;
