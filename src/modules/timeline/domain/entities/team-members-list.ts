import { WatchedList } from '@common/domain/watched-list';

import { Member } from './member';

export class TeamMembersList extends WatchedList<Member> {
  compareItems(a: Member, b: Member): boolean {
    return a.id === b.id;
  }
}
