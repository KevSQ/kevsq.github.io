interface BaseProject {
  name: string;
  href: string;
  role: string;
  blurb: string;
  pills: string[];
  stack: string;
}

export interface AtWorkProject extends BaseProject {
  kind: 'work';
}

export interface SideProject extends BaseProject {
  kind: 'side';
  stars?: string;
}

export type Project = AtWorkProject | SideProject;

export interface ArchivedProject {
  label: string;
  href: string;
}

export interface SidebarStats {
  tools: string[];
  commits: number;
  repoCount: number;
  githubUrl: string;
}

export const atWork: AtWorkProject[] = [
  {
    kind: 'work',
    name: 'Lattice Storage',
    href: '#',
    role: 'staff eng · 2023–now',
    blurb: 'Distributed object store backing internal analytics pipelines. Designed the replication protocol, led the migration from a third-party blob store, and cut storage costs by ~40%.',
    pills: ['scale', 'consensus'],
    stack: 'go · raft · postgres · kafka',
  },
  {
    kind: 'work',
    name: 'Quicksilver Queue',
    href: '#',
    role: 'senior eng · 2021–23',
    blurb: 'Internal job queue with strict ordering guarantees for financial transactions. Replaced a brittle cron-based system; zero missed jobs in 18 months of production.',
    pills: ['queues', 'migration'],
    stack: 'rust · redis · postgres',
  },
];

export const sideProjects: SideProject[] = [
  {
    kind: 'side',
    name: 'sift',
    href: 'https://github.com/kevsq/sift',
    role: 'solo · 2024',
    blurb: "A tiny log-search CLI that understands structured JSON logs without a schema. Pipe it anything; it figures out the shape and lets you query in plain English.",
    pills: ['cli', 'small'],
    stack: 'go',
    stars: '1.4k ★',
  },
  {
    kind: 'side',
    name: 'tinyq',
    href: 'https://github.com/kevsq/tinyq',
    role: 'solo · 2023',
    blurb: "Embedded job queue for SQLite. No separate process, no network, no infra. Drop a Go package in and you have reliable background jobs in under five minutes.",
    pills: ['embedded'],
    stack: 'go · sqlite',
    stars: '612 ★',
  },
  {
    kind: 'side',
    name: 'bookmark.land',
    href: 'https://github.com/kevsq/bookmark.land',
    role: 'solo · ongoing',
    blurb: 'A link garden — personal bookmarking tool that keeps URLs alive with snapshots and lets me tag and search them locally. Slow web philosophy.',
    pills: ['slow web'],
    stack: 'elixir · litefs',
  },
];

export const archive: ArchivedProject[] = [
  { label: '2020 · Hearth Notify', href: '#' },
  { label: '2019 · plot.sh',       href: '#' },
  { label: '2018 · meridian',      href: '#' },
  { label: '2017 · paper-trail',   href: '#' },
];

export const sidebarStats: SidebarStats = {
  tools: ['go · rust · ts', 'postgres · redis', 'linux · vim · tmux'],
  commits: 1284,
  repoCount: 9,
  githubUrl: 'https://github.com/kevsq',
};
