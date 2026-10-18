import Navbar, { NAV_LINKS } from "./Navbar";
import TeamSidebar from "./TeamSidebar";
import News from "./NewsSection";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";

const PageFallback = () => (
  <div className="space-y-4 p-4">
    <div className="h-8 w-48 rounded bg-surfaceTonal-a10 animate-pulse"></div>
    <div className="h-6 w-full rounded bg-surfaceTonal-a10 animate-pulse"></div>
    <div className="h-6 w-full rounded bg-surfaceTonal-a10 animate-pulse"></div>
  </div>
);

const Layout = () => {
  const [showTeamSidebar, setShowTeamSidebar] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowTeamSidebar(false);
    setShowMenu(false);
  }, [location.pathname]);

  return (
    <div className="h-[100dvh] flex flex-col bg-surface-a0 text-light-a0 overflow-hidden">
      <Navbar
        onToggleTeamSidebar={() => {
          setShowMenu(false);
          setShowTeamSidebar(!showTeamSidebar);
        }}
        onToggleMenu={() => {
          setShowTeamSidebar(false);
          setShowMenu(!showMenu);
        }}
      />

      {showMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-surface-a30 border-b border-surface-a40 p-3 flex flex-col gap-1 shadow-lg z-50">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-md px-3 py-2 font-semibold uppercase tracking-wide hover:bg-surface-a10 hover:text-primary-a10">
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="relative flex flex-1 min-h-0">
        {showTeamSidebar && (
          <div
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-30 bg-black/60"
            onClick={() => setShowTeamSidebar(false)}
            data-testid="sidebar-backdrop"
          />
        )}

        <aside
          className={`fixed top-16 bottom-0 left-0 z-40 w-72 max-w-[85vw] bg-surface-a10 transform transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 border-r border-surface-a40 ${showTeamSidebar ? "translate-x-0" : "-translate-x-full"}`}
        >
          <TeamSidebar />
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto bg-surface-a20 p-3 sm:p-5">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>

        <aside className="hidden xl:block w-80 shrink-0 overflow-y-auto no-scrollbar bg-surface-a30 border-l border-surface-a40 p-4">
          <News />
        </aside>
      </div>
    </div>
  );
};

export default Layout;
