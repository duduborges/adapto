export const site = {
  name: 'Adapto',
  fullName: 'Adapto Software House',
  shortName: 'Adapto · Software House',
  domain: 'adapto-sh.com',
  email: 'hello@adapto-sh.com',
  bookingUrl: 'https://calendar.app.google/kzHtcffwJgX8JQVG7',
  location: {
    city: 'Vancouver',
    region: 'British Columbia',
    country: 'Canada',
  },
  social: {
    linkedin: '',
    instagram: '',
    github: '',
  },
} as const;

/** Returns the booking CTA href. */
export function bookingHref(): string {
  return site.bookingUrl;
}

/** Whether the booking CTA opens in a new tab. Always true for the calendar URL. */
export function bookingIsExternal(): boolean {
  return true;
}
