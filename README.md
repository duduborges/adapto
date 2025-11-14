# Adapto - Multilingual Landing Page

A modern, responsive landing page for Adapto - a software house specializing in custom development and automation solutions.

## Features

- 🌍 **Multilingual Support** - Available in English, Portuguese, and Spanish
- ⚡ **Next.js 15** - Built with the latest Next.js App Router
- 🎨 **Tailwind CSS** - Modern, utility-first CSS framework
- 🎭 **Framer Motion** - Smooth animations and transitions
- 📱 **Fully Responsive** - Optimized for all device sizes
- 🔍 **SEO Optimized** - Meta tags, structured data, and semantic HTML
- 📧 **Contact Form** - Integrated contact form with validation
- 🎯 **TypeScript** - Type-safe development

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/adapta
├── app/                    # Next.js app directory
│   ├── [lang]/            # Internationalized routes
│   │   ├── layout.tsx     # Language-specific layout
│   │   └── page.tsx       # Main landing page
│   ├── api/               # API routes
│   │   └── contact/       # Contact form API
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Differentials.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Process.tsx
│   │   └── Contact.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Section.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                   # Utilities and configurations
│   ├── i18n/              # Internationalization
│   │   ├── config.ts
│   │   ├── get-dictionary.ts
│   │   └── locales/       # Translation files
│   │       ├── en.json
│   │       ├── pt.json
│   │       └── es.json
│   └── utils/             # Helper functions
├── types/                 # TypeScript types
└── public/                # Static assets

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Internationalization

The site supports three languages:
- English (`/en`)
- Portuguese (`/pt`)
- Spanish (`/es`)

Translations are stored in JSON files under `lib/i18n/locales/`.

## Contact Form

The contact form sends data to `/api/contact`. Currently, it logs submissions to the console. To enable email notifications:

1. Choose an email service (SendGrid, Resend, etc.)
2. Install the appropriate package
3. Update `app/api/contact/route.ts` with your email logic

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy!

Alternatively, you can deploy to any platform that supports Next.js.

## Customization

### Colors and Branding

- Update Tailwind colors in `tailwind.config.ts`
- Modify global styles in `app/globals.css`

### Content

- Edit translations in `lib/i18n/locales/*.json`
- Modify component content in respective files

### SEO

- Update metadata in `app/[lang]/layout.tsx`
- Add Open Graph images to `/public`

## Technologies Used

- [Next.js 15](https://nextjs.org/)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)

## Company Information

**Adapto** - Custom Software Solutions
- Location: Vancouver, BC, Canada
- Email: eduardoborges.dev31@gmail.com
- Phone: +1 (672) 755-3873

## License

© 2025 Adapto. All rights reserved.
