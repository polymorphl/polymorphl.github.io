/**
 * Domain types for project definitions
 */

import type { TechId } from '@config/techs';

export type ProjectConfig = {
  id: string;
  title: string;
  url: string;
  image: string;
  techIds: TechId[];
};
