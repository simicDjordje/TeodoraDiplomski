import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
} from '@heroui/react';
import { organisationsService } from '../services/organisationsService';
import { OrganisationIn, OrganisationType } from '../types';

const RegisterOrg = () => {
  const [formData, setFormData] = useState<OrganisationIn>({
    username: '',
    name: '',
    email: '',
    password: '',
    description: '',
    location: '',
    phone: '',
    website: '',
    org_type: OrganisationType.official,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof OrganisationIn, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (formData.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (!formData.username || !formData.name || !formData.email || !formData.description || !formData.location) {
      setError('Molimo popunite sva obavezna polja');
      return;
    }

    setLoading(true);

    try {
      const response = await organisationsService.registerOrganisation(formData);
      // Backend vraća: {"message": "...", "id": org_id}
      // Uspešna registracija - redirect na login sa porukom
      navigate('/org/login', { 
        state: { 
          message: response.message || 'Organizacija je uspešno registrovana! Čeka odobrenje administratora.' 
        } 
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Greška pri registraciji organizacije');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Registracija organizacije</h1>
          <p className="text-sm text-default-500">
            Kreirajte nalog za vašu organizaciju
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
              label="Korisničko ime"
              placeholder="korisnicko_ime"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              isRequired
              description="Mala slova, brojevi, donja crta i crtica"
            />
            <Input
              label="Naziv organizacije"
              placeholder="Naziv organizacije"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              isRequired
            />

            <Input
              label="Email"
              placeholder="organizacija@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              isRequired
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Lozinka"
                placeholder="Unesite lozinku"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                isRequired
              />
              <Input
                label="Potvrdi lozinku"
                placeholder="Ponovite lozinku"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isRequired
              />
            </div>

            <Textarea
              label="Opis organizacije"
              placeholder="Kratak opis vaše organizacije..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              minRows={4}
              isRequired
              maxLength={300}
            />

            <Input
              label="Lokacija"
              placeholder="Npr. Niš, Beograd"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              isRequired
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Telefon (opciono)"
                placeholder="+381..."
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <Input
                label="Website (opciono)"
                placeholder="https://..."
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>

            <Select
              label="Tip organizacije"
              selectedKeys={[formData.org_type]}
              onSelectionChange={(keys) =>
                handleChange('org_type', Array.from(keys)[0] as OrganisationType)
              }
            >
              <SelectItem key={OrganisationType.official} value={OrganisationType.official}>
                Zvanična
              </SelectItem>
              <SelectItem key={OrganisationType.informal} value={OrganisationType.informal}>
                Nezvanična
              </SelectItem>
            </Select>
          </CardBody>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              color="primary"
              variant="solid"
              className="w-full text-white"
              isLoading={loading}
            >
              Registruj organizaciju
            </Button>
            <p className="text-sm text-center text-default-500">
              Već imate nalog?{' '}
              <Link to="/org/login" className="text-primary">
                Prijavi se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterOrg;

