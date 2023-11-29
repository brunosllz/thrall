export class FetchProjectsByUserIdViewModel {
  static toHTTP(project: any) {
    return {
      id: project.id,
      authorId: project.authorId,
      name: project.name,
      description: project.description,
      status: project.status,
      bannerUrl: project.bannerUrl,
      slug: project.slug,
      myRoles: project.projectRoles.map(
        (projectRole: { role: { id: string; name: string } }) => {
          return {
            id: projectRole.role.id,
            name: projectRole.role.name,
          };
        },
      ),
      teamMembers: project.teamMembers.map(
        (teamMember: {
          id: string;
          user: { name: string; avatarUrl: string };
        }) => {
          return {
            id: teamMember.id,
            name: teamMember.user.name,
            avatarUrl: teamMember.user.avatarUrl,
          };
        },
      ),
    };
  }
}
