export class FetchProjectsInvolvedByUserIdViewModel {
  static toHTTP(project: any) {
    return {
      id: project.id,
      status: project.status,
      slug: project.slug,
      bannerUrl: project.bannerUrl,
      name: project.name,
      description: project.description,
      myRoles: project.projectJobs.map(
        (projectRole: {
          role: { id: string; name: string; slug: string };
        }) => ({
          id: projectRole.role.id,
          name: projectRole.role.name,
          slug: projectRole.role.slug,
        }),
      ),
      teamMembers: project.teamMembers.map(
        (teamMember: {
          id: string;
          user: { name: string; avatarUrl: string };
        }) => ({
          id: teamMember.id,
          name: teamMember.user.name,
          avatarUrl: teamMember.user.avatarUrl,
        }),
      ),
    };
  }
}
