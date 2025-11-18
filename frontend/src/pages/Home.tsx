import { Card, CardHeader, CardBody, CardFooter, Button, Link } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Dobrodošli</h1>
        <p className="text-xl text-default-500 mb-8">
          Vaša diplomska aplikacija
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md font-semibold">Za korisnike</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Prijavite se ili registrujte kao korisnik da biste pristupili aplikaciji.
            </p>
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              variant="flat"
              onPress={() => navigate('/login')}
              className="w-full"
            >
              Prijavi se
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md font-semibold">Za organizacije</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Organizacije mogu da se prijave i upravljaju svojim događajima.
            </p>
          </CardBody>
          <CardFooter>
            <Button
              color="secondary"
              variant="flat"
              onPress={() => navigate('/org/login')}
              className="w-full"
            >
              Prijavi se kao organizacija
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md font-semibold">Registracija</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Kreirajte novi nalog i počnite da koristite aplikaciju.
            </p>
          </CardBody>
          <CardFooter>
            <Button
              color="success"
              variant="flat"
              onPress={() => navigate('/register')}
              className="w-full"
            >
              Registruj se
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          color="primary"
          size="lg"
          variant="flat"
          onPress={() => navigate('/events')}
        >
          Pregledaj događaje
        </Button>
        {isAuthenticated && (
          <Button
            color="primary"
            size="lg"
            onPress={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default Home;

