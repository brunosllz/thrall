import { WatchedList } from '@/core/domain/watched-list';

import { Skill } from '../skill';

export class ProjectGeneralSkillList extends WatchedList<Skill> {
  compareItems(a: Skill, b: Skill): boolean {
    return a.slug.value === b.slug.value;
  }
}
