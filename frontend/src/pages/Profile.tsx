import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Textarea,
  Spinner,
  Avatar,
  Chip,
} from '@heroui/react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { organisationsService } from '../services/organisationsService';
import { uploadService } from '../services/uploadService';
import { UserUpdate } from '../types';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const isOrg = (user as any)?.role === 'organisation';

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
      setLoading(false);
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Molimo izaberite sliku');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Slika je prevelika (maksimalno 5MB)');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      if (isOrg) {
        await uploadService.uploadOrgLogo(file);
      } else {
        await uploadService.uploadUserImage(file);
      }
      setSuccess('Slika je uspešno uploadovana!');
      await refreshUser();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Greška pri uploadovanju slike');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setSaving(true);
      if (isOrg) {
        // Organizacije trenutno nemaju update endpoint, ali možemo dodati kasnije
        setError('Ažuriranje profila organizacije trenutno nije dostupno');
      } else {
        const updateData: UserUpdate = {
          username: formData.username,
          email: formData.email,
          title: formData.title,
          location: formData.location,
          age: formData.age,
          about: formData.about,
          skills: formData.skills,
          experience: formData.experience,
        };
        await userService.updateMe(updateData);
        setSuccess('Profil je uspešno ažuriran!');
        await refreshUser();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Greška pri ažuriranju profila');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">Učitavanje profila...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-default-500">Niste prijavljeni.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Moj profil</h1>
        <Button variant="flat" onPress={() => navigate('/dashboard')}>
          Nazad
        </Button>
      </div>

      {error && (
        <Card className="border-danger">
          <CardBody>
            <p className="text-danger text-center">{error}</p>
          </CardBody>
        </Card>
      )}

      {success && (
        <Card className="border-success">
          <CardBody>
            <p className="text-success text-center">{success}</p>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar
            src={isOrg ? (user as any).logo : (user as any).profile_image}
            name={isOrg ? (user as any).name : (user as any).username}
            size="lg"
            className="w-24 h-24 text-large"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {isOrg ? (user as any).name : `${(user as any).first_name} ${(user as any).last_name}`}
            </h2>
            <p className="text-default-500">@{(user as any).username}</p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="avatar-upload"
              disabled={uploading}
            />
            <label htmlFor="avatar-upload">
              <Button
                as="span"
                color="primary"
                variant="flat"
                size="sm"
                isLoading={uploading}
              >
                {uploading ? 'Uploadovanje...' : 'Promeni sliku'}
              </Button>
            </label>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            {isOrg ? (
              <>
                <Input
                  label="Naziv organizacije"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  isReadOnly
                  description="Naziv organizacije se ne može menjati"
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  isReadOnly
                />
                <Textarea
                  label="Opis"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  isReadOnly
                />
                <p className="text-sm text-default-500">
                  Ažuriranje profila organizacije trenutno nije dostupno.
                </p>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Ime"
                    value={formData.first_name || ''}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    isReadOnly
                  />
                  <Input
                    label="Prezime"
                    value={formData.last_name || ''}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    isReadOnly
                  />
                </div>
                <Input
                  label="Korisničko ime"
                  value={formData.username || ''}
                  onChange={(e) => handleChange('username', e.target.value)}
                  description="Mala slova, brojevi, donja crta i crtica"
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <Input
                  label="Titula"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Npr. student, diplomirani pravnik"
                />
                <Input
                  label="Lokacija"
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Npr. Niš, Beograd"
                />
                <Input
                  label="Godine"
                  type="number"
                  value={formData.age?.toString() || ''}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
                  min={16}
                />
                <Textarea
                  label="O meni"
                  value={formData.about || ''}
                  onChange={(e) => handleChange('about', e.target.value)}
                  maxLength={160}
                  minRows={3}
                  description={`${(formData.about || '').length}/160 karaktera`}
                />
                <Textarea
                  label="Iskustvo (opciono)"
                  value={formData.experience || ''}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  maxLength={300}
                  minRows={3}
                  description={`${(formData.experience || '').length}/300 karaktera`}
                />
                {formData.skills && formData.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Veštine</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill: string, idx: number) => (
                        <Chip key={idx} variant="flat" color="primary">
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardBody>
          {!isOrg && (
            <CardFooter>
              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={saving}
              >
                Sačuvaj izmene
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Profile;

