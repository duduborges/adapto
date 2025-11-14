import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/types';

interface FooterProps {
  lang: Locale;
  dict: any;
}

export const Footer: React.FC<FooterProps> = ({ lang, dict }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: dict.footer.links.about, href: '#about' },
    { label: dict.footer.links.services, href: '#services' },
    { label: dict.footer.links.portfolio, href: '#portfolio' },
    { label: dict.footer.links.contact, href: '#contact' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Adapto</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              {dict.nav.home}
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              {dict.contact.info.title}
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">{dict.contact.info.location}</p>
              <p className="text-gray-400">
                <a href="mailto:eduardoborges.dev31@gmail.com" className="hover:text-white transition-colors">
                  eduardoborges.dev31@gmail.com
                </a>
              </p>
              <p className="text-gray-400">
                <a href="tel:+16727553873" className="hover:text-white transition-colors">
                  +1 (672) 755-3873
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Adapto. {dict.footer.rights}.
            </p>
            <div className="flex space-x-6">
              <Link
                href={`/${lang}/privacy`}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {dict.footer.links.privacy}
              </Link>
              <Link
                href={`/${lang}/terms`}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {dict.footer.links.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
