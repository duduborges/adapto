export const site = {
  name: 'Adapto',
  fullName: 'Adapto Software House',
  shortName: 'Adapto · Software House',
  domain: 'adapto-sh.com',
  email: 'hello@adapto-sh.com',
  // TODO: replace with the real Google Calendar appointment URL once created.
  // When this still contains "REPLACE_ME" the bookingHref() helper falls back
  // to a pre-filled mailto so the CTA always works.
  bookingUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/REPLACE_ME',
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

/**
 * Returns the booking CTA href. Until the real Google Calendar appointment
 * schedule is provided, this falls back to a pre-filled mailto so the button
 * is never broken.
 */
export function bookingHref(): string {
  if (site.bookingUrl.includes('REPLACE_ME')) {
    const subject = encodeURIComponent('Book a conversation with Adapto');
    const body = encodeURIComponent(
      [
        'Hi Adapto team,',
        '',
        "I'd like to book a 30-minute call.",
        '',
        'A bit about us:',
        '- Company:',
        '- What we are trying to solve:',
        '- Best times for a call:',
        '',
        'Thanks,',
      ].join('\n'),
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }
  return site.bookingUrl;
}

/** Whether the booking CTA opens in a new tab (calendar) or stays in-page (mailto). */
export function bookingIsExternal(): boolean {
  return !site.bookingUrl.includes('REPLACE_ME');
}
