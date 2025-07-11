// Activity item type
export interface ActivityItem {
  id: number;
  type: 'quiz' | 'resource';
  name: string;
  score?: string;
  date: string;
  topic: string;
}