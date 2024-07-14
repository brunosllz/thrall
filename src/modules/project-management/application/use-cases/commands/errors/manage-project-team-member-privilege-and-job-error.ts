import { UseCaseError } from '@/core/errors/use-case-error';
import { Result } from '@/core/logic/result';

export namespace ManageProjectTeamMemberPrivilegeAndJobError {
  export class InvalidDeleteItSelf extends Result<UseCaseError> {
    constructor() {
      super(
        false,
        `You can't delete your own privilege if you are the only admin in the project.`,
      );
    }
  }
}
