import type { CareerEntryBase, CertificationBase } from '@domain/career';

export const CAREER_ENTRIES_BASE: CareerEntryBase[] = [
  {
    company: 'Formation & Open Source',
    period: ['09/2025', 'present'],
    stack: ['rust', 'go', 'python', 'react'],
    logoId: 'formation-and-open-source',
    logoLight: true,
  },
  {
    company: 'Paradox Institute',
    period: ['05/2023', '09/2025'],
    stack: ['nodejs', 'nextjs', 'react', 'nestjs', 'typescript', 'vanillajs', 'aws', 'clerk', 'redis', 'chargebee', 'stripe', 'vercel', 'postgresql', 'docker'],
    logoId: 'paradox-institute',
    logoLight: true,
    website: 'https://www.paradox.io/'
  },
  {
    company: 'Votelab',
    period: ['04/2022', '05/2023'],
    stack: ['nodejs', 'nextjs', 'react', 'vanillajs', 'typescript', 'ethereum', 'docker', 'postgresql'],
    logoId: 'votelab',
    website: 'https://www.linkedin.com/company/votelab'
  },
  {
    company: 'Horiz.io',
    period: ['05/2019', '04/2022'],
    stack: ['nodejs', 'nestjs', 'vuejs', 'typescript', 'vanillajs', 'stripe', 'keycloak', 'mongodb', 'nginx', 'docker'],
    logoId: 'horiz',
    website: 'https://horiz.io'
  },
  {
    company: 'SFBX',
    period: ['10/2017', '02/2019'],
    stack: ['go', 'vanillajs', 'aerospike', 'docker', 'nginx', 'gcp', 'zeromq'],
    logoId: 'sfbx',
    website: 'https://sfbx.io'
  },
  {
    company: 'Asobo Studio',
    period: ['04/2016', '08/2017'],
    stack: ['nodejs', 'react','angular', 'typescript', 'vanillajs', 'ansible', 'nginx', 'mongodb', 'mysql', 'docker'],
    logoId: 'asobo',
    website: 'https://www.asobostudio.com'
  },
  {
    company: 'Parker+Parker',
    period: ['10/2015', '03/2016'],
    stack: ['php', 'mysql', 'jquery', 'vanillajs'],
    logoId: 'parker-parker',
    website: 'https://parker-parker.com'
  }
];

export const CERTIFICATIONS_BASE: CertificationBase[] = [
  {
    id: 'claude-code-in-action',
    issuer: 'Anthropic',
    date: '04/2026',
    pdf: '/assets/certifications/claude-code-in-action.pdf',
    verifyUrl: 'https://verify.skilljar.com/c/keokczmmksmh',
  },
  {
    id: 'blent-ai-python',
    issuer: 'Blent.ai',
    date: '03/2026',
    pdf: '/assets/certifications/blent-ai-python.pdf',
  },
];
