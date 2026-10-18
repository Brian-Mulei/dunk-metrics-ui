import { NavLink } from 'react-router-dom';

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/standings", label: "Standings" },
  { to: "/stats", label: "Stats" },
  { to: "/news", label: "News" },
];

const Navbar = ({ onToggleTeamSidebar, onToggleMenu }) => {
  return (
    <nav className="sticky top-0 z-50 h-16 shrink-0 bg-surface-a30 text-light-a0 px-3 sm:px-4 flex items-center justify-between border-b-2 border-primary-a0">
      <div className="flex items-center gap-3">
        <button onClick={onToggleTeamSidebar} className="lg:hidden px-3 py-1.5 rounded-md border border-surface-a40 bg-surface-a10 text-sm font-semibold">Teams</button>
        <NavLink to="/" className="font-display text-2xl font-extrabold uppercase tracking-wide whitespace-nowrap">
          Dunk<span className="text-primary-a0">Metrics</span>
        </NavLink>
      </div>
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => `rounded-md px-3 py-1.5 font-semibold uppercase tracking-wide text-sm transition-colors ${isActive ? "bg-primary-a0 text-dark-a0" : "text-light-a0 hover:text-primary-a10"}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <button onClick={onToggleMenu} className="md:hidden px-3 py-1.5 rounded-md border border-surface-a40 bg-surface-a10 text-sm font-semibold">Menu</button>
    </nav>
  );
};

export default Navbar;
