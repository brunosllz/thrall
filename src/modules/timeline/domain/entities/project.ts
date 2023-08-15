import { AggregateRoot } from '@common/domain/aggregate-root';
import { Replace } from '@common/logic/Replace';

import { ProjectRoleList } from './project-role-list';
import { Slug } from './value-objects/slug';

export interface ProjectProps {
  authorId: string;
  title: string;
  content: string;
  slug: Slug;
  roles: ProjectRoleList;
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
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Replace<
      Omit<ProjectProps, 'slug'>,
      { createdAt?: Date; roles?: ProjectRoleList }
    >,
    id?: string,
  ) {
    const project = new Project(
      {
        ...props,
        slug: Slug.createFromText(props.title),
        roles: props.roles ?? new ProjectRoleList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return project;
  }
}
