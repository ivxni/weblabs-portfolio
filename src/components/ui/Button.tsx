import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './Button.module.scss';

type Variant = 'primary' | 'secondary' | 'quiet';

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  /** Nur setzen, wenn das Icon etwas trägt — Richtung, Ziel, Aktion. */
  icon?: IconDefinition;
  iconPosition?: 'start' | 'end';
  full?: boolean;
  className?: string;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  /** Öffnet in neuem Tab und ergänzt den Hinweis für Screenreader. */
  external?: boolean;
}

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps>;

function composeClasses(
  variant: Variant,
  full: boolean | undefined,
  className: string | undefined,
): string {
  return [styles.base, styles[variant], full && styles.full, className]
    .filter(Boolean)
    .join(' ');
}

function Content({
  children,
  icon,
  iconPosition,
}: Pick<CommonProps, 'children' | 'icon' | 'iconPosition'>) {
  const glyph = icon ? (
    <FontAwesomeIcon icon={icon} className={styles.icon} aria-hidden="true" />
  ) : null;

  return (
    <>
      {iconPosition === 'start' && glyph}
      <span>{children}</span>
      {iconPosition !== 'start' && glyph}
    </>
  );
}

/** Interner oder externer Link, der wie ein Knopf aussieht. */
export function LinkButton({
  href,
  external = false,
  variant = 'secondary',
  icon,
  iconPosition = 'end',
  full,
  className,
  children,
}: LinkButtonProps) {
  const classes = composeClasses(variant, full, className);
  const content = <Content icon={icon} iconPosition={iconPosition}>{children}</Content>;

  if (external) {
    return (
      // `noopener` ist bei `_blank` Pflicht: Ohne ihn bekommt die Zielseite
      // über `window.opener` Zugriff auf diesen Tab.
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** Echter Knopf — nur für Aktionen, nie für Navigation. */
export function Button({
  variant = 'secondary',
  icon,
  iconPosition = 'end',
  full,
  className,
  children,
  type = 'button',
  ...rest
}: NativeButtonProps) {
  return (
    <button type={type} className={composeClasses(variant, full, className)} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>{children}</Content>
    </button>
  );
}
