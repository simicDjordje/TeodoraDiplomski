import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { applicationsService } from '../services/applicationsService';
import { ApplicationPublic, ApplicationStatus } from '../types';

const MyApplications = () => {
  const [applications, setApplications] = useState<ApplicationPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<ApplicationPublic | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsService.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      console.error('Error loading applications:', err);
      setError(err.response?.data?.detail || 'Greška pri učitavanju prijava');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (applicationId: string) => {
    if (!window.confirm('Da li ste sigurni da želite da otkažete prijavu?')) {
      return;
    }

    try {
      setCancelling(applicationId);
      await applicationsService.cancelApplication(applicationId);
      await loadApplications();
      alert('Prijava je uspešno otkazana');
    } catch (error: any) {
      alert(error.message || 'Greška pri otkazivanju prijave');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.accepted:
        return 'success';
      case ApplicationStatus.rejected:
        return 'danger';
      case ApplicationStatus.cancelled:
        return 'default';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.accepted:
        return 'Prihvaćeno';
      case ApplicationStatus.rejected:
        return 'Odbijeno';
      case ApplicationStatus.cancelled:
        return 'Otkazano';
      default:
        return 'Na čekanju';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">Učitavanje prijava...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moje prijave</h1>

      {error && (
        <Card className="border-danger">
          <CardBody>
            <p className="text-danger text-center">{error}</p>
            <Button
              color="primary"
              variant="flat"
              size="sm"
              className="mt-2 mx-auto"
              onPress={loadApplications}
            >
              Pokušaj ponovo
            </Button>
          </CardBody>
        </Card>
      )}

      {applications.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-default-500">
              Nemate nijednu prijavu za događaje.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{app.event_title}</h3>
                  <p className="text-sm text-default-500">
                    Organizacija: {app.organisation_name}
                  </p>
                </div>
                <Chip color={getStatusColor(app.status)} variant="flat">
                  {getStatusLabel(app.status)}
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold">Motivaciono pismo:</p>
                    <p className="text-sm text-default-600">{app.motivation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Kontakt telefon:</p>
                    <p className="text-sm text-default-600">{app.phone}</p>
                  </div>
                  {app.extra_notes && (
                    <div>
                      <p className="text-sm font-semibold">Dodatne napomene:</p>
                      <p className="text-sm text-default-600">{app.extra_notes}</p>
                    </div>
                  )}
                  <p className="text-xs text-default-400">
                    Datum prijave: {formatDate(app.created_at)}
                  </p>
                </div>
              </CardBody>
              <CardFooter>
                {app.status === ApplicationStatus.pending && (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => handleCancel(app.id!)}
                    isLoading={cancelling === app.id}
                  >
                    Otkaži prijavu
                  </Button>
                )}
                <Button
                  variant="flat"
                  onPress={() => {
                    setSelectedApp(app);
                    onOpen();
                  }}
                  className="ml-auto"
                >
                  Detalji
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Detalji prijave</ModalHeader>
          <ModalBody>
            {selectedApp && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold">Događaj:</p>
                  <p>{selectedApp.event_title}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Organizacija:</p>
                  <p>{selectedApp.organisation_name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Status:</p>
                  <Chip color={getStatusColor(selectedApp.status)} variant="flat">
                    {getStatusLabel(selectedApp.status)}
                  </Chip>
                </div>
                <div>
                  <p className="text-sm font-semibold">Motivaciono pismo:</p>
                  <p className="text-default-600">{selectedApp.motivation}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Kontakt telefon:</p>
                  <p>{selectedApp.phone}</p>
                </div>
                {selectedApp.extra_notes && (
                  <div>
                    <p className="text-sm font-semibold">Dodatne napomene:</p>
                    <p className="text-default-600">{selectedApp.extra_notes}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">Datum prijave:</p>
                  <p>{formatDate(selectedApp.created_at)}</p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Zatvori</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MyApplications;

