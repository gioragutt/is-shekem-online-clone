import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

export function formatTimeAgo(timestamp: string): string {
  return formatDistanceToNow(new Date(timestamp), { locale: he, addSuffix: true });
}
