import { useState } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState('login');
  return (
    <div>
      {authMode === 'login' && <LoginForm setAuthMode={setAuthMode} />}
      {authMode === 'register' && <RegisterForm setAuthMode={setAuthMode} />}
    </div>
  );
};
export default LoginPage;
