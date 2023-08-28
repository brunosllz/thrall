import { WatchedList } from '@common/domain/watched-list';

import { Technology } from '../technology';

export class ProjectTechnologyList extends WatchedList<Technology> {
  compareItems(a: Technology, b: Technology): boolean {
    return a.id === b.id;
  }
}
