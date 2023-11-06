// import { PaginationParams } from '@common/repositories/pagination-params';

// import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
// import { ProjectQueryParams, ProjectsDAO } from '../projects-dao';

// export class InMemoryProjectsDAO extends ProjectsDAO {
//   findManyWithShortDetails(
//     queryParams: ProjectQueryParams,
//     paginationParams: PaginationParams,
//   ): Promise<any[]> {
//     throw new Error('Method not implemented.');
//   }
//   constructor(readonly inMemoryProjectsRepository: InMemoryProjectsRepository) {
//     super();
//   }

//   async findManyRecent({
//     pageIndex,
//     pageSize,
//   }: PaginationParams): Promise<any[]> {
//     const projects = this.inMemoryProjectsRepository.items
//       .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//       .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

//     return projects;
//   }

//   async findManyByUserId(
//     userId: string,
//     { pageIndex, pageSize }: PaginationParams,
//   ) {
//     const projects = this.inMemoryProjectsRepository.items
//       .filter((project) => project.authorId === userId)
//       .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

//     return projects;
//   }

//   async findBySlug(slug: string, authorId: string) {
//     const project = this.inMemoryProjectsRepository.items.find(
//       (project) => project.slug.value === slug && project.authorId === authorId,
//     );

//     return project;
//   }
// }
