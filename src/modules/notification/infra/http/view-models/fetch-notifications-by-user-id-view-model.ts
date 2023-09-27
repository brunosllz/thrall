export class FetchNotificationsByUserIdViewModel {
  static toHTTP(data: any) {
    return {
      id: data.id,
      title: data.title,
      createdAt: data.createdAt,
      readAt: data.readAt,
      linkTo: data.linkTo,
      ctaTitle: data.ctaTitle,
      type: data.type,
      avatarFrom: data.authorIdToUser.avatarUrl,
    };
  }
}
