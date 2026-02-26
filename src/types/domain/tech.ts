export interface TechItem {
  name: string;
  icon: string;
  viewBox?: string;
  invert?: boolean;
  iconClass?: string;
}

export interface TechCategoryData {
  labelKey: string;
  items: TechItem[];
}
