import { InMemoryAnswersRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-answers-repository';
import { InMemoryProjectsRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-projects-repository';
import { InMemoryRolesRepository } from '@modules/timeline/application/repositories/in-memory/in-memory-roles-repository';

import { makeFakeAnswer } from '@test/factories/make-answer';
import { makeFakeProject } from '@test/factories/make-project';
import { waitFor } from '@test/factories/utils/wait-for';

import { InMemoryNotificationsRepository } from '../application/repositories/in-memory/in-memory-notifications-repository';
import { SendNotificationUseCase } from '../application/use-cases/send-notification';
import { OnAnswerCreated } from './on-answer-created';

let notificationsRepository: InMemoryNotificationsRepository;
let projectsRepository: InMemoryProjectsRepository;
let answersRepository: InMemoryAnswersRepository;
let rolesRepository: InMemoryRolesRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: jest.SpyInstance;

describe('On answer created', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    rolesRepository = new InMemoryRolesRepository();
    answersRepository = new InMemoryAnswersRepository();
    projectsRepository = new InMemoryProjectsRepository(rolesRepository);
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    );

    sendNotificationExecuteSpy = jest.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(projectsRepository, sendNotificationUseCase);
  });

  it('should  send a notification when an answer is created', async () => {
    const project = makeFakeProject();
    const answer = makeFakeAnswer({ projectId: project.id });

    projectsRepository.create(project);
    answersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
