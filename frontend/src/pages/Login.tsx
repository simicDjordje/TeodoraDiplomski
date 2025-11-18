import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from '@heroui/react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Greška pri prijavljivanju');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Prijavi se</h1>
          <p className="text-sm text-default-500">
            Unesite svoje kredencijale za prijavu
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-danger-50 text-danger text-sm rounded-lg">
                {error}
              </div>
            )}
            <Input
              label="Email"
              placeholder="unesite@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              autoComplete="email"
            />
            <Input
              label="Lozinka"
              placeholder="Unesite lozinku"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              autoComplete="current-password"
            />
          </CardBody>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              color="primary"
              variant="solid"
              className="w-full text-white"
              isLoading={loading}
            >
              Prijavi se
            </Button>
            <p className="text-sm text-center text-default-500">
              Nemate nalog?{' '}
              <Link to="/register" className="text-primary">
                Registruj se
              </Link>
            </p>
            <p className="text-sm text-center text-default-500">
              Organizacija?{' '}
              <Link to="/org/login" className="text-primary">
                Prijavi se kao organizacija
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

