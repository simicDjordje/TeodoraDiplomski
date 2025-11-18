import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Spinner,
  Input,
  Avatar,
} from '@heroui/react';
import { organisationsService } from '../services/organisationsService';
import { OrganisationPublic, OrganisationStatus } from '../types';

const Organisations = () => {
  const [organisations, setOrganisations] = useState<OrganisationPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganisations();
  }, []);

  const loadOrganisations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organisationsService.getAllOrganisations();
      // Prikaži samo odobrene organizacije
      const approved = data.filter((org) => org.status === OrganisationStatus.approved);
      setOrganisations(approved);
    } catch (err: any) {
      console.error('Error loading organisations:', err);
      setError(err.response?.data?.detail || 'Greška pri učitavanju organizacija');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = organisations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">Učitavanje organizacija...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Organizacije</h1>
        <Button color="primary" variant="flat" onPress={() => navigate('/org/register')}>
          Registruj organizaciju
        </Button>
      </div>

      <Input
        label="Pretraži"
        placeholder="Pretraži organizacije..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
        startContent={<span>🔍</span>}
      />

      {error ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-6xl">⚠️</div>
            <p className="text-lg font-semibold text-danger">{error}</p>
            <Button
              color="primary"
              variant="flat"
              onPress={loadOrganisations}
            >
              Pokušaj ponovo
            </Button>
          </CardBody>
        </Card>
      ) : filteredOrgs.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-center text-default-500 text-lg">
              {searchTerm ? 'Nema organizacija koje odgovaraju pretrazi.' : 'Nema dostupnih organizacija.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <Card
              key={org.username}
              isPressable
              onPress={() => navigate(`/organisations/${org.username}`)}
            >
              <CardHeader className="flex gap-3">
                <Avatar
                  src={org.logo}
                  name={org.name}
                  size="lg"
                  className="flex-shrink-0"
                />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{org.name}</p>
                  <p className="text-sm text-default-500">@{org.username}</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600 line-clamp-3">
                  {org.description || 'Nema opisa'}
                </p>
                {org.location && (
                  <p className="text-xs text-default-400 mt-2">📍 {org.location}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Chip size="sm" variant="flat" color={org.org_type === 'official' ? 'primary' : 'secondary'}>
                    {org.org_type === 'official' ? 'Zvanična' : 'Nezvanična'}
                  </Chip>
                  {org.website && (
                    <Chip size="sm" variant="flat">
                      🌐 Website
                    </Chip>
                  )}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  variant="flat"
                  className="w-full"
                  onPress={() => navigate(`/organisations/${org.username}`)}
                >
                  Detalji
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Organisations;

