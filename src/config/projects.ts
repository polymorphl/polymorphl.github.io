import type { ProjectConfig } from '@domain/project';

export const PROJECTS: ReadonlyArray<ProjectConfig> = [
  {
    id: 'claude-weekly-insights',
    title: 'Claude Weekly Insights',
    url: 'https://github.com/polymorphl/claude-weekly-insights',
    image: '/assets/projects/claude-weekly-insights.webp',
    techIds: ['python'],
  },
  {
    id: 'my-open-claude',
    title: 'My Open Claude',
    url: 'https://github.com/polymorphl/my-open-claude',
    image: '/assets/projects/my-open-claude.webp',
    techIds: ['rust'],
  },
  {
    id: 'go-kv',
    title: 'Go-kv',
    url: 'https://github.com/polymorphl/go-kv',
    image: '/assets/projects/go-kv.webp',
    techIds: ['go'],
  },
  {
    id: 'orcrux',
    title: 'Orcrux',
    url: 'https://github.com/polymorphl/orcrux',
    image: '/assets/projects/orcrux.webp',
    techIds: ['go', 'typescript', 'react', 'vanillajs'],
  },
] as const;
