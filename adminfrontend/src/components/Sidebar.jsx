import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, List, ShoppingCart, X, Menu ,Percent, PackageSearch  ,BarChart2} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Categories", path: "/admin/categories", icon: List },
    { name: "Products", path: "/admin/products", icon: ShoppingCart },
    { name: "Coupons", path: "/admin/coupons", icon:Percent},
    { name: "Orders", path: "/admin/orders", icon:PackageSearch},
  { name: "Sales Report", path: "/admin/sales-report", icon: BarChart2 },
  { name: "Reviews", path: "/admin/reviews", icon: BarChart2 },
  ];

  return (
    <>
      {/* HAMBURGER BUTTON (mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
           w-64 p-5
          bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900
          text-white shadow-2xl
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 flex flex-col
        `}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold tracking-wide">
            SmartBazar
          </h1>

          {/* CLOSE BUTTON MOBILE */}
          <X
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* MENU */}
        <nav className="space-y-2 flex-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${active
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon size={18} />

                {item.name}

                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="ml-auto w-2 h-6 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2026 SmartBazar
        </p>
      </aside>
    </>
  );
};

export default Sidebar;