import { WatchedList } from '@/core/domain/watched-list';

import { Job } from '../job';

export class ProjectJobList extends WatchedList<Job> {
  compareItems(a: Job, b: Job): boolean {
    return a.id === b.id;
  }
}
