import { randomUUID } from 'crypto';

export abstract class Entity<Props> {
  private _id: string;
  protected props: Props;

  get id() {
    return this._id;
  }
  //TODO: maybe create a class then manage ids for all classes and implement validation on this class -> UUIDEntity
  protected constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID();
    this.props = props;
  }
}
