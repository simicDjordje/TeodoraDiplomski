import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@heroui/react';
import { organisationsService } from '../services/organisationsService';
import { OrganisationPublic } from '../types';

const OrganisationDetail = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [organisation, setOrganisation] = useState<OrganisationPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      loadOrganisation();
    }
  }, [username]);

  const loadOrganisation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organisationsService.getOrganisationByUsername(username!);
      if (data.length > 0) {
        setOrganisation(data[0]);
      } else {
        setError('Organizacija nije pronađena');
      }
    } catch (err: any) {
      console.error('Error loading organisation:', err);
      setError(err.response?.data?.detail || 'Greška pri učitavanju organizacije');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">Učitavanje...</p>
      </div>
    );
  }

  if (error || !organisation) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody>
            <p className="text-center text-danger">{error || 'Organizacija nije pronađena'}</p>
            <Button
              color="primary"
              variant="flat"
              className="mt-4 mx-auto"
              onPress={() => navigate('/organisations')}
            >
              Nazad na organizacije
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="flat" onPress={() => navigate('/organisations')}>
        ← Nazad na organizacije
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row gap-4">
          <Avatar
            src={organisation.logo}
            name={organisation.name}
            size="lg"
            className="w-20 h-20 text-large"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{organisation.name}</h1>
            <p className="text-default-500">@{organisation.username}</p>
            <div className="flex gap-2 mt-2">
              <Chip
                size="sm"
                variant="flat"
                color={organisation.org_type === 'official' ? 'primary' : 'secondary'}
              >
                {organisation.org_type === 'official' ? 'Zvanična' : 'Nezvanična'}
              </Chip>
              {organisation.status === 'approved' && (
                <Chip size="sm" variant="flat" color="success">
                  Odobrena
                </Chip>
              )}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {organisation.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Opis</h2>
              <p className="text-default-600">{organisation.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organisation.location && (
              <div>
                <p className="text-sm font-semibold text-default-500">Lokacija</p>
                <p className="text-default-700">📍 {organisation.location}</p>
              </div>
            )}
            {organisation.phone && (
              <div>
                <p className="text-sm font-semibold text-default-500">Telefon</p>
                <p className="text-default-700">📞 {organisation.phone}</p>
              </div>
            )}
            {organisation.website && (
              <div>
                <p className="text-sm font-semibold text-default-500">Website</p>
                <a
                  href={organisation.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  🌐 {organisation.website}
                </a>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Događaji organizacije</h2>
        </CardHeader>
        <CardBody>
          <Button
            color="primary"
            variant="flat"
            onPress={() => navigate(`/events?org=${organisation.username}`)}
          >
            Pregledaj događaje
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrganisationDetail;

