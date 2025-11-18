import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Chip,
} from '@heroui/react';
import { useAuth } from '../context/AuthContext';
import { eventsService } from '../services/eventsService';
import { applicationsService } from '../services/applicationsService';
import { EventPublic, ApplicationPublic } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState<EventPublic[]>([]);
  const [myApplications, setMyApplications] = useState<ApplicationPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const isOrg = (user as any)?.role === 'organisation';
  const isUser = (user as any)?.role === 'user';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      if (isOrg) {
        const events = await eventsService.getMyEvents();
        setMyEvents(events.slice(0, 3));
      } else if (isUser) {
        const applications = await applicationsService.getMyApplications();
        setMyApplications(applications.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-default-500">
          Dobrodošli, {isOrg ? (user as any)?.name : (user as any)?.username || user?.email || 'Korisniče'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Profil</h2>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-default-500">
              Email: {(user as any)?.email || 'N/A'}
            </p>
            {(user as any)?.username && (
              <p className="text-sm text-default-500">
                Username: {(user as any).username}
              </p>
            )}
            {(user as any)?.role && (
              <p className="text-sm text-default-500">
                Uloga: {(user as any).role === 'organisation' ? 'Organizacija' : 'Korisnik'}
              </p>
            )}
            {isOrg && (user as any)?.name && (
              <p className="text-sm text-default-500">
                Naziv: {(user as any).name}
              </p>
            )}
          </CardBody>
          <CardFooter>
            <Button
              variant="flat"
              size="sm"
              onPress={() => navigate('/profile')}
            >
              Ažuriraj profil
            </Button>
          </CardFooter>
        </Card>

        {isOrg && (
          <>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Moji događaji</h2>
              </CardHeader>
              <CardBody>
                {myEvents.length === 0 ? (
                  <p className="text-sm text-default-500">
                    Nemate kreiranih događaja
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myEvents.map((event) => (
                      <div key={event.id} className="text-sm">
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-default-500 text-xs">{event.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
              <CardFooter className="flex gap-2">
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => navigate('/events/create')}
                >
                  Kreiraj događaj
                </Button>
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => navigate('/events')}
                >
                  Svi događaji
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Prijave</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-500">
                  Pregledaj prijave za vaše događaje
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => navigate('/org/applications')}
                >
                  Pregledaj prijave
                </Button>
              </CardFooter>
            </Card>
          </>
        )}

        {isUser && (
          <>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Moje prijave</h2>
              </CardHeader>
              <CardBody>
                {myApplications.length === 0 ? (
                  <p className="text-sm text-default-500">
                    Nemate prijava za događaje
                  </p>
                ) : (
                  <div className="space-y-2">
                    {myApplications.map((app) => (
                      <div key={app.id} className="text-sm">
                        <p className="font-semibold">{app.event_title}</p>
                        <Chip
                          size="sm"
                          color={
                            app.status === 'accepted'
                              ? 'success'
                              : app.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          variant="flat"
                        >
                          {app.status}
                        </Chip>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
              <CardFooter>
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => navigate('/applications')}
                >
                  Sve prijave
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Događaji</h2>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-500">
                  Pretraži i prijavi se za događaje
                </p>
              </CardBody>
              <CardFooter>
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => navigate('/events')}
                >
                  Pregledaj događaje
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

