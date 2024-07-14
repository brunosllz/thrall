import { AsyncMaybe } from '@/core/logic/types/Maybe';
import { Notification } from '@modules/notification/domain/entities/notification';

export abstract class NotificationsRepository {
  abstract findById(id: string): AsyncMaybe<Notification>;
  abstract create(notification: Notification): Promise<void>;
  abstract save(notification: Notification): Promise<void>;
}
