const availableDaysMapper: Record<number, string> = {
  0: 'domingo',
  1: 'segunda',
  2: 'terça',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sábado',
};

const unitTimeMapper: Record<string, string> = {
  hour: 'hr',
  minute: 'min',
};

// const availableDaysMapper =

export class GetProjectsDetailsViewModel {
  static toHTTP(projectDetails: any) {
    return {
      id: projectDetails.id,
      imageUrl:
        projectDetails.imageUrl.length > 0 ? projectDetails.imageUrl : null,
      bannerUrl: projectDetails.bannerUrl,
      name: projectDetails.name,
      description: projectDetails.description,
      author: {
        name: projectDetails.user.name,
        role: projectDetails.user.role,
      },
      availableDays: projectDetails.availableDays
        .sort((a: number, b: number) => a - b)
        .map((day: number) => availableDaysMapper[day]),
      availableTime: `${projectDetails.availableTimeValue}${
        projectDetails.availableTimeValue > 1 &&
        projectDetails.availableTimeUnit === 'hour'
          ? 'hrs'
          : unitTimeMapper[projectDetails.availableTimeUnit]
      }`,
      roles: projectDetails.projectRoles.map((role: any) => ({
        id: role.id,
        name: role.role.name,
        description: role.description,
        membersAmount: role.membersAmount,
      })),
      generalSkills: projectDetails.skills.map((skill: any) => skill.slug),
      hasInterestInParticipate: projectDetails.interestedInProject,
      createdAt: projectDetails.createdAt,
    };
  }
}
