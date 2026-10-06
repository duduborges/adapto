/**
 * A JSON-LD block. Values must be authored content (dictionaries, service
 * copy), never user input: the string goes into the page unescaped. `<` is
 * escaped anyway so no value can close the script tag early.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
