export class FetchProjectsByUserIdViewModel {
  static toHTTP(project: any) {
    return {
      id: project.id,
      authorId: project.authorId,
      name: project.name,
      description: project.description,
      status: project.status,
      imageUrl: project.imageUrl,
      slug: project.slug,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      skills: project.skills.map((skill: any) => skill.slug),
      _count: project._count,
    };
  }
}
