export type Locale = 'en' | 'pt' | 'fr';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [locale: string]: Translation;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  tags?: string[];
  year?: string;
}
