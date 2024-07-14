import { WatchedList } from '@/core/domain/watched-list';

export class MembersIdsAssignedList extends WatchedList<string> {
  compareItems(a: string, b: string): boolean {
    return a === b;
  }
}
