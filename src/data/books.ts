export type CoverVariant = 'brass' | 'moss' | 'terra' | 'sky' | 'ink';
export type NightstandStatus =
  | '📖 in progress'
  | '🔁 re-reading'
  | '🌱 learning'
  | '⏸ paused';

interface BaseBook {
  title: string;
  author: string;
  cover: CoverVariant;
  image?: string;
  note?: string;
}

export interface NightstandBook extends BaseBook {
  section: 'nightstand';
  status: NightstandStatus;
}

export interface FinishedBook extends BaseBook {
  section: 'finished';
  finishedMonth: string;
  stars?: string;
}

export type Book = NightstandBook | FinishedBook;

// Manual count — recentlyFinished is a curated sample, not exhaustive
export const booksReadThisYear = 4;

export const nightstand: NightstandBook[] = [
  {
    section: 'nightstand',
    title: 'Doing Science & Engineering',
    author: 'Richard Hamming',
    cover: 'brass',
    note: "A collection of Hamming's lectures on how to do great work. Surprisingly practical.",
    status: '📖 in progress',
  },
  {
    section: 'nightstand',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    cover: 'moss',
    image: '/ddia.webp',
    note: 'Re-reading for the third time. Different things jump out every time.',
    status: '🔁 re-reading',
  },
  {
    section: 'nightstand',
    title: 'Real World OCaml',
    author: 'Minsky, Madhavapeddy & Hickey',
    cover: 'ink',
    status: '🌱 learning',
  },
];

export const recentlyFinished: FinishedBook[] = [
  {
    section: 'finished',
    title: 'A Philosophy of Software Design',
    author: 'John Ousterhout',
    cover: 'terra',
    note: 'Short, opinionated, and correct about most things. Should be required reading.',
    finishedMonth: "apr '26",
    stars: '★ ★ ★ ★ ★',
  },
  {
    section: 'finished',
    title: 'The Soul of a New Machine',
    author: 'Tracy Kidder',
    cover: 'sky',
    note: 'Reads like a thriller. The minicomputer era was something else.',
    finishedMonth: "mar '26",
    stars: '★ ★ ★ ★ ☆',
  },
  {
    section: 'finished',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    cover: 'ink',
    finishedMonth: "feb '26",
    stars: '★ ★ ★ ★ ★',
  },
];

export const queue: string[] = [
  'Operating Systems: Three Easy Pieces',
  'The Pragmatic Programmer',
  'Structure and Interpretation of Computer Programs',
  'Gödel, Escher, Bach',
  'The Art of Doing Science and Engineering',
];
