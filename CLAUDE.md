# kevsq-github — CLAUDE.md

Personal Astro site (field journal / portfolio). Built to be easy to maintain: adding new content means editing a data file, not hunting through JSX.

---

## Architecture Principle: Data → Types → Component → Page

Every piece of user-maintained content follows this four-layer pattern:

```
src/data/{domain}.ts      ← types + ordered data arrays (only file the owner ever edits)
src/components/{Card}.astro ← accepts typed props, renders one item
src/pages/{page}.astro    ← imports data + components, does layout only
```

**The rule:** If the site owner would need to edit it to update their personal information, it belongs in `src/data/`. Pages and components are rendering infrastructure — they should never need to change when content changes.

### Established data files

| File | Exports | Used by |
|------|---------|---------|
| `src/data/books.ts` | `nightstand`, `recentlyFinished`, `queue`, `booksReadThisYear` + types | `reading.astro`, `BookCard.astro` |
| `src/data/work.ts` | `atWork`, `sideProjects`, `archive`, `sidebarStats` + types | `work.astro`, `ProjectCard.astro` |
| `src/data/resume.ts` | `experience`, `skills`, `RESUME_LAST_REVISED` + types | `resume.astro` |
| `src/data/navigation.ts` | `navLinks` | `SlashNav.astro` |
| `src/data/profile.ts` | `availability`, `bio`, `location` | `about.astro`, `contact.astro`, `resume.astro`, `index.astro` |
| `src/data/now.ts` | `nowItems` | `index.astro` |
| `src/data/contact.ts` | `channels` | `contact.astro` |

### Content collections vs. plain `.ts` data

Use **Astro content collections** (`src/content/`) when content has a markdown/MDX body (blog posts, long-form notes). Use **plain `.ts` data files** (`src/data/`) when content is structured objects with no prose body (books, jobs, nav links, profile facts). Never reach for a content collection just because something feels like "data."

---

## Component Rules

- A component renders **one item** from a data array. It does not define data.
- Components receive typed props derived from the interfaces in `src/data/`.
- All CSS for a component lives in that component's `<style>` block — never in the page.
- Pages keep only layout-level CSS (grid, max-width, page-specific spacing).

### Established components

| Component | Prop type | Source data |
|-----------|-----------|-------------|
| `BookCard.astro` | `Book` (discriminated union) | `src/data/books.ts` |
| `ProjectCard.astro` | `Project` (discriminated union) | `src/data/work.ts` |
| `WritingCard.astro` | `CollectionEntry<'writing'>` | Astro content collection |

---

## DRY Enforcement Rules

### No content duplicated across pages

Profile fragments — availability status, target role, location, short bio — appear on multiple pages (`/about`, `/contact`, `/resume`, `/`). They must come from `src/data/profile.ts`. Never copy-paste the same string into two page files.

### Derived stats, not hardcoded counts

If a count can be derived from a data array, derive it. Examples:
- `{nightstand.length}` not `3`
- `{queue.length}+` not `27`
- `{atWork.length + sideProjects.length}` if needed

The exception: counters that are not derivable from the site's own data (e.g., GitHub commits, annual book count when the list is a curated sample) stay as manual constants with a comment explaining why.

### One status badge definition

The writing status badge (`'budding' | 'evergreen'` → emoji + label) must be defined once. It currently appears in three places. The canonical definition lives in a shared utility or a `StatusBadge.astro` component — never as an inline ternary in multiple files.

### Navigation links defined once

`SlashNav.astro` renders nav from an imported array. Never hardcode nav links inside the component itself. Adding a new page = add one entry to `src/data/navigation.ts`.

---

## Type Conventions

Follow the pattern from `src/data/books.ts`:

```ts
// 1. Narrow union types for constrained fields
export type CoverVariant = 'brass' | 'moss' | 'terra' | 'sky' | 'ink';

// 2. Unexported base interface (implementation detail)
interface BaseBook { ... }

// 3. Exported concrete interfaces extend base, add discriminant field
export interface NightstandBook extends BaseBook {
  section: 'nightstand';  // discriminant
  status: NightstandStatus;
}

// 4. Exported union type used as component prop type
export type Book = NightstandBook | FinishedBook;
```

Use **discriminated unions** (a `section`, `category`, or `type` field) when two subtypes share fields but differ in semantics. This enables TypeScript to narrow correctly in component templates without casts.

---

## Page Structure

A refactored page should read like this:

```astro
---
import Base from '../layouts/Base.astro';
import Eyebrow from '../components/Eyebrow.astro';
import SlashNav from '../components/SlashNav.astro';
import Sidebar from '../components/Sidebar.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { atWork, sideProjects, archive, sidebarStats } from '../data/work';
---
<Base title="...">
  <main class="page">
    <article>
      <!-- layout only — no data defined here -->
    </article>
    <Sidebar>
      <!-- sidebar content from data -->
    </Sidebar>
  </main>
</Base>

<style>
  /* layout only — .page grid, max-width, page-specific spacing */
  /* NO component-level styles here */
</style>
```

---

## Adding New Content (Cheatsheet)

| Task | What to edit |
|------|-------------|
| Add a book to the nightstand | `src/data/books.ts` → `nightstand[]` |
| Mark a book finished | Move object from `nightstand[]` to `recentlyFinished[]`, change interface fields |
| Add a queue title | `src/data/books.ts` → `queue[]` |
| Add a work project | `src/data/work.ts` → `atWork[]` or `sideProjects[]` |
| Add an archived project | `src/data/work.ts` → `archive[]` |
| Update job availability | `src/data/profile.ts` → `availability` |
| Update "now" sidebar | `src/data/now.ts` → `nowItems[]` |
| Add a nav link | `src/data/navigation.ts` → `navLinks[]` |
| Add a blog post | `src/content/writing/my-post.mdx` with frontmatter |
| Update resume experience | `src/data/resume.ts` → `experience[]` |
| Update skills | `src/data/resume.ts` → `skills[]` |

---

## File Structure (Relevant Paths)

```
src/
  data/           ← all user-maintained content (edit here)
  components/     ← rendering only, typed props
  pages/          ← layout + orchestration only
  content/
    writing/      ← MDX blog posts (edit here for new posts)
  config/
    helpers.ts    ← site-wide utilities (eyebrow, date math)
  layouts/
    Base.astro
  lib/
    supabase.ts
    supabase-server.ts
  styles/
    global.css    ← CSS variables, resets (no component styles)
```

---

## What NOT to Do

- Do not define data arrays inside `.astro` page frontmatter
- Do not duplicate content strings across multiple page files
- Do not put component-level CSS in page `<style>` blocks
- Do not hardcode counts that can be derived from data arrays
- Do not define type interfaces inside page files — they belong in `src/data/`
- Do not use a content collection for structured data without a prose body
