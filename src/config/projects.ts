import type { TechItem } from '@domain/tech';

export interface ProjectConfig {
  id: string;
  title: string;
  url: string;
  image: string;
  techs: TechItem[];
}

export const PROJECTS: ReadonlyArray<ProjectConfig> = [
  {
    id: 'my-open-claude',
    title: 'My Open Claude',
    url: 'https://github.com/polymorphl/my-open-claude',
    image: '/assets/projects/my-open-claude.webp',
    techs: [
      { name: 'Rust', icon: 'rust', viewBox: '0 0 32 32', iconClass: 'tech-icon-rust' },
    ],
  },
  {
    id: 'go-kv',
    title: 'Go-kv',
    url: 'https://github.com/polymorphl/go-kv',
    image: '/assets/projects/go-kv.webp',
    techs: [
      { name: 'Go', icon: 'go' },
    ],
  },
  {
    id: 'orcrux',
    title: 'Orcrux',
    url: 'https://github.com/polymorphl/orcrux',
    image: '/assets/projects/orcrux.webp',
    techs: [
      { name: 'Go', icon: 'go' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'React', icon: 'react' },
      { name: 'Vanilla JS', icon: 'javascript' },
    ],
  },
] as const;
