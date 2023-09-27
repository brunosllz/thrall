import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { NewNotificationApplicationEvent } from '../../application/application-events/new-notification';
import { NotificationReadApplicationEvent } from '../../application/application-events/notification-read';
import { CountUnreadNotificationsByUserIdUseCase } from '../../application/use-cases/queries/count-unread-notifications-by-user-id';
import { FetchNotificationsByUserIdUseCase } from '../../application/use-cases/queries/fetch-notifications-by-user-id';
import { CountUnreadNotificationsEventEmit } from './events-emit/count-unread-notifications-event-emit';
import { GetNotificationsEventEmit } from './events-emit/get-notifications-event-emit';
import { NewNotificationCreatedEventEmit } from './events-emit/new-notification-created';
import { NotificationReadEventEmit } from './events-emit/notification-read-event-emit';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUserClients: Array<Record<string, { userId: string }>> = [];

  constructor(
    private readonly countUnreadNotificationsByUserIdUseCase: CountUnreadNotificationsByUserIdUseCase,
    private readonly fetchNotificationsByUserIdUseCase: FetchNotificationsByUserIdUseCase,
    private readonly jwtService: JwtService,
  ) {}

  private async validateToken(
    client: Socket,
  ): Promise<{ userId: string } | null> {
    let userId = '';

    const bearerToken = client.handshake.headers.authorization;
    const AuthToken: string = client.handshake.auth.token;

    if (!bearerToken && !AuthToken) {
      return null;
    }

    if (bearerToken) {
      try {
        const JWT = bearerToken.split(' ')[1];
        const { uid } = await this.jwtService.verifyAsync<{ uid: string }>(JWT);

        userId = uid;
      } catch (error) {
        throw new WsException('Invalid token');
      }
    } else if (AuthToken) {
      try {
        const { uid } = await this.jwtService.verifyAsync<{ uid: string }>(
          AuthToken,
        );

        userId = uid;
      } catch (error) {
        throw new WsException('Invalid token');
      }
    }

    return { userId };
  }

  async handleConnection(client: Socket) {
    // validate token
    const isValidToken = await this.validateToken(client);

    // if token is invalid, disconnect
    if (!isValidToken) {
      return client.disconnect();
    }

    const { userId } = isValidToken;

    // save connection in database
    // this.connectedUsers.push({ userId });
    this.connectedUserClients.push({ [client.id]: { userId } });

    // get amount of notifications from user
    const [resultNotificationsAmount, resultNotifications] = await Promise.all([
      this.countUnreadNotificationsByUserIdUseCase.execute({
        userId: userId,
      }),
      this.fetchNotificationsByUserIdUseCase.execute({
        userId: userId,
        pageIndex: 1,
        pageSize: 3,
      }),
    ]);

    if (resultNotificationsAmount.isLeft() || resultNotifications.isLeft()) {
      const error = resultNotificationsAmount.value;

      switch (error.constructor) {
        default:
          return;
      }
    }

    const notificationsAmount = resultNotificationsAmount.value.getValue();
    const notifications = resultNotifications.value.getValue();

    // return amount of notifications to user
    this.server.to(client.id).emit(
      'count-unread-notifications',
      new CountUnreadNotificationsEventEmit({
        count: notificationsAmount,
      }),
    );

    //TODO: Create a mapper for the notification
    this.server.to(client.id).emit(
      'notifications',
      new GetNotificationsEventEmit({
        notifications,
      }),
    );
  }

  handleDisconnect(client: Socket) {
    const connectedUserClientIndex = this.connectedUserClients.findIndex(
      (connectedUser) => connectedUser[client.id],
    );

    this.connectedUserClients.splice(connectedUserClientIndex, 1);
  }

  @OnEvent('notification:answer-created', { async: true })
  async handleNewNotificationEmit({
    payload,
  }: NewNotificationApplicationEvent) {
    const notification = payload;

    const connectedClientsFromUser = this.connectedUserClients.filter(
      (connectedClient) => {
        return (
          Object.values(connectedClient)[0].userId === notification.recipientId
        );
      },
    );

    const hasConnectedClients = connectedClientsFromUser.length > 0;

    if (hasConnectedClients) {
      const connectedClients = Object.values({ ...connectedClientsFromUser });

      Array.from({ length: connectedClients.length }).forEach((_, index) => {
        const connectedClient = connectedClients[index];
        const clientId = Object.keys(connectedClient);

        this.server.to(clientId[0]).emit(
          'new-notification-created',
          new NewNotificationCreatedEventEmit({
            notification,
          }),
        );
      });
    }
  }

  @OnEvent('notification:read', { async: true })
  async handleNotificationReadEmit({
    payload,
  }: NotificationReadApplicationEvent) {
    const { notificationId, occurredAt, recipientId } = payload;

    const connectedClientsFromUser = this.connectedUserClients.filter(
      (connectedClient) => {
        return Object.values(connectedClient)[0].userId === recipientId;
      },
    );

    const hasConnectedClients = connectedClientsFromUser.length > 0;

    if (hasConnectedClients) {
      const connectedClients = Object.values({ ...connectedClientsFromUser });

      Array.from({ length: connectedClients.length }).forEach((_, index) => {
        const connectedClient = connectedClients[index];
        const clientId = Object.keys(connectedClient);

        this.server.to(clientId[0]).emit(
          'notification-read',
          new NotificationReadEventEmit({
            notificationId,
            occurredAt,
          }),
        );
      });
    }
  }
}
