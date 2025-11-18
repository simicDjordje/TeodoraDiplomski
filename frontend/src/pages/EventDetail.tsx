import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import { eventsService } from '../services/eventsService';
import { applicationsService } from '../services/applicationsService';
import { EventPublic, ApplicationIn } from '../types';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [application, setApplication] = useState<ApplicationIn>({
    event_id: id || '',
    motivation: '',
    phone: '',
    extra_notes: '',
  });

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getEventById(id!);
      setEvent(data);
      // EventPublic može imati id ili možemo koristiti id iz URL-a
      const eventId = (data as any).id || (data as any)._id || id!;
      setApplication((prev) => ({ ...prev, event_id: eventId }));
    } catch (err: any) {
      console.error('Error loading event:', err);
      setError(err.response?.data?.detail || 'Greška pri učitavanju događaja');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!application.motivation || !application.phone) {
      alert('Molimo popunite sva obavezna polja');
      return;
    }

    try {
      setApplying(true);
      await applicationsService.applyForEvent(application);
      alert('Uspešno ste se prijavili za događaj!');
      onClose();
      setApplication({
        event_id: id || '',
        motivation: '',
        phone: '',
        extra_notes: '',
      });
    } catch (error: any) {
      alert(error.message || 'Greška pri prijavljivanju');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">Učitavanje događaja...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button variant="flat" onPress={() => navigate('/events')} className="mb-4">
          ← Nazad na događaje
        </Button>
        <Card>
          <CardBody>
            <p className="text-center text-danger">{error || 'Događaj nije pronađen.'}</p>
            <Button
              color="primary"
              variant="flat"
              className="mt-4 mx-auto"
              onPress={() => navigate('/events')}
            >
              Nazad na događaje
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const isUser = isAuthenticated && (user as any)?.role === 'user';
  const isOrg = isAuthenticated && (user as any)?.role === 'organisation';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="flat" onPress={() => navigate('/events')}>
        ← Nazad na događaje
      </Button>

      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      )}

      <Card>
        <CardHeader className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <Chip color="primary" variant="flat">
              {event.category}
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Opis</h2>
            <p className="text-default-600">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-default-500">Datum početka</p>
              <p className="font-semibold">{formatDate(event.start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Datum završetka</p>
              <p className="font-semibold">{formatDate(event.end_date)}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Lokacija</p>
              <p className="font-semibold">{event.location}</p>
            </div>
            {event.organisation_name && (
              <div>
                <p className="text-sm text-default-500">Organizacija</p>
                <p className="font-semibold">{event.organisation_name}</p>
              </div>
            )}
            {event.max_volunteers && (
              <div>
                <p className="text-sm text-default-500">Maksimalno volontera</p>
                <p className="font-semibold">{event.max_volunteers}</p>
              </div>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div>
              <p className="text-sm text-default-500 mb-2">Tagovi</p>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <Chip key={idx} size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter>
          {!isAuthenticated && (
            <div className="w-full text-center space-y-2">
              <p className="text-sm text-default-500">
                Da biste se prijavili za događaj, morate biti ulogovani.
              </p>
              <Button
                color="primary"
                variant="flat"
                onPress={() => navigate('/login')}
                className="w-full"
              >
                Prijavi se
              </Button>
            </div>
          )}
          {isUser && (
            <Button color="primary" onPress={onOpen} className="w-full">
              Prijavi se za događaj
            </Button>
          )}
          {isOrg && (user as any)?.username === event.organisation_name && (
            <Button
              color="secondary"
              onPress={() => navigate(`/events/${id}/applications`)}
              className="w-full"
            >
              Pregledaj prijave
            </Button>
          )}
          {isOrg && !((user as any)?.username === event.organisation_name) && (
            <Button
              color="secondary"
              variant="flat"
              onPress={() => navigate('/org/applications')}
              className="w-full"
            >
              Sve prijave
            </Button>
          )}
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Prijava za događaj</ModalHeader>
          <ModalBody>
            <Textarea
              label="Motivaciono pismo"
              placeholder="Zašto želite da se prijavite za ovaj događaj?"
              value={application.motivation}
              onChange={(e) =>
                setApplication({ ...application, motivation: e.target.value })
              }
              minRows={4}
              isRequired
            />
            <Input
              label="Broj telefona"
              placeholder="+381..."
              value={application.phone}
              onChange={(e) => setApplication({ ...application, phone: e.target.value })}
              isRequired
            />
            <Textarea
              label="Dodatne napomene (opciono)"
              placeholder="Dodatne informacije..."
              value={application.extra_notes || ''}
              onChange={(e) =>
                setApplication({ ...application, extra_notes: e.target.value })
              }
              minRows={2}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Otkaži
            </Button>
            <Button color="primary" onPress={handleApply} isLoading={applying}>
              Pošalji prijavu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EventDetail;

