const availableDaysMapper: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda - feira',
  2: 'Terça - feira',
  3: 'Quarta - feira',
  4: 'Quinta - feira',
  5: 'Sexta - feira',
  6: 'Sábado',
};

const unitTimeMapper: Record<string, string> = {
  hour: 'hr',
  minute: 'min',
};

export class GetProjectDetailsBySlugViewModel {
  static toHTTP(project: any) {
    return {
      id: project.id,
      slug: project.slug,
      author: {
        id: project.user.id,
        name: project.user.name,
      },
      bannerUrl: project.bannerUrl,
      imageUrl: project.imageUrl,
      name: project.name,
      description: project.description,
      status: project.status,
      availableDays: project.availableDays
        .sort((a: number, b: number) => a - b)
        .map((day: number) => availableDaysMapper[day]),
      availableTime: `${project.availableTimeValue}${
        project.availableTimeValue > 1 && project.availableTimeUnit === 'hour'
          ? 'hrs'
          : unitTimeMapper[project.availableTimeUnit]
      }`,
      skills: project.skills.map((skill: { slug: string }) => skill.slug),
      teamMembers: project.teamMembers.map(
        (teamMember: {
          id: string;
          permissionType: 'owner' | 'member';
          user: {
            id: string;
            name: string;
            avatarUrl: string;
            title: string;
          };
          projectJob: Array<{
            role: {
              name: string;
              slug: string;
            };
          }>;
        }) => {
          return {
            id: teamMember.id,
            userId: teamMember.user.id,
            avatarUrl: teamMember.user.avatarUrl,
            name: teamMember.user.name,
            title: teamMember.user.title,
            permissionType: teamMember.permissionType,
            roles: teamMember.projectJob.map((member) => {
              return {
                name: member.role.name,
                slug: member.role.slug,
              };
            }),
          };
        },
      ),
      jobs: project.projectJobs.map(
        (projectRole: {
          id: string;
          membersAmount: number;
          description: string;
          role: {
            name: string;
            slug: string;
          };
        }) => {
          return {
            id: projectRole.id,
            membersAmount: projectRole.membersAmount,
            description: projectRole.description,
            name: projectRole.role.name,
            slug: projectRole.role.slug,
          };
        },
      ),
      interestedInProject: project.interestedInProject.map(
        (interestedUser: {
          user: {
            id: string;
            avatarUrl: string;
            role: string;
            seniority: string;
            name: string;
            slugProfile: string;
          };
        }) => {
          return {
            id: interestedUser.user.id,
            avatarUrl: interestedUser.user.avatarUrl,
            role: interestedUser.user.role,
            seniority: interestedUser.user.seniority,
            name: interestedUser.user.name,
            slugProfile: interestedUser.user.slugProfile,
          };
        },
      ),
      createdAt: project.createdAt,
    };
  }
}
