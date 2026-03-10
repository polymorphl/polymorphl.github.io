import type { CareerEntryBase } from '@domain/career';

export const CAREER_ENTRIES_BASE: CareerEntryBase[] = [
  {
    company: 'Paradox Institute',
    period: ['05/2023', '09/2025'],
    stack: ['Node.js', 'Next.js', 'React', 'NestJS', 'TypeScript', 'Vanilla JS', 'AWS', 'Clerk', 'Redis', 'Chargebee', 'Stripe', 'Vercel', 'PostgreSQL', 'Docker'],
    logoId: 'paradox-institute',
    logoLight: true,
    website: 'https://www.paradox.io/'
  },
  {
    company: 'Votelab',
    period: ['04/2022', '05/2023'],
    stack: ['Node.js', 'Next.js', 'React', 'Vanilla JS', 'TypeScript', 'Ethereum', 'Docker', 'PostgreSQL'],
    logoId: 'votelab',
    website: 'https://www.linkedin.com/company/votelab'
  },
  {
    company: 'Horiz.io',
    period: ['05/2019', '04/2022'],
    stack: ['Node.js', 'NestJS', 'Vue.js', 'TypeScript', 'Vanilla JS', 'Stripe', 'Keycloak', 'MongoDB', 'Nginx', 'Docker'],
    logoId: 'horiz',
    website: 'https://horiz.io'
  },
  {
    company: 'SFBX',
    period: ['10/2017', '02/2019'],
    stack: ['Go', 'Vanilla JS', 'Aerospike', 'Docker', 'Nginx', 'GCP', 'ZeroMQ'],
    logoId: 'sfbx',
    website: 'https://sfbx.io'
  },
  {
    company: 'Asobo Studio',
    period: ['04/2016', '08/2017'],
    stack: ['Node.js', 'Angular', 'TypeScript', 'Vanilla JS', 'Ansible', 'Nginx', 'MongoDB', 'MySQL', 'Docker'],
    logoId: 'asobo',
    website: 'https://www.asobostudio.com'
  },
  {
    company: 'Parker+Parker',
    period: ['10/2015', '03/2016'],
    stack: ['PHP', 'MySQL', 'jQuery', 'Vanilla JS'],
    logoId: 'parker-parker',
    website: 'https://parker-parker.com'
  }
];
