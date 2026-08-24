"use client";

import { useQuery, useMutation } from "convex/react";
import {
  NotificationBell,
  type Notification,
} from "@/components/notification-bell";
import { api } from "@/lib/convex-api";

export function NotificationCenter() {
  const notifications = (useQuery(api.notifications.list, {
    targetApp: "web",
  }) ?? []) as Notification[];
  const user = useQuery(api.users.current);
  const markAsRead = useMutation(api.notifications.markAsRead);

  // Calculate unread count based on user's last read time
  // If user is not logged in, show all as unread or 0?
  // Usually 0 or local storage. For now, 0 if no user, or just calc standard.
  // If user is undefined (loading), 0. If null (logged out), 0.
  const lastRead = user?.lastNotificationReadTime ?? 0;
  const unreadCount = notifications.filter(
    (n) => n.createdAt > lastRead,
  ).length;

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={() => markAsRead()}
    />
  );
}
