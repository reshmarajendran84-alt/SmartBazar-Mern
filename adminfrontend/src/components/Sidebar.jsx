import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, List, ShoppingCart, X, Menu, Percent, 
  PackageSearch, BarChart2, Star, RefreshCw, Users, 
  LogOut, ChevronLeft, ChevronRight
,Image } from "lucide-react";
import { useState, useEffect } from "react";
import { adminLogout } from "../utils/adminLogout";

const Sidebar = ({ open, setOpen }) => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setOpen]);

  // Auto collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(false);
    }
  }, [isMobile]);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Categories", path: "/admin/categories", icon: List },
    { name: "Products", path: "/admin/products", icon: ShoppingCart },
    { name: "Orders", path: "/admin/orders", icon: PackageSearch },
    { name: "Coupons", path: "/admin/coupons", icon: Percent },
    { name: "Returns", path: "/admin/returns", icon: RefreshCw },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Sales Report", path: "/admin/sales-report", icon: BarChart2 },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Banners", path: "/admin/banners", icon: Image  },
  ];

  const isActive = (path) => {
    if (path === "/admin" && pathname === "/admin") return true;
    if (path !== "/admin" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative top-0 left-0 z-50 
          bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900
          text-white shadow-2xl flex flex-col
          transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed && !isMobile ? "w-20" : "w-64"}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-700/50 ${collapsed && !isMobile ? "justify-center" : ""} ${open ? "justify-between" : ""}`}>
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                SmartBazar
              </h1>
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xs">SB</span>
            </div>
          )}
          
          {/* Desktop Collapse Button */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          <X
            className="md:hidden cursor-pointer hover:text-indigo-400 transition-colors"
            onClick={() => setOpen(false)}
            size={20}
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (isMobile) setOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group relative
                  ${active
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }
                  ${collapsed && !isMobile ? "justify-center" : ""}
                `}
                title={collapsed && !isMobile ? item.name : ""}
              >
                <Icon size={18} className={`${active ? "text-white" : "group-hover:text-indigo-400"} flex-shrink-0`} />
                
                {(!collapsed || isMobile) && <span className="truncate">{item.name}</span>}
                
                {active && !collapsed && !isMobile && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                )}
                
                {active && collapsed && !isMobile && (
                  <span className="absolute right-0 w-1 h-8 bg-indigo-400 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-gray-700/50 space-y-3 ${collapsed && !isMobile ? "flex flex-col items-center" : ""}`}>
          <button
            onClick={adminLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-200
              ${collapsed && !isMobile ? "justify-center" : ""}
            `}
            title={collapsed && !isMobile ? "Logout" : ""}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
          
          {(!collapsed || isMobile) && (
            <p className="text-xxs text-gray-500 text-center">
              © 2025 SmartBazar
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;