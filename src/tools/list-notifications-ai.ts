import { KaneoAPI } from "../api/kaneo";

type Input = {
    /**
     * Set to true to return unread notifications only.
     */
    unreadOnly?: boolean;
};

/**
 * Lists Kaneo notifications.
 */
export default async function listNotificationsAI(
    input: Input = {},
) {
    const api = new KaneoAPI();
    const notifications = await api.getNotifications();

    return notifications
        .filter((notification) =>
            input.unreadOnly ? notification.isRead === false : true,
        )
        .map((notification) => ({
            id: notification.id,
            title: notification.title ?? null,
            message: notification.content ?? null,
            read: notification.isRead ?? false,
            createdAt: notification.createdAt ?? null,
        }));
}