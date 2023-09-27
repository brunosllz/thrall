export class FindManyByUserIdMapper {
  static toDomain(notification: any) {
    return {
      id: notification.id,
      title: notification.title,
      linkTo: notification.linkTo,
      avatarFrom: notification.authorIdToUser.avatarUrl,
      ctaTitle: notification.ctaTitle,
      type: notification.type,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    };
  }
}
