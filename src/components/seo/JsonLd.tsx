interface JsonLdProps {
  data: Record<string, unknown> | readonly Record<string, unknown>[];
}

/** Serverseitiges JSON-LD; `<` wird neutralisiert, damit Inhalt nie ein Script schließt. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
