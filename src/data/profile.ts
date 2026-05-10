export interface Profile {
  availability: 'available' | 'unavailable';
  targetRoles: string;
  location: string;
  locationAlt: string;
  pronouns: string;
  yearsExp: string;
  shortBio: string;
}

export const profile: Profile = {
  availability: 'available',
  targetRoles: 'staff / senior backend',
  location: 'brooklyn, ny',
  locationAlt: 'remote or nyc',
  pronouns: 'he/him',
  yearsExp: '8y',
  shortBio: "I'm Kevin, a Brooklyn-based software engineer focused on backend systems. I write here about the craft, the tools, and what I'm learning. Recruiters welcome — clean PDF resume one click away.",
};
