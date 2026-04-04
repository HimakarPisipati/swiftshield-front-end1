import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Shield, TrendingUp, Bell, User, PlusCircle, LogOut, Mail, Settings as SettingsIcon } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "Claim Approved", body: "Your weather disruption claim has been auto-approved.", time: "2 min ago", read: false, icon: "✅" },
    { id: 2, title: "Payout Processed", body: "₹80 has been transferred to your UPI account.", time: "15 min ago", read: false, icon: "💸" },
    { id: 3, title: "New Policy Available", body: "Premium Shield plan is now available in your area.", time: "1 hr ago", read: false, icon: "🛡️" },
    { id: 4, title: "Claim Submitted", body: "Your failed delivery claim is under review.", time: "3 hrs ago", read: true, icon: "📋" },
    { id: 5, title: "Risk Alert", body: "High-risk weather detected in your current zone.", time: "Yesterday", read: true, icon: "⚠️" },
  ]);

  const isLanding = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/pricing") ||
    location.pathname.startsWith("/claims") ||
    location.pathname.startsWith("/insights") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/submit-claim") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/about");

  useEffect(() => {
    const workerId = localStorage.getItem('workerId');
    if (workerId && !isLanding && !user) {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      fetch(`${apiUrl}/api/worker/profile/${workerId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser({
              name: data.worker.name,
              email: data.worker.email
            });
          }
        })
        .catch(err => console.error("Error fetching user profile:", err));
    }
  }, [location.pathname, isLanding, user]);

  // Handle click outside to close profile / notification dropdowns
  useEffect(() => {
    if (!showProfile && !showNotifications) return;
    const handleClickOutside = () => {
      setShowProfile(false);
      setShowNotifications(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showProfile, showNotifications]);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/claims", icon: FileText, label: "Claims" },
    { path: "/submit-claim", icon: PlusCircle, label: "Submit Claim" },
    { path: "/pricing", icon: Shield, label: "Policies" },
    { path: "/insights", icon: TrendingUp, label: "Risk Insights" },
    { path: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      {!isLanding && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <Link to="/about" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm overflow-hidden border border-gray-100">
                <img src="/favicon.png" alt="SwiftShield Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-[#1E3A8A] tracking-tight">SwiftShield</span>
            </Link>

            {isDashboard && (
              <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                    className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative group"
                  >
                    <Bell className={`w-5 h-5 transition-colors ${showNotifications ? 'text-[#1E3A8A]' : 'text-gray-500 group-hover:text-[#1E3A8A]'}`} />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1E3A8A]/5 to-[#14B8A6]/5">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Notifications</p>
                          <p className="text-xs text-gray-500">{notifications.filter(n => !n.read).length} unread</p>
                        </div>
                        {notifications.some(n => !n.read) && (
                          <button
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                            className="text-xs font-semibold text-[#1E3A8A] hover:text-[#14B8A6] transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                        {notifications.map(n => (
                          <button
                            key={n.id}
                            onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
                            className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!n.read ? 'bg-blue-50/40' : ''}`}
                          >
                            <span className="text-xl mt-0.5 flex-shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <p className={`text-sm font-semibold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                                {!n.read && <span className="w-2 h-2 bg-[#F97316] rounded-full flex-shrink-0"></span>}
                              </div>
                              <p className="text-xs text-gray-500 leading-snug">{n.body}</p>
                              <p className="text-[10px] text-gray-400 mt-1 font-medium">{n.time}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 px-5 py-3 text-center">
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-xs font-semibold text-[#1E3A8A] hover:text-[#14B8A6] transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                    className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">
                        {user?.name || "Profile"}
                      </p>
                      <p className="text-[10px] text-gray-500 leading-none">Registered Account</p>
                    </div>
                  </button>

                  {/* Profile Tooltip/Dropdown */}
                  {showProfile && user && (
                    <div className="absolute right-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-5 bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                            <User className="w-6 h-6 text-[#1E3A8A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900 truncate">{user.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-[#14B8A6] font-medium uppercase tracking-wider">
                              <CheckCircle className="w-3 h-3" />
                              Verified Partner
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl shadow-sm border border-gray-50 group transition-colors hover:border-[#1E3A8A]/20">
                            <div className="w-8 h-8 bg-[#F8FAFC] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E3A8A]/5">
                              <Mail className="w-4 h-4 text-gray-400 group-hover:text-[#1E3A8A]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Email Address</p>
                              <p className="text-sm text-gray-700 truncate font-medium">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => {
                            localStorage.removeItem('workerId');
                            setUser(null);
                            navigate("/");
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-red-600 hover:bg-red-50 group hover:shadow-sm"
                        >
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {isDashboard && (
          <aside className="w-64 bg-white border-r border-gray-100 h-[calc(100vh-73px)] sticky top-[73px] flex flex-col overflow-y-auto">
            <nav className="p-4 space-y-1.5 flex-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                      ? "bg-[#1E3A8A] text-white shadow-md shadow-blue-900/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#1E3A8A]"
                      }`}
                  >
                    <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#1E3A8A]'}`} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
