import type { ProjectConfig } from '@domain/project';

export const PROJECTS: ReadonlyArray<ProjectConfig> = [
  {
    id: 'blent-ai-customer-service-assistant',
    title: 'Customer Service Assistant',
    url: 'https://github.com/polymorphl/blent-ai-customer-service-assistant',
    image: '/assets/projects/blent-ai-customer-service-assistant.webp',
    techIds: ['python', 'langchain'],
    featured: true
  },
  {
    id: 'blent-ai-python-api-rest',
    title: 'DigiMarket API',
    url: 'https://github.com/polymorphl/blent-ai-python-api-rest',
    image: '/assets/projects/blent-ai-python-api-rest.webp',
    techIds: ['python', 'flask'],
    featured: true
  },
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
    techIds: ['go', 'typescript', 'react'],
  }
] as const;
