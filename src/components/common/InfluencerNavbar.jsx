import { NavLink } from "react-router-dom";

export default function InfluencerNavbar({ tokens }) {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 border-b border-blue-700/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* TITLE */}
        <h1 className="text-xl font-bold tracking-wide text-blue-300">
          Influencer Panel
        </h1>

        {/* LINKS */}
        <div className="flex items-center gap-8 text-sm font-medium text-slate-200">
          <NavLink to="/influencer" end className={({ isActive }) =>
            isActive ? "text-blue-300 border-b-2 border-blue-300 pb-1"
            : "hover:text-blue-300 transition pb-1"
          }>
            Campaigns
          </NavLink>

          <NavLink to="/influencer/chats" className={({ isActive }) =>
            isActive ? "text-blue-300 border-b-2 border-blue-300 pb-1"
            : "hover:text-blue-300 transition pb-1"
          }>
            My Chats
          </NavLink>

          <NavLink to="/influencer/profile" className={({ isActive }) =>
            isActive ? "text-blue-300 border-b-2 border-blue-300 pb-1"
            : "hover:text-blue-300 transition pb-1"
          }>
            Profile
          </NavLink>

          <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-semibold shadow-md shadow-blue-500/40 border border-blue-400">
            {tokens} Tokens
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
