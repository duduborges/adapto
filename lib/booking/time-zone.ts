const VANCOUVER = 'America/Vancouver';
// Etc zones count backwards: this one is UTC-7.
const FIXED_UTC_MINUS_7 = 'Etc/GMT+7';

let vancouverZone: string | undefined;

/**
 * The zone to hand to Intl for dates from now on. British Columbia moved to
 * permanent UTC-7 in 2026, but a browser or server with older time zone data
 * still applies UTC-8 in winter, which shows every time an hour early. Google
 * Calendar has the new rule, so a page on old data would disagree with the
 * invitation. A January date tells them apart.
 */
export function intlTimeZone(timeZone: string): string {
  if (timeZone !== VANCOUVER) return timeZone;
  if (vancouverZone === undefined) {
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(Date.UTC(2030, 0, 15))
      .find((part) => part.type === 'timeZoneName')?.value;
    vancouverZone = offset === 'GMT-8' ? FIXED_UTC_MINUS_7 : timeZone;
  }
  return vancouverZone;
}
