import React from 'react';
import { Database, LayoutDashboard } from 'lucide-react';

const AdminDashboard = ({ stats, usersList }) => {
  if (!stats) return <div style={{padding: '20px'}}>SYNCHRONIZING_DATABASE...</div>;

  return (
    <div className="admin-container">
      <div className="page-header">
        <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
           <LayoutDashboard size={20}/> SYSTEM_ADMIN_OVERRIDE
        </h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">TOTAL_IDENTITIES</div>
          <div className="value">{stats.totals.users}</div>
        </div>
        <div className="stat-card">
          <div className="label">TOTAL_POSTS</div>
          <div className="value">{stats.totals.posts}</div>
        </div>
        <div className="stat-card">
          <div className="label">LOGGED_COMMENTS</div>
          <div className="value">{stats.totals.comments}</div>
        </div>
      </div>

      <div style={{padding: '0 20px 20px 20px'}}>
        <div style={{background: '#16181c', border: '1px solid #2f3336', borderRadius: '16px', overflow: 'hidden'}}>
          <div style={{padding: '15px', borderBottom: '1px solid #2f3336', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Database size={16}/> DATABASE_USER_DUMP
          </div>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>USERNAME</th><th>ROLE</th><th>EMAIL</th></tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '50%', background: u.profile_color}}></div>
                    {u.username}
                  </td>
                  <td>
                     <span style={{
                         background: u.role === 'admin' ? 'rgba(244,33,46,0.1)' : 'rgba(0,186,124,0.1)',
                         color: u.role === 'admin' ? '#f4212e' : '#00ba7c',
                         padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                     }}>
                        {u.role.toUpperCase()}
                     </span>
                  </td>
                  <td style={{color: '#71767b'}}>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
