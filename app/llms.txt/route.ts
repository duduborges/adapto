import { getDictionary } from '@/lib/i18n/get-dictionary';
import { SERVICES } from '@/lib/services';
import { site, siteUrl } from '@/lib/site';

/**
 * /llms.txt (llmstxt.org): a Markdown map of the site for AI agents. Built
 * from the English dictionary and the services list, so it follows the copy.
 * Lighthouse's agent audit needs an H1 and links; before this the path fell
 * through to an HTML page.
 */
export const dynamic = 'force-static';

export async function GET() {
  const dict = await getDictionary('en');
  const en = `${siteUrl}/en`;
  const fr = `${siteUrl}/fr`;

  const services = SERVICES.map(({ slug, key }) => {
    const item = dict.services.items[key];
    return `- [${item.title}](${en}/services/${slug}): ${item.description}`;
  });

  const body = [
    `# ${site.fullName}`,
    '',
    `> ${dict.hero.title} ${dict.hero.titleAccent} ${dict.hero.subtitle}`,
    '',
    `Based in ${site.location.city}, ${site.location.region}, ${site.location.country}. ${dict.hero.remote}. The site is in English (/en) and French (/fr).`,
    '',
    '## Services',
    '',
    ...services,
    '',
    '## Pages',
    '',
    `- [Home](${en}): services, process, work and contact`,
    `- [FAQ](${en}/faq): ${dict.faq.title}`,
    `- [Home in French](${fr}): the same site in French`,
    '',
    '## Contact',
    '',
    `- [${dict.hero.cta}](${site.bookingUrl})`,
    `- [Email](mailto:${site.email})`,
    '',
    '## Optional',
    '',
    `- [Privacy policy](${en}/privacy)`,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
