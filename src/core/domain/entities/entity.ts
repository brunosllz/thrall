import { UniqueID } from './unique-id';

export abstract class Entity<Props> {
  private _id: UniqueID;
  protected readonly props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, prefixId?: string, id?: UniqueID) {
    if (prefixId) {
      this._id = id ?? UniqueID.create(prefixId);
    }

    this.props = props;
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id.equals(this._id)) {
      return true;
    }

    return false;
  }
}
