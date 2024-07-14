import { Slug } from '@/core/domain/value-objects/slug';
import {
  JobProps,
  Job,
} from '@/modules/project-management/domain/entities/job';
import { Content } from '@/modules/project-management/domain/entities/value-objects/content';
import { faker } from '@faker-js/faker';

type Overrides = Partial<JobProps>;

export function makeFakeJob(override = {} as Overrides, id?: string) {
  const name = faker.person.jobTitle();

  const job = Job.create(
    {
      jobAmountAvailable: faker.number.int(),
      name,
      slug: Slug.createFromText(override.name ?? name).getValue(),
      projectId: faker.string.uuid(),
      description: new Content(faker.lorem.paragraphs()),
      ...override,
    },
    id,
  ).getValue();

  return job;
}
