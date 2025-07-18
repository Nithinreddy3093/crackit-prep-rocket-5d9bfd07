// Activity item type
export interface ActivityItem {
  id: string;
  type: 'quiz' | 'resource';
  name: string;
  score?: string;
  date: string;
  topic: string;
}