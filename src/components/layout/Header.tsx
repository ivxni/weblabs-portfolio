'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { navigation } from '@/content/site';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import styles from './Header.module.scss';

/**
 * `/projekte/unitfly` soll „Projekte" markieren, `/` aber nicht jeden Pfad.
 * Deshalb die Sonderbehandlung für die Wurzel — sonst wäre „Start" überall aktiv.
 */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Über der Hero-Leinwand ist die Leiste flächenlos; sobald sie über Text
  // liegt, bekommt sie einen Grund. Der Zustandswechsel passiert einmal pro
  // Scrollrichtung, nicht in jedem Bild: `useState` wird nur gesetzt, wenn
  // sich der Wert tatsächlich ändert.
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled((was) => {
        const now = window.scrollY > 24;
        return now === was ? was : now;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Beim Seitenwechsel schließen. Ohne das bliebe das Panel nach einem Klick
  // offen und verdeckte die Seite, auf der man gerade gelandet ist.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Escape schließt und gibt den Fokus zurück auf den auslösenden Knopf —
  // sonst landet der Fokus nach dem Schließen im Nichts am Seitenanfang.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <Container>
        <div className={styles.inner}>
          <Logo />

          <nav className={styles.desktopNav} aria-label="Hauptnavigation">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>

            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((open) => !open)}
            >
              <FontAwesomeIcon icon={isOpen ? faXmark : faBars} aria-hidden="true" />
              <span className="visually-hidden">{isOpen ? 'Menü schließen' : 'Menü öffnen'}</span>
            </button>
          </div>
        </div>
      </Container>

      {/*
        Immer im DOM, aber bei geschlossenem Zustand nicht gerendert: `hidden`
        allein würde die Links für Screenreader und Tab-Reihenfolge zwar
        entfernen, das Panel aber weiter im Layout halten. Bedingtes Rendern
        ist hier korrekt und billiger.
      */}
      {isOpen && (
        <div className={styles.panel} id="mobile-nav">
          <Container>
            <nav className={styles.panelInner} aria-label="Hauptnavigation, mobil">
              {navigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.panelLink} ${active ? styles.panelLinkActive : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
