import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
  pngSrc?: string; // NEW: allow PNG logo
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  pngSrc,
  ...other
}: LogoProps) {
  // --- Your original SVGs ---
  const singleLogo = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="currentColor" />
      <path
        fill="#fff"
        d="M328.48 200.32c-7.12 0-12.8-5.76-12.8-12.8s5.76-12.8 12.8-12.8
           12.8 5.76 12.8 12.8-5.76 12.8-12.8 12.8Zm-144.16 0c-7.04 
           0-12.8-5.76-12.8-12.8s5.76-12.8 12.8-12.8c7.12 0 
           12.8 5.76 12.8 12.8s-5.68 12.8-12.8 12.8Zm76.08 119.52c29.36 
           0 53.36-20.48 58.96-48h27.12c-6.16 42.64-42.88 
           75.36-86.08 75.36s-79.84-32.72-86.08-75.36h27.12c5.52 
           27.52 29.52 48 58.96 48Z"
      />
    </svg>
  );

  const fullLogo = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1024 256">
      <circle cx="128" cy="128" r="128" fill="currentColor" />
      <path
        fill="#fff"
        d="M164.24 100.16c-3.56 0-6.4-2.88-6.4-6.4s2.88-6.4 6.4-6.4
           6.4 2.88 6.4 6.4-2.88 6.4-6.4 6.4Zm-72.08 
           0c-3.52 0-6.4-2.88-6.4-6.4s2.88-6.4 6.4-6.4c3.56 
           0 6.4 2.88 6.4 6.4s-2.84 6.4-6.4 6.4Zm38.04 
           59.76c14.68 0 26.68-10.24 29.48-24h13.56c-3.08 
           21.32-21.44 37.68-43.04 37.68-21.64 
           0-39.92-16.36-43.04-37.68h13.56c2.76 13.76 
           14.76 24 29.48 24Z"
      />
      <text
        x="256"
        y="160"
        fill="currentColor"
        fontSize="120"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        Skillmate
      </text>
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 250,
          height: 150,
          ...(!isSingle && { width: 102, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {pngSrc ? (
        <img
          src={pngSrc}
          alt="Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        isSingle ? singleLogo : fullLogo
      )}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
