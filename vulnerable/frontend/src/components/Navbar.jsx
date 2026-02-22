import React from 'react';
import { ShieldAlert, LogOut, LayoutDashboard, Home, Users } from 'lucide-react';

const Navbar = ({ user, setView, logout }) => {
  return (
    <div className="fb-navbar">
      <div className="nav-logo">
        <ShieldAlert size={32} />
        <span style={{cursor: 'pointer'}} onClick={() => setView('feed')}>VulnConnect</span>
      </div>
      
      <div className="nav-icons" style={{display: 'flex', gap: '40px', color: '#65676b'}}>
        <Home style={{cursor: 'pointer'}} onClick={() => setView('feed')} />
        <Users style={{cursor: 'pointer'}} />
      </div>

      <div className="nav-user">
        {user?.role === 'admin' && (
          <div onClick={() => setView('admin')} style={{cursor: 'pointer', color: '#ff0000', display: 'flex', alignItems: 'center', gap: '5px', marginRight: '20px'}}>
             <LayoutDashboard size={18}/> Admin
          </div>
        )}
        <div className="avatar" style={{width: '32px', height: '32px', fontSize: '14px'}}>{user?.username[0].toUpperCase()}</div>
        <span style={{marginRight: '15px'}}>{user?.username}</span>
        <LogOut size={20} style={{cursor: 'pointer', color: '#65676b'}} onClick={logout} />
      </div>
    </div>
  );
};

export default Navbar;
