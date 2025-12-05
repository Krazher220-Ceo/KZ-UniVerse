// Типы для платформы KZ UniVerse

export type UniversityType = 'national' | 'state' | 'private';

export interface University {
  id: string;
  name: string;
  nameKz: string;
  shortName: string;
  type: UniversityType; // национальный, государственный, частный
  logo: string;
  cover: string;
  city: string;
  region: string;
  rating: number;
  worldRank?: number;
  founded: number;
  students: number;
  internationalStudents: number; // процент
  description: string;
  mission: string;
  achievements: string[];
  infrastructure: string[];
  website: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  tour3D?: string; // URL для 3D тура
  coordinates?: {
    lat: number;
    lng: number;
  };
  stats: UniversityStats;
  tuitionRange: {
    min: number;
    max: number;
  };
  dormitory: boolean;
  dormitoryCost?: number;
}

export interface UniversityStats {
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // секунды
  favorites: number;
  tour3DClicks: number;
  comparisonCount: number;
  applicationClicks: number;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  nameKz: string;
  nameRu: string;
  field: ProgramField;
  degree: Degree;
  duration: number; // годы
  language: Language[];
  tuitionPerYear: number;
  scholarship: boolean;
  grantAvailable: boolean;
  description: string;
  courses: string[];
  requirements: AdmissionRequirements;
  popularity: number; // 0-100
  employmentRate: number; // процент трудоустройства
  careerPaths: string[];
}

export type ProgramField = 
  | 'IT'
  | 'Engineering'
  | 'Business'
  | 'Medicine'
  | 'Law'
  | 'Education'
  | 'Arts'
  | 'Science'
  | 'Social Sciences'
  | 'Agriculture'
  | 'Other';

export type Degree = 'Bachelor' | 'Master' | 'PhD' | 'MBA';

export type Language = 'Казахский' | 'Русский' | 'English';

export interface AdmissionRequirements {
  minENT: number; // Единое Национальное Тестирование
  minIELTS?: number;
  minTOEFL?: number;
  requiredSubjects: string[];
  portfolio?: boolean;
  interview?: boolean;
  additionalExams?: string[];
}

export interface InternationalPartnership {
  id: string;
  universityId: string;
  partnerUniversity: string;
  country: string;
  type: PartnershipType;
  programs: string[];
  description: string;
}

export type PartnershipType = 
  | 'Обмен студентами'
  | 'Двойной диплом'
  | 'Совместные исследования'
  | 'Летние школы'
  | 'Стажировки';

export interface AdmissionInfo {
  universityId: string;
  deadlines: {
    fallSemester: string;
    springSemester?: string;
  };
  documents: string[];
  applicationFee: number;
  steps: string[];
  contacts: {
    admissionOffice: string;
    phone: string;
    email: string;
    workingHours: string;
  };
}

export interface AnalyticsEvent {
  id: string;
  userId: string; // анонимный ID
  sessionId: string;
  event: EventType;
  data: Record<string, any>;
  timestamp: Date;
  location?: {
    city: string;
    region: string;
  };
  device?: string;
  browser?: string;
}

export type EventType =
  | 'page_view'
  | 'university_view'
  | 'program_view'
  | 'compare_universities'
  | 'add_to_favorites'
  | 'remove_from_favorites'
  | 'start_3d_tour'
  | 'ai_chat_message'
  | 'filter_applied'
  | 'search_query'
  | 'admission_click'
  | 'application_started';

export interface ComparisonData {
  universities: University[];
  programs?: Program[];
  criteria: ComparisonCriteria[];
}

export type ComparisonCriteria =
  | 'tuition'
  | 'rating'
  | 'programs'
  | 'international'
  | 'infrastructure'
  | 'employment'
  | 'location'
  | 'dormitory';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserPreferences {
  field?: ProgramField;
  budget?: number;
  city?: string;
  language?: Language;
  international?: boolean;
  degree?: Degree;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
  portfolio: UserPortfolio;
  favorites: string[]; // university IDs
  comparisons: string[][]; // arrays of university IDs
}

export interface UserPortfolio {
  entScore?: number; // ЕНТ балл
  ieltsScore?: number;
  toeflScore?: number;
  gpa?: number; // средний балл аттестата
  achievements: string[];
  olympiads: {
    name: string;
    level: 'regional' | 'republican' | 'international';
    year: number;
    place?: number;
  }[];
  volunteerWork: {
    organization: string;
    duration: string;
    description: string;
  }[];
  workExperience: {
    company: string;
    position: string;
    duration: string;
  }[];
  languages: {
    language: string;
    level: 'basic' | 'intermediate' | 'advanced' | 'native';
  }[];
}

export interface AdmissionChance {
  universityId: string;
  programId: string;
  chance: number; // 0-100%
  factors: {
    entScore: number;
    gpa: number;
    achievements: number;
    competition: number;
  };
  recommendations: string[];
}

export interface SearchFilters {
  query?: string;
  city?: string;
  field?: ProgramField;
  universityType?: UniversityType;
  minRating?: number;
  maxTuition?: number;
  language?: Language;
  hasGrant?: boolean;
  hasDormitory?: boolean;
  hasInternational?: boolean;
  sortBy?: 'rating' | 'tuition-asc' | 'tuition-desc' | 'popularity' | 'name';
}

