import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

/**
 * Font Awesome fügt sein CSS normalerweise zur Laufzeit per JavaScript ein.
 * In Next.js kommt das zu spät: Die Icons erscheinen dann für einen Moment in
 * voller Größe, bevor die Regeln greifen — ein deutlich sichtbarer Sprung im
 * Kopf der Seite. Deshalb wird das Automatische abgeschaltet und das
 * Stylesheet oben statisch importiert.
 */
config.autoAddCss = false;
