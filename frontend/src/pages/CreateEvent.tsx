import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
} from '@heroui/react';
import { eventsService } from '../services/eventsService';
import { EventIn, EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventIn>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    category: EventCategory.ostalo,
    max_volunteers: undefined,
    image: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!event.title || !event.description || !event.start_date || !event.end_date || !event.location) {
      setError('Molimo popunite sva obavezna polja');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await eventsService.createEvent(event);
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Greška pri kreiranju događaja');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !event.tags.includes(tagInput.trim())) {
      setEvent({ ...event, tags: [...event.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setEvent({ ...event, tags: event.tags.filter((t) => t !== tag) });
  };

  if (!user || (user as any).role !== 'organisation') {
    return (
      <Card>
        <CardBody>
          <p className="text-center text-default-500">
            Samo organizacije mogu kreirati događaje.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Kreiraj novi događaj</h1>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-4">
            {error && (
              <Card className="border-danger">
                <CardBody>
                  <p className="text-danger text-sm">{error}</p>
                </CardBody>
              </Card>
            )}

            <Input
              label="Naziv događaja"
              placeholder="Npr. Niš Business Run"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              isRequired
            />

            <Textarea
              label="Opis"
              placeholder="Detaljan opis događaja..."
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              minRows={5}
              isRequired
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Datum početka"
                type="datetime-local"
                value={event.start_date}
                onChange={(e) => setEvent({ ...event, start_date: e.target.value })}
                isRequired
              />
              <Input
                label="Datum završetka"
                type="datetime-local"
                value={event.end_date}
                onChange={(e) => setEvent({ ...event, end_date: e.target.value })}
                isRequired
              />
            </div>

            <Input
              label="Lokacija"
              placeholder="Npr. Niš, Trg kralja Milana"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              isRequired
            />

            <Select
              label="Kategorija"
              selectedKeys={[event.category]}
              onSelectionChange={(keys) =>
                setEvent({ ...event, category: Array.from(keys)[0] as EventCategory })
              }
              isRequired
            >
              {Object.values(EventCategory).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Maksimalno volontera (opciono)"
              type="number"
              value={event.max_volunteers?.toString() || ''}
              onChange={(e) =>
                setEvent({
                  ...event,
                  max_volunteers: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
            />

            <Input
              label="URL slike (opciono)"
              placeholder="https://..."
              value={event.image || ''}
              onChange={(e) => setEvent({ ...event, image: e.target.value })}
            />

            <div>
              <div className="flex gap-2 mb-2">
                <Input
                  label="Tagovi"
                  placeholder="Dodaj tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button onPress={addTag} className="mt-6">
                  Dodaj
                </Button>
              </div>
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Chip
                      key={tag}
                      onClose={() => removeTag(tag)}
                      variant="flat"
                      color="primary"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex gap-2">
            <Button variant="flat" onPress={() => navigate('/events')}>
              Otkaži
            </Button>
            <Button type="submit" color="primary" isLoading={loading}>
              Kreiraj događaj
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateEvent;

