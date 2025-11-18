import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  Avatar,
  Divider,
} from '@heroui/react';
import { applicationsService } from '../services/applicationsService';
import { ApplicationPublic, ApplicationStatus, OrgDecision } from '../types';

const OrgApplications = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<ApplicationPublic | null>(null);
  const [decision, setDecision] = useState<OrgDecision | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, [eventId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: ApplicationPublic[];
      if (eventId) {
        data = await applicationsService.getEventApplications(eventId);
      } else {
        data = await applicationsService.getAllApplicationsForOrg();
      }
      setApplications(data);
    } catch (err: any) {
      console.error('Error loading applications:', err);
      setError(err.response?.data?.detail || 'Greška pri učitavanju prijava');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = (app: ApplicationPublic, decisionType: OrgDecision) => {
    setSelectedApp(app);
    setDecision(decisionType);
    setNotes('');
    onOpen();
  };

  const confirmDecision = async () => {
    if (!selectedApp || !decision) return;

    try {
      setProcessing(selectedApp.id!);
      await applicationsService.updateApplicationStatus(
        selectedApp.id!,
        decision,
        notes || undefined
      );
      await loadApplications();
      onClose();
      setSelectedApp(null);
      setDecision(null);
      setNotes('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Greška pri ažuriranju statusa');
    } finally {
      setProcessing(null);
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
      hour: '2-digit',
      minute: '2-digit',
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {eventId ? 'Prijave za događaj' : 'Sve prijave'}
        </h1>
        {eventId && (
          <Button variant="flat" onPress={() => navigate(`/events/${eventId}`)}>
            Nazad na događaj
          </Button>
        )}
      </div>

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
              {eventId ? 'Nema prijava za ovaj događaj.' : 'Nemate prijava.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{app.event_title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar
                      src={app.user_info?.profile_image}
                      name={app.user_info?.name || app.user_info?.username}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {app.user_info?.name || app.user_info?.username}
                      </p>
                      {app.user_info?.email && (
                        <p className="text-xs text-default-500">{app.user_info.email}</p>
                      )}
                    </div>
                  </div>
                </div>
                <Chip color={getStatusColor(app.status)} variant="flat">
                  {getStatusLabel(app.status)}
                </Chip>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-default-500 mb-1">Motivaciono pismo:</p>
                  <p className="text-sm text-default-700">{app.motivation}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-default-500 mb-1">Kontakt telefon:</p>
                  <p className="text-sm text-default-700">{app.phone}</p>
                </div>
                {app.extra_notes && (
                  <div>
                    <p className="text-sm font-semibold text-default-500 mb-1">Dodatne napomene:</p>
                    <p className="text-sm text-default-700">{app.extra_notes}</p>
                  </div>
                )}
                <p className="text-xs text-default-400">
                  Datum prijave: {formatDate(app.created_at)}
                </p>
              </CardBody>
              {app.status === ApplicationStatus.pending && (
                <CardFooter className="flex gap-2">
                  <Button
                    color="success"
                    variant="flat"
                    onPress={() => handleDecision(app, OrgDecision.accepted)}
                    isLoading={processing === app.id}
                  >
                    Prihvati
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => handleDecision(app, OrgDecision.rejected)}
                    isLoading={processing === app.id}
                  >
                    Odbij
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {decision === OrgDecision.accepted ? 'Prihvati prijavu' : 'Odbij prijavu'}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-600 mb-4">
              Da li ste sigurni da želite da {decision === OrgDecision.accepted ? 'prihvatite' : 'odbijete'} ovu prijavu?
            </p>
            <Textarea
              label="Dodatne napomene (opciono)"
              placeholder="Dodatne napomene za korisnika..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Otkaži
            </Button>
            <Button
              color={decision === OrgDecision.accepted ? 'success' : 'danger'}
              onPress={confirmDecision}
              isLoading={processing === selectedApp?.id}
            >
              Potvrdi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OrgApplications;

