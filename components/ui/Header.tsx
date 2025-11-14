'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';
import { i18n, languages } from '@/lib/i18n/config';

interface HeaderProps {
  lang: Locale;
  dict: any;
}

export const Header: React.FC<HeaderProps> = ({ lang, dict }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (newLang: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLang;
    return segments.join('/');
  };

  const navItems = [
    { label: dict.nav.about, href: '#about' },
    { label: dict.nav.services, href: '#services' },
    { label: dict.nav.portfolio, href: '#portfolio' },
    { label: dict.nav.contact, href: '#contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="text-2xl font-bold text-black hover:opacity-80 transition-opacity"
          >
            Adapto
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 border-l border-gray-300 pl-6">
              {i18n.locales.map((locale) => (
                <Link
                  key={locale}
                  href={switchLanguage(locale)}
                  className={cn(
                    'text-sm font-medium px-2 py-1 rounded transition-all',
                    locale === lang
                      ? 'text-black bg-gray-100'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  )}
                >
                  {locale.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile Language Switcher */}
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                {i18n.locales.map((locale) => (
                  <Link
                    key={locale}
                    href={switchLanguage(locale)}
                    className={cn(
                      'text-sm font-medium px-3 py-1.5 rounded transition-all',
                      locale === lang
                        ? 'text-black bg-gray-100'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    )}
                  >
                    {languages[locale]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
