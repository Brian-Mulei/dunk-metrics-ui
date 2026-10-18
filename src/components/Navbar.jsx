import { NavLink } from 'react-router-dom';

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/standings", label: "Standings" },
  { to: "/stats", label: "Stats" },
  { to: "/news", label: "News" },
];

const Navbar = ({ onToggleTeamSidebar, onToggleMenu }) => {
  return (
    <nav className="sticky top-0 z-50 h-16 shrink-0 bg-surface-a30 text-light-a0 px-3 sm:px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onToggleTeamSidebar} className="lg:hidden p-2 bg-dark-a0 text-primary-a20 rounded">☰ Teams</button>
        <h1 className="text-lg sm:text-xl text-primary-a20 whitespace-nowrap">Dunk Metrics</h1>
      </div>
      <div className="hidden md:flex space-x-6">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => (isActive ? "text-primary-a10" : "hover:text-primary-a10")}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <button onClick={onToggleMenu} className="md:hidden p-2 bg-dark-a0 text-primary-a20 rounded">☰ Menu</button>
    </nav>
  );
};

export default Navbar;
