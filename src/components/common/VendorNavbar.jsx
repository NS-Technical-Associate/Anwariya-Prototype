import { NavLink } from "react-router-dom";

export default function VendorNavbar() {
  const linkClass = ({ isActive }) =>
    `text-sm transition-all duration-200 ${
      isActive
        ? "font-semibold text-blue-400 border-b-2 border-blue-400 pb-1"
        : "text-gray-300 hover:text-blue-400"
    }`;

  return (
    <div className="relative overflow-hidden">
      {/* LEFT SHINE */}
      <div className="absolute left-0 top-0 h-full w-32 
        bg-gradient-to-r from-blue-500/30 via-blue-400/15 to-transparent
        pointer-events-none"
      />

      {/* RIGHT SHINE */}
      <div className="absolute right-0 top-0 h-full w-40 
        bg-gradient-to-l from-blue-600/30 via-blue-500/15 to-transparent
        pointer-events-none"
      />

      {/* NAVBAR */}
      <div
        className="relative flex justify-between items-center px-8 py-4
        bg-gradient-to-r from-black via-gray-900 to-blue-900
        shadow-xl border-b border-blue-800/40 backdrop-blur-md"
      >
        {/* BRAND */}
        <h1 className="
          font-extrabold text-lg tracking-wide
          bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500
          bg-clip-text text-transparent
          drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]
        ">
          Vendor Panel
        </h1>

        {/* NAV LINKS */}
        <div className="flex gap-6 items-center">
          <NavLink to="/vendor/home" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/vendor/create" className={linkClass}>
            Create Post
          </NavLink>

          <NavLink to="/vendor/chats" className={linkClass}>
            Chats
          </NavLink>

          <NavLink to="/vendor/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/vendor/products" className={linkClass}>
            Products
          </NavLink>

          <NavLink to="/vendor/billing" className={linkClass}>
            Billing
          </NavLink>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("role");
              localStorage.removeItem("tokens");
              window.location.href = "/login";
            }}
            className="text-sm px-4 py-1.5 rounded-md
              text-red-400 border border-red-500/40
              hover:bg-red-500 hover:text-white
              transition-all duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}