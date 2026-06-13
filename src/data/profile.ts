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
  targetRoles: 'Applied AI, Backend, Data and Customer-facing Engineering roles.',
  location: 'New York, NY',
  locationAlt: 'Remote or NYC',
  pronouns: 'he/him',
  yearsExp: '2y',
  shortBio: "I'm Kevin, a New York-based Software Engineer curently focused on applied AI systems and local AI. I write my thoughts, opinions and hot takes here."
}
