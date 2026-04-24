/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationPageResponse {
  content: NotificationItem[];
  totalPages: number;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  loadMore: () => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchNotifications = useCallback(async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll(pageNum, 20);
      const data = res.data as NotificationPageResponse;

      if (pageNum === 0) {
        setNotifications(data.content || []);
      } else {
        setNotifications((prev) => [...prev, ...(data.content || [])]);
      }

      setTotalPages(data.totalPages || 0);
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      setUnreadCount((res.data?.count as number) ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setPage(0);
      setTotalPages(0);
      return;
    }

    void fetchNotifications(0);
    void fetchUnreadCount();

    const interval = setInterval(() => {
      void fetchNotifications(0);
      void fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  const markAsRead = useCallback(async (id: number) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target && !target.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== id);
    });

    await notificationApi.deleteNotification(id);
  }, []);

  const loadMore = useCallback(() => {
    if (page + 1 < totalPages) {
      void fetchNotifications(page + 1);
    }
  }, [page, totalPages, fetchNotifications]);

  const refresh = useCallback(() => {
    void fetchNotifications(0);
    void fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      hasMore: page + 1 < totalPages,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      loadMore,
      refresh,
    }),
    [notifications, unreadCount, loading, page, totalPages, markAsRead, markAllAsRead, deleteNotification, loadMore, refresh]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }
  return ctx;
}
