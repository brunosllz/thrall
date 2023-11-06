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
        name: projectShortDetails.users.name,
        role: projectShortDetails.users.role,
      },
      technologies: projectShortDetails.technologies.map(
        (technology: any) => technology.slug,
      ),
      createdAt: projectShortDetails.createdAt,
    };
  }
}
