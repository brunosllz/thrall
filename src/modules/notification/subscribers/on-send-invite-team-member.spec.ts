import { InMemoryProjectsRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-roles-repository';

import { makeFakeProject } from '@test/factories/make-project';
import { waitFor } from '@test/factories/utils/wait-for';

import { InMemoryNotificationsRepository } from '../application/repositories/in-memory/in-memory-notifications-repository';
import { SendNotificationUseCase } from '../application/use-cases/send-notification';
import { OnSendInviteTeamMember } from './on-send-invite-team-member';

let notificationsRepository: InMemoryNotificationsRepository;
let projectsRepository: InMemoryProjectsRepository;

let rolesRepository: InMemoryRolesRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: jest.SpyInstance;

describe('On send invite team member', () => {
  beforeEach(() => {
    rolesRepository = new InMemoryRolesRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);

    notificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    );

    sendNotificationExecuteSpy = jest.spyOn(sendNotificationUseCase, 'execute');

    new OnSendInviteTeamMember(projectsRepository, sendNotificationUseCase);
  });

  it('should send a notification when send a invite to team member', async () => {
    const project = makeFakeProject();

    await projectsRepository.create(project);

    project.sendInviteTeamMember('2', project.authorId);

    await projectsRepository.save(project);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
