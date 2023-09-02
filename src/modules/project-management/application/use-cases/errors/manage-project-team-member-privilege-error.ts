import { UseCaseError } from '@common/errors/use-case-error';
import { Result } from '@common/logic/result';

export namespace ManageProjectTeamMemberPrivilegeError {
  export class InvalidDeleteItSelf extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `You can't delete your own privilege if you are the only admin in the project.`,
      } as UseCaseError);
    }
  }
}
