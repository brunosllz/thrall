import { Entity } from '@/core/domain/entities/entity';
import { Guard } from '@/core/logic/Guard';
import { Result } from '@/core/logic/result';
import { Optional } from '@/core/logic/types/Optional';

export enum MemberStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

export enum PermissionType {
  OWNER = 'owner',
  MEMBER = 'member',
}

export interface MemberProps {
  recipientId: string;
  permissionType: PermissionType;
  status: MemberStatus | null;
  role?: string;
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

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set permissionType(permissionType: PermissionType) {
    this.props.permissionType = permissionType;
    this.touch();
  }

  set status(status: MemberStatus | null) {
    this.props.status = status;
  }

  changeStatus(status: MemberStatus) {
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
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.recipientId, argumentName: 'recipientId' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Member>(guardResult.message);
    }

    const member = new Member(
      {
        ...props,
        status: props.status ?? null,
        permissionType: props.permissionType ?? PermissionType.MEMBER,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return Result.ok<Member>(member);
  }
}
