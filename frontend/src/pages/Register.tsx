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
  Chip,
} from '@heroui/react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    title: '',
    location: '',
    age: '',
    about: '',
    skills: [] as string[],
    experience: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (formData.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    if (!formData.first_name || !formData.last_name || !formData.title || !formData.location || !formData.age || !formData.about) {
      setError('Molimo popunite sva obavezna polja');
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 16) {
      setError('Morate biti stariji od 16 godina');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        title: formData.title,
        location: formData.location,
        age: age,
        about: formData.about,
        skills: formData.skills,
        experience: formData.experience || undefined,
      });
      // Backend vraća UserPublic model
      // Uspešna registracija - redirect na login
      navigate('/login', { state: { message: 'Registracija uspešna! Sada se možete prijaviti.' } });
    } catch (err: any) {
      setError(err.message || 'Greška pri registraciji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Registruj se</h1>
          <p className="text-sm text-default-500">
            Kreirajte novi nalog
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
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              isRequired
              autoComplete="email"
            />
            <Input
              label="Korisničko ime"
              placeholder="korisnicko_ime"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              isRequired
              autoComplete="username"
              description="Mala slova, brojevi, donja crta i crtica"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ime"
                placeholder="Ime"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                isRequired
              />
              <Input
                label="Prezime"
                placeholder="Prezime"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                isRequired
              />
            </div>
            <Input
              label="Lozinka"
              placeholder="Unesite lozinku"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              isRequired
              autoComplete="new-password"
            />
            <Input
              label="Potvrdi lozinku"
              placeholder="Ponovite lozinku"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              isRequired
              autoComplete="new-password"
            />
            <Input
              label="Titula"
              placeholder="Npr. student, diplomirani pravnik, učenik"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              isRequired
            />
            <Input
              label="Lokacija"
              placeholder="Npr. Niš, Beograd"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              isRequired
            />
            <Input
              label="Godine"
              type="number"
              placeholder="16+"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              isRequired
              min={16}
            />
            <Textarea
              label="O meni"
              placeholder="Kratak opis (maksimalno 160 karaktera)"
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
              isRequired
              maxLength={160}
              minRows={3}
            />
            <div>
              <p className="text-sm font-medium mb-2">Veštine</p>
              <div
                className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-default-200 rounded-lg bg-default-100 focus-within:border-primary focus-within:bg-background transition-colors"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input) input.focus();
                }}
              >
                {formData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    onClose={() => {
                      handleChange(
                        'skills',
                        formData.skills.filter((s) => s !== skill)
                      );
                    }}
                    variant="flat"
                    color="primary"
                    size="sm"
                  >
                    {skill}
                  </Chip>
                ))}
                <input
                  type="text"
                  placeholder={formData.skills.length === 0 ? "Dodaj veštinu..." : ""}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
                        handleChange('skills', [...formData.skills, skillInput.trim()]);
                        setSkillInput('');
                      }
                    }
                  }}
                  onBlur={() => {
                    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
                      handleChange('skills', [...formData.skills, skillInput.trim()]);
                      setSkillInput('');
                    }
                  }}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
                />
              </div>
            </div>
            <Textarea
              label="Iskustvo (opciono)"
              placeholder="Opis iskustva (maksimalno 300 karaktera)"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              maxLength={300}
              minRows={3}
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
              Registruj se
            </Button>
            <p className="text-sm text-center text-default-500">
              Već imate nalog?{' '}
              <Link to="/login" className="text-primary">
                Prijavi se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;

