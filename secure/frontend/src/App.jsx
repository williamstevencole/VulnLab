import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Post from './components/Post'
import AdminDashboard from './components/AdminDashboard'
import ProfileView from './components/ProfileView'
import { Home, LayoutDashboard, ShieldAlert, LogOut, User, Image, List, Smile, Calendar } from 'lucide-react'

function App() {
  const [view, setView] = useState('login')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [posts, setPosts] = useState([])
  const [usersList, setUsersList] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [status, setStatus] = useState('SYSTEM SECURE')
  const [formData, setFormData] = useState({ username: '', password: '', email: '' })
  const [newPostContent, setNewPostContent] = useState('')

  // Secure backend now runs on 3000 (uniform)
  const API_URL = `http://${window.location.hostname}:8080`

  useEffect(() => {
    if (user && token) fetchData()
  }, [user, token])

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [pRes, uRes, sRes] = await Promise.all([
        fetch(`${API_URL}/posts`, { headers }),
        fetch(`${API_URL}/users`, { headers }),
        fetch(`${API_URL}/users/stats`, { headers })
      ])
      if (pRes.status === 403 || uRes.status === 403) return logout();
      
      setPosts(await pRes.json())
      setUsersList(await uRes.json())
      setStats(await sRes.json())
    } catch (err) { console.error(err) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setStatus('VERIFYING CREDENTIALS...')
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('token', data.token)
        setView(data.user.role === 'admin' ? 'admin' : 'feed')
      } else { setStatus(data.message || 'Invalid Credentials') }
    } catch (err) { setStatus('Connection Error') }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.id, content: newPostContent })
      });
      setNewPostContent('');
      fetchData();
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setView('login');
  };

  const openProfile = (u) => {
    setSelectedProfile(u);
    setView('profile');
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-outer-box">
          <ShieldAlert size={50} color="#1d9bf0" />
          <h1 style={{fontSize: '32px', marginTop: '20px', marginBottom: '10px'}}>Secure Login</h1>
          <Login formData={formData} setFormData={setFormData} handleLogin={handleLogin} status={status} />
          <div className="vulnerability-alert" style={{borderColor: '#00ba7c', color: '#00ba7c'}}>
             SECURE_NOTICE: Protected by Prisma, JWT & Zod. <br/>
             Bypass attempt: <code>admin' --</code> (Will fail)
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 12px', marginBottom: '10px'}}>
          <ShieldAlert size={35} color="#00ba7c"/>
          <span style={{fontSize: '24px', fontWeight: 'bold'}}>SecureLab</span>
        </div>
        <div style={{height: '1px', background: '#2f3336', margin: '0 12px 15px 12px'}}></div>
        <div className={`nav-item ${view === 'feed' ? 'active' : ''}`} onClick={() => setView('feed')}><Home size={26}/> Home</div>
        {user.role === 'admin' && (
           <div className={`nav-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}><LayoutDashboard size={26}/> Admin Dashboard</div>
        )}
        <div className="nav-item" onClick={() => openProfile(user)}><User size={26}/> Profile</div>
        <div style={{marginTop: 'auto', marginBottom: '20px'}} className="nav-item" onClick={logout}><LogOut size={26}/> Log out</div>
      </div>

      <div className="main-content">
        {view === 'feed' && (
          <>
            <div className="page-header"><h3 style={{margin: 0}}>Secure Feed</h3></div>
            <div style={{padding: '15px', borderBottom: '1px solid #2f3336', display: 'flex', gap: '12px'}}>
               <div className="avatar" style={{minWidth: '40px', height: '40px', borderRadius: '50%', background: user.profile_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff'}}>{user.username[0].toUpperCase()}</div>
               <div style={{flex: 1}}>
                  <textarea 
                    placeholder="Post something securely..." 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    style={{width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', outline: 'none', resize: 'none', minHeight: '100px', fontFamily: 'inherit'}}
                  />
                  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                     <button onClick={handleCreatePost} disabled={!newPostContent.trim()} style={{background: '#1d9bf0', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer'}}>Post</button>
                  </div>
               </div>
            </div>
            {posts.map(p => <Post key={p.id} id={p.id} username={p.username} content={p.content} date={p.created_at} comment_count={p.comment_count} profile_color={p.profile_color} currentUser={user} isSecure={true} token={token} />)}
          </>
        )}
        {view === 'admin' && <AdminDashboard stats={stats} usersList={usersList} />}
        {view === 'profile' && <ProfileView user={selectedProfile} setView={setView} currentUser={user} isSecure={true} token={token} />}
      </div>

      <div style={{padding: '10px 20px'}}>
        <div style={{background: '#16181c', borderRadius: '16px', padding: '15px', marginTop: '10px'}}>
          <h3 style={{marginTop: 0, marginBottom: '20px'}}>Verified Users</h3>
          {usersList.map(u => (
            <div key={u.id} style={{display: 'flex', gap: '10px', marginBottom: '15px', cursor: 'pointer'}} onClick={() => openProfile(u)}>
              <div className="avatar" style={{minWidth: '40px', height: '40px', borderRadius: '50%', background: u.profile_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff'}}>{u.username[0].toUpperCase()}</div>
              <div>
                <div style={{fontWeight: 'bold', fontSize: '14px'}}>{u.username}</div>
                <div style={{color: '#71767b', fontSize: '13px'}}>@{u.username.toLowerCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
