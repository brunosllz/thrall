// import { makeFakeProject } from '@test/factories/make-project';

// import { InMemoryProjectsDAO } from '../../dao/in-memory/in-memory-projects-dao';
// import { InMemoryProjectsRepository } from '../../repositories/in-memory/in-memory-projects-repository';
// import { InMemoryRolesRepository } from '../../repositories/in-memory/in-memory-roles-repository';
// import { FetchProjectsWithShortDetailsUseCase } from './fetch-projects-with-short-details';

// let rolesRepository: InMemoryRolesRepository;
// let projectsRepository: InMemoryProjectsRepository;
// let projectsDAO: InMemoryProjectsDAO;
// let sut: FetchProjectsWithShortDetailsUseCase;

// describe('Fetch recent projects', () => {
//   beforeEach(() => {
//     rolesRepository = new InMemoryRolesRepository();
//     projectsRepository = new InMemoryProjectsRepository(rolesRepository);
//     projectsDAO = new InMemoryProjectsDAO(projectsRepository);
//     sut = new FetchProjectsWithShortDetailsUseCase(projectsDAO);
//   });

//   it('should be able to fetch recent projects', async () => {
//     let errorOccurred = false;
//     try {
//       await projectsRepository.create(
//         makeFakeProject({
//           createdAt: new Date(2023, 8, 16),
//         }),
//       );

//       await projectsRepository.create(
//         makeFakeProject({
//           createdAt: new Date(2023, 8, 15),
//         }),
//       );

//       await projectsRepository.create(
//         makeFakeProject({
//           createdAt: new Date(2023, 8, 14),
//         }),
//       );

//       const result = await sut.execute({
//         pageIndex: 1,
//         pageSize: 5,
//       });

//       const projects = result.value.getValue();

//       expect(projects).toEqual([
//         expect.objectContaining({ createdAt: new Date(2023, 8, 16) }),
//         expect.objectContaining({ createdAt: new Date(2023, 8, 15) }),
//         expect.objectContaining({ createdAt: new Date(2023, 8, 14) }),
//       ]);
//       expect(result.isRight()).toBe(true);
//     } catch (error) {
//       errorOccurred = true;
//     }

//     expect(errorOccurred).toBeFalsy();
//   });

//   it('should be able to fetch paginated answer comments', async () => {
//     let errorOccurred = false;

//     try {
//       for (let i = 1; i <= 10; i++) {
//         await projectsRepository.create(makeFakeProject());
//       }

//       const result = await sut.execute({
//         pageIndex: 2,
//         pageSize: 8,
//       });

//       const projects = result.value.getValue();

//       expect(projects).toHaveLength(2);
//       expect(result.isRight()).toBe(true);
//     } catch (error) {
//       errorOccurred = true;
//     }

//     expect(errorOccurred).toBeFalsy();
//   });
// });
