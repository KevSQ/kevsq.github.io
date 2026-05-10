export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/',          label: '/home' },
  { href: '/writing',   label: '/writing' },
  { href: '/about',     label: '/about' },
  { href: '/work',      label: '/work' },
  { href: '/resume',    label: '/resume' },
  { href: '/reading',   label: '/reading' },
  { href: '/guestbook', label: '/guestbook' },
  { href: '/contact',   label: '/contact' },
];
