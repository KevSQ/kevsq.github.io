export interface RoleItem {
  title: string;
  company: string;
  when: string;
  bullets: string[];
}

export interface Skill {
  key: string;
  val: string;
}

export const RESUME_LAST_REVISED = 'may 1, 2026';

export const experience: RoleItem[] = [
  {
    title: 'Staff Engineer',
    company: 'Lattice Inc.',
    when: '2023–present',
    bullets: [
      'Designed and shipped the distributed object store backing internal analytics — handles ~2 TB/day ingest with sub-200ms p99 reads.',
      'Led a 14-month migration away from a third-party blob store, reducing storage costs by ~40% and eliminating a critical external dependency.',
      'Mentored three engineers to senior level; established the on-call rotation and playbook for the storage org.',
    ],
  },
  {
    title: 'Senior Engineer',
    company: 'Quicksilver Labs',
    when: '2021–2023',
    bullets: [
      'Built a high-throughput job queue in Rust with strict FIFO ordering guarantees for financial transaction processing.',
      'Replaced a brittle cron-based scheduling system; zero missed jobs across 18 months of production at 50k jobs/day.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Hearth',
    when: '2018–2021',
    bullets: [
      'Core contributor to the notification delivery platform — owned the pipeline from event ingestion to multi-channel fan-out.',
      'Migrated the primary data store from MongoDB to Postgres without downtime; reduced query latency by 3×.',
    ],
  },
];

export const skills: Skill[] = [
  { key: 'lang',  val: 'Go · Rust · TypeScript · some Elixir' },
  { key: 'data',  val: 'Postgres · Redis · Kafka · SQLite' },
  { key: 'ops',   val: 'Linux · Docker · Nomad · Cloudflare' },
  { key: 'style', val: 'distributed systems · API design · boring tech' },
];
