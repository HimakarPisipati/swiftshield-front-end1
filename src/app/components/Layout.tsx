import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Shield, TrendingUp, Bell, User, PlusCircle, LogOut, Mail, Settings as SettingsIcon } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const isLanding = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard") ||
                      location.pathname.startsWith("/pricing") ||
                      location.pathname.startsWith("/claims") ||
                      location.pathname.startsWith("/insights") ||
                      location.pathname.startsWith("/admin") ||
                      location.pathname.startsWith("/submit-claim") ||
                      location.pathname.startsWith("/settings");

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

  // Handle click outside to close profile dropdown
  useEffect(() => {
    if (!showProfile) return;
    const handleClickOutside = () => setShowProfile(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showProfile]);

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
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm overflow-hidden border border-gray-100">
                <img src="/favicon.png" alt="SwiftShield Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-[#1E3A8A] tracking-tight">SwiftShield</span>
            </Link>

            {isDashboard && (
              <div className="flex items-center gap-6">
                <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative group">
                  <Bell className="w-5 h-5 text-gray-500 group-hover:text-[#1E3A8A]" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F97316] rounded-full border-2 border-white"></span>
                </button>
                
                <div 
                  className="relative"
                  onClick={(e) => e.stopPropagation()} // Prevent auto-close when clicking inside
                >
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                      isActive
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
