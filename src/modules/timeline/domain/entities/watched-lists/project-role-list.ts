import { WatchedList } from '@common/domain/watched-list';

import { Role } from '../role';

export class ProjectRoleList extends WatchedList<Role> {
  compareItems(a: Role, b: Role): boolean {
    return a.id === b.id;
  }
}
