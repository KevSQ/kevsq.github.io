export interface Channel {
  key: string;
  val: string;
  href: string;
  note: string;
}

export const channels: Channel[] = [
  {
    key: 'email',
    val: 'kevinxmedina@gmail.com',
    href: 'mailto:kevinxmedina@gmail.com',
    note: 'best for anything that needs more than a sentence',
  },
  {
    key: 'github',
    val: 'github.com/kevsq',
    href: 'https://github.com/kevsq',
    note: 'issues & PRs · open source',
  },
  {
    key: 'guestbook',
    val: '/guestbook',
    href: '/guestbook',
    note: 'a public note · 280 chars',
  },
  {
    key: 'rss',
    val: '/feed.xml',
    href: '/feed.xml',
    note: 'to listen, not to talk',
  },
];
