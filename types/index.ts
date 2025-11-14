export type Locale = 'en' | 'pt' | 'es';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [locale: string]: Translation;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  tags: string[];
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
}
