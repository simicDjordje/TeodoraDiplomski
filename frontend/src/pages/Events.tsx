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
  Select,
  SelectItem,
} from '@heroui/react';
import { eventsService } from '../services/eventsService';
import { EventPublic, EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState<EventPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<EventPublic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory, selectedLocation]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getUpcomingEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err: any) {
      console.error('Error loading events:', err);
      setError(err.response?.data?.detail || 'Greška pri učitavanju događaja');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter((event) => event.location === selectedLocation);
    }

    setFilteredEvents(filtered);
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

  const getCategoryColor = (category: EventCategory) => {
    const colors: Record<EventCategory, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
      [EventCategory.sportski]: 'primary',
      [EventCategory.kulturni]: 'secondary',
      [EventCategory.biznis]: 'default',
      [EventCategory.ekoloski]: 'success',
      [EventCategory.festival]: 'warning',
      [EventCategory.koncert]: 'danger',
      [EventCategory.edukacija]: 'primary',
      [EventCategory.humanitarni]: 'success',
      [EventCategory.zajednica]: 'default',
      [EventCategory.ostalo]: 'default',
    };
    return colors[category] || 'default';
  };

  const uniqueLocations = Array.from(new Set(events.map((e) => e.location)));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-default-500">Učitavanje događaja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Događaji</h1>
        {isAuthenticated && (user as any)?.role === 'organisation' && (
          <Button color="primary" onPress={() => navigate('/events/create')}>
            Kreiraj događaj
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Pretraži"
          placeholder="Pretraži događaje..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<span>🔍</span>}
        />
        <Select
          label="Kategorija"
          selectedKeys={[selectedCategory]}
          onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
        >
          <SelectItem key="all" value="all">
            Sve kategorije
          </SelectItem>
          {Object.values(EventCategory).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Lokacija"
          selectedKeys={[selectedLocation]}
          onSelectionChange={(keys) => setSelectedLocation(Array.from(keys)[0] as string)}
        >
          <SelectItem key="all" value="all">
            Sve lokacije
          </SelectItem>
          {uniqueLocations.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </Select>
      </div>

      {error ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-6xl">⚠️</div>
            <p className="text-lg font-semibold text-danger">{error}</p>
            <Button
              color="primary"
              variant="flat"
              onPress={loadEvents}
            >
              Pokušaj ponovo
            </Button>
          </CardBody>
        </Card>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-center text-default-500 text-lg">
              {searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all'
                ? 'Nema događaja koji odgovaraju vašoj pretrazi.'
                : 'Nema dostupnih događaja.'}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const eventId = (event as any).id || (event as any)._id || event.title;
            return (
            <Card key={eventId} isPressable onPress={() => navigate(`/events/${eventId}`)}>
              {event.image && (
                <CardHeader className="p-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
              )}
              <CardBody>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <Chip color={getCategoryColor(event.category)} size="sm" variant="flat">
                    {event.category}
                  </Chip>
                </div>
                <p className="text-sm text-default-500 line-clamp-2">{event.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-default-400">
                    📅 {formatDate(event.start_date)} - {formatDate(event.end_date)}
                  </p>
                  <p className="text-xs text-default-400">📍 {event.location}</p>
                  {event.organisation_name && (
                    <p className="text-xs text-default-400">🏢 {event.organisation_name}</p>
                  )}
                  {event.max_volunteers && (
                    <p className="text-xs text-default-400">
                      👥 Maksimalno {event.max_volunteers} volontera
                    </p>
                  )}
                </div>
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.slice(0, 3).map((tag, idx) => (
                      <Chip key={idx} size="sm" variant="flat">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </CardBody>
              <CardFooter>
                <Button
                  color="primary"
                  variant="flat"
                  className="w-full"
                  onPress={() => navigate(`/events/${eventId}`)}
                >
                  Detalji
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;

