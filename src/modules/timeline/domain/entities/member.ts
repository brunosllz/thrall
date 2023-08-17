import { Entity } from '@common/domain/entities/entity';
import { Optional } from '@common/logic/types/Optional';

export interface MemberProps {
  recipientId: string;
  permissionType: 'owner' | 'member';
  status: 'approved' | 'rejected' | 'pending';
  createdAt: Date;
  updatedAt?: Date;
}

export class Member extends Entity<MemberProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get permissionType() {
    return this.props.permissionType;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set permissionType(permissionType: 'owner' | 'member') {
    this.props.permissionType = permissionType;
    this.touch();
  }

  set status(status: 'approved' | 'rejected' | 'pending') {
    this.props.status = status;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<MemberProps, 'createdAt' | 'permissionType' | 'status'>,
    id?: string,
  ) {
    const member = new Member(
      {
        ...props,
        status: props.status ?? 'rejected',
        permissionType: props.permissionType ?? 'member',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return member;
  }
}
