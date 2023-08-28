import { faker } from '@faker-js/faker';
import { Member, MemberProps } from '@modules/timeline/domain/entities/member';

type Overrides = Partial<MemberProps>;

export function makeFakeMember(override = {} as Overrides, id?: string) {
  const member = Member.create(
    {
      recipientId: faker.string.uuid(),
      ...override,
    },
    id,
  ).getValue();

  return member;
}
