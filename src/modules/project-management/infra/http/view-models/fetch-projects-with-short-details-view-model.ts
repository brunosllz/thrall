export class FetchProjectsWithShortDetailsViewModel {
  static toHTTP(projectShortDetails: any) {
    return {
      id: projectShortDetails.id,
      imageUrl:
        projectShortDetails.imageUrl.length > 0
          ? projectShortDetails.imageUrl
          : null,
      name: projectShortDetails.name,
      description: projectShortDetails.description,
      author: {
        name: projectShortDetails.user.name,
        role: projectShortDetails.user.role,
      },
      skills: projectShortDetails.skills.map((skill: any) => skill.slug),
      createdAt: projectShortDetails.createdAt,
    };
  }
}
