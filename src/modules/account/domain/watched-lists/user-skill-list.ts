import { WatchedList } from '@common/domain/watched-list';

import { Skill } from '../skill';

export class UserSkillList extends WatchedList<Skill> {
  compareItems(a: Skill, b: Skill): boolean {
    return a.id === b.id;
  }
}
