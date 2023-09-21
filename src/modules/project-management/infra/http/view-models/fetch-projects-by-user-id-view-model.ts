function excerpt(text: string, limit: number) {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
}

export class FetchProjectsByUserIdViewModel {
  static toHTTP(project: any) {
    return {
      id: project.id,
      authorId: project.authorId,
      name: project.name,
      description: project.description,
      excerpt: excerpt(project.description, 150),
      status: project.status,
      imageUrl: project.imageUrl,
      slug: project.slug,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      technologies: project.technologies.map(
        (technology: any) => technology.slug,
      ),
      _count: project._count,
    };
  }
}
