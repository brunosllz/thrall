import { AggregateRoot } from '@common/domain/entities/aggregate-root';
import { Optional } from '@common/logic/types/Optional';

import { ProjectRoleList } from './project-role-list';
import { ProjectTechnologyList } from './project-technology-list';
import { Requirement } from './value-objects/requirement';
import { Slug } from './value-objects/slug';

export interface ProjectProps {
  authorId: string;
  title: string;
  content: string;
  slug: Slug;
  roles: ProjectRoleList;
  technologies: ProjectTechnologyList;
  requirements: Requirement;
  createdAt: Date;
  updatedAt?: Date;
}

export class Project extends AggregateRoot<ProjectProps> {
  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get excerpt() {
    if (this.content.length >= 120) {
      return this.props.content.substring(0, 120).trimEnd().concat('...');
    }

    return this.content;
  }

  get slug() {
    return this.props.slug;
  }

  get roles() {
    return this.props.roles;
  }

  get technologies() {
    return this.props.technologies;
  }

  get requirements() {
    return this.props.requirements;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set title(text: string) {
    this.props.title = text;
    this.props.slug = Slug.createFromText(text);
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set roles(roles: ProjectRoleList) {
    this.props.roles = roles;
    this.touch();
  }

  set technologies(technologies: ProjectTechnologyList) {
    this.props.technologies = technologies;
    this.touch();
  }

  set requirements(requirements: Requirement) {
    this.props.requirements = requirements;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      Omit<ProjectProps, 'slug'>,
      'createdAt' | 'roles' | 'technologies'
    >,
    id?: string,
  ) {
    const project = new Project(
      {
        ...props,
        slug: Slug.createFromText(props.title),
        roles: props.roles ?? new ProjectRoleList(),
        technologies: props.technologies ?? new ProjectTechnologyList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return project;
  }
}
