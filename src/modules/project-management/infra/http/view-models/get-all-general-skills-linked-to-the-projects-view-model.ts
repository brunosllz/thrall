import { capitalizeFirstLetter } from '@/modules/project-management/utils/captalize-first-letter';

export class GetAllGeneralSkillsLinkedToTheProjectsViewModel {
  static toHTTP(generalSkill: any) {
    return {
      id: generalSkill.id,
      value: generalSkill.slug,
      label: capitalizeFirstLetter(generalSkill.slug),
    };
  }
}
