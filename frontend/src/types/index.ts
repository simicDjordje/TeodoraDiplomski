// User Types
export enum Role {
  user = "user",
  admin = "admin",
}

export interface UserIn {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  title: string;
  location: string;
  age: number;
  about: string;
  skills: string[];
  experience?: string;
}

export interface UserPublic {
  username: string;
  title?: string;
  location?: string;
  age?: number;
  about?: string;
  skills: string[];
  experience?: string;
  profile_image?: string;
}

export interface UserDB extends UserIn {
  id: string;
  role: Role;
  created_at: string;
  updated_at?: string;
  profile_image?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  title?: string;
  location?: string;
  age?: number;
  about?: string;
  skills?: string[];
  experience?: string;
}

// Organisation Types
export enum OrganisationStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}

export enum OrganisationType {
  official = "official",
  informal = "informal",
}

export interface OrganisationIn {
  username: string;
  name: string;
  email: string;
  password: string;
  description: string;
  location: string;
  phone?: string;
  website?: string;
  org_type: OrganisationType;
}

export interface OrganisationPublic {
  username: string;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  website?: string;
  status: OrganisationStatus;
  logo?: string;
  org_type: OrganisationType;
}

// Event Types
export enum EventCategory {
  sportski = "sports",
  kulturni = "cultural",
  biznis = "business",
  ekoloski = "eco",
  festival = "festival",
  koncert = "concert",
  edukacija = "education",
  humanitarni = "charity",
  zajednica = "community",
  ostalo = "other",
}

export interface EventIn {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: EventCategory;
  max_volunteers?: number;
  image?: string;
  tags: string[];
}

export interface EventPublic {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: EventCategory;
  max_volunteers?: number;
  image?: string;
  tags: string[];
  organisation_name?: string;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  category?: EventCategory;
  max_volunteers?: number;
  image?: string;
  tags?: string[];
}

// Application Types
export enum ApplicationStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
  cancelled = "cancelled",
}

export interface ApplicationIn {
  event_id: string;
  motivation: string;
  phone: string;
  extra_notes?: string;
}

export interface ApplicationPublic {
  id?: string;
  event_title: string;
  user_info: {
    name?: string;
    email?: string;
    username?: string;
    [key: string]: any;
  };
  organisation_name: string;
  motivation: string;
  phone: string;
  extra_notes?: string;
  status: ApplicationStatus;
  created_at: string;
}

export enum OrgDecision {
  accepted = "accepted",
  rejected = "rejected",
}

export interface ApplicationUpdate {
  status?: OrgDecision;
  extra_notes?: string;
}

// Review Types
export interface ReviewUserToOrgIn {
  rating: number;
  comment: string;
}

export interface ReviewOrgToUserIn {
  rating: number;
  comment: string;
}

// Notification Types
export interface NotificationDB {
  id: string;
  organisation_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

