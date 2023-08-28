import { WatchedList } from '@common/domain/watched-list';

import { Interested } from '../interested';

export class ProjectInterestedList extends WatchedList<Interested> {
  compareItems(a: Interested, b: Interested): boolean {
    return a.recipientId === b.recipientId;
  }
}
