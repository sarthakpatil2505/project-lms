'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  Compass, 
  User, 
  Settings, 
  ShieldCheck, 
  CheckCheck,
  ExternalLink 
} from 'lucide-react';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export function DashboardHeader({
  userName = 'Student',
  userRole = 'student',
  avatarUrl,
}: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-80 max-w-full hidden sm:block">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search modules, assignments, topics..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Explore Catalog shortcut */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-brand-400" />
          <span>Catalog</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-slate-900" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No new notifications. You are all caught up!
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 hover:bg-slate-800/50 transition-colors ${
                        !notif.is_read ? 'bg-brand-950/20' : ''
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{notif.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{notif.message}</div>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="inline-flex items-center gap-1 text-[11px] text-brand-400 mt-2 hover:underline"
                        >
                          View <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-white leading-tight">{userName}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                {userRole}
              </div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{userName}</p>
                <p className="text-[10px] text-slate-400 capitalize">{userRole} Account</p>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                Profile Settings
              </Link>
              <Link
                href="/dashboard/certificates"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Certificates &amp; Transcripts
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Preferences
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
