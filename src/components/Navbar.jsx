import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleTeamSidebar,  onToggleMenu }) => {
  return (
    

<nav className="sticky top-0 z-50 bg-surface-a30 text-light-a0 p-4 flex items-center justify-between">
<div className="flex items-center space-x-4">
  <button onClick={onToggleTeamSidebar} className="md:hidden p-2 bg-dark-a0 text-primary-a20  rounded">☰ Teams</button>
  <h1 className="text-xl text-primary-a20  ">Dunk Metrics</h1>
</div>
<div className="hidden md:flex space-x-6">
  <Link to="/" className="hover:text-primary-a10">Home</Link>
  <Link to="/standings" className="hover:text-primary-a10">Standings</Link>
  <Link to="/news" className="hover:text-primary-a10">News</Link>
  {/* <Link to="/news" className="hover:text-primary-a10">News</Link> */}
</div>
<button onClick={onToggleMenu} className="md:hidden p-2 bg-dark-a0 text-primary-a20  rounded">☰ Menu</button>
</nav>
  );
};

export default Navbar;