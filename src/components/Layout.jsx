import Navbar from "./Navbar";
import TeamSidebar from "./TeamSidebar";
import News from "./NewsSection";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Link } from 'react-router-dom';

const Layout = () => {
  const [showTeamSidebar, setShowTeamSidebar] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  return (
   


    <div className="h-screen flex flex-col bg-surface-a0 text-light-a0 overflow-hidden">
  {/* Top Navbar */}
  <Navbar
    onToggleTeamSidebar={() => setShowTeamSidebar(!showTeamSidebar)}
    onToggleMenu={() => setShowMenu(!showMenu)}

    
  />

  {showMenu && (
    <div className="md:hidden absolute top-16 left-0 w-full bg-surface-a30 p-4 flex flex-col space-y-2 shadow-lg z-50">
      <Link to="/" className="hover:text-primary-a10" onClick={() => setShowMenu(false)}>Home</Link>
      <Link to="/standings" className="hover:text-primary-a10" onClick={() => setShowMenu(false)}>Standings</Link>
      <Link to="/news" className="hover:text-primary-a10" onClick={() => setShowMenu(false)}>News</Link>
    </div>
  )}

  {/* Main Content (Three-Column Layout) */}
  <div className="flex flex-grow overflow-hidden">
    {/* Left Sidebar (Teams List) */}
    <div className={`fixed inset-y-0 left-0 w-64 bg-surface-a10 p-4 transform transition-transform duration-300 md:relative md:w-1/6 md:block ${showTeamSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}> 
      <TeamSidebar  onToggleTeamSidebar={() => setShowTeamSidebar(!showTeamSidebar)}/>
    </div>

    {/* Middle Section (Page Content) */}
    <div className={`flex-1 bg-surface-a20 p-4 overflow-hidden ${showTeamSidebar || showNews ? "md:w-4/6" : "w-full"}`}>
      <Outlet />
    </div>

    {/* Right Sidebar (Trending News) */}
    <div className={`fixed inset-y-0 right-0 w-64 bg-surface-a10 p-4 transform transition-transform duration-300 md:relative md:w-1/6 md:block ${showNews ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}>
      <News />
    </div>
  </div>
</div>
  );
};

export default Layout;
