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
  const [posts, setPosts] = useState([])
  const [usersList, setUsersList] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [status, setStatus] = useState('SYSTEM READY')
  const [formData, setFormData] = useState({ username: '', password: '', email: '' })
  const [newPostContent, setNewPostContent] = useState('')

  const API_URL = `http://${window.location.hostname}:3000`

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [pRes, uRes, sRes] = await Promise.all([
        fetch(`${API_URL}/posts`),
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/users/stats`)
      ])
      setPosts(await pRes.json())
      setUsersList(await uRes.json())
      setStats(await sRes.json())
    } catch (err) { console.error(err) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setStatus('ATTEMPTING ACCESS...')
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        setView(data.user.role === 'admin' ? 'admin' : 'feed')
      } else { setStatus('Invalid Credentials') }
    } catch (err) { setStatus('Connection Error') }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content: newPostContent })
      });
      if (res.ok) {
        setNewPostContent('');
        fetchData();
      }
    } catch (err) { console.error(err); }
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
          <h1 style={{fontSize: '32px', marginTop: '20px', marginBottom: '10px'}}>{view === 'signup' ? 'Join VulnLab' : 'Log in to VulnLab'}</h1>
          {view === 'signup' ? (
            <Signup formData={formData} setFormData={setFormData} handleSignup={async (e) => {
              e.preventDefault();
              await fetch(`${API_URL}/signup`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData) });
              setView('login');
              setStatus('User created. Please log in.');
            }} />
          ) : (
            <Login formData={formData} setFormData={setFormData} handleLogin={handleLogin} status={status} />
          )}
          <div style={{marginTop: '25px', fontSize: '15px', color: '#71767b'}}>
            {view === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <span style={{color: '#1d9bf0', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setView(view === 'signup' ? 'login' : 'signup')}>
              {view === 'signup' ? 'Log in' : 'Sign up'}
            </span>
          </div>
          <div className="vulnerability-alert">VULN_NOTICE: Bypass: <code>admin' --</code></div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 12px', marginBottom: '10px'}}>
          <ShieldAlert size={35} color="#e7e9ea"/>
          <span style={{fontSize: '24px', fontWeight: 'bold'}}>VulnLab</span>
        </div>
        
        <div style={{height: '1px', background: '#2f3336', margin: '0 12px 15px 12px'}}></div>

        <div className={`nav-item ${view === 'feed' ? 'active' : ''}`} onClick={() => setView('feed')}><Home size={26}/> Home</div>
        {user.role === 'admin' && (
           <div className={`nav-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}><LayoutDashboard size={26}/> Admin Dashboard</div>
        )}
        <div className={`nav-item ${view === 'profile' && selectedProfile?.id === user.id ? 'active' : ''}`} onClick={() => openProfile(user)}><User size={26}/> Profile</div>
        <div style={{marginTop: 'auto', marginBottom: '20px'}} className="nav-item" onClick={() => setUser(null)}><LogOut size={26}/> Log out</div>
      </div>

      <div className="main-content">
        {view === 'feed' && (
          <>
            <div className="page-header"><h3 style={{margin: 0}}>Home</h3></div>
            {/* Create Post Area */}
            <div style={{padding: '15px', borderBottom: '1px solid #2f3336', display: 'flex', gap: '12px'}}>
               <div className="avatar" style={{minWidth: '40px', height: '40px', borderRadius: '50%', background: user.profile_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff'}}>{user.username[0].toUpperCase()}</div>
               <div style={{flex: 1}}>
                  <textarea 
                    placeholder="What is happening?!" 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    style={{width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', outline: 'none', resize: 'none', minHeight: '100px', fontFamily: 'inherit'}}
                  />
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2f3336', paddingTop: '10px'}}>
                     <div style={{display: 'flex', gap: '15px', color: '#1d9bf0'}}>
                        <Image size={18}/> <List size={18}/> <Smile size={18}/> <Calendar size={18}/>
                     </div>
                     <button 
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                        style={{background: '#1d9bf0', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '9999px', fontWeight: 'bold', cursor: 'pointer', opacity: newPostContent.trim() ? 1 : 0.5}}
                     >
                        Post
                     </button>
                  </div>
               </div>
            </div>
            {posts.map(p => <Post key={p.id} id={p.id} username={p.username} content={p.content} date={p.created_at} comment_count={p.comment_count} profile_color={p.profile_color} currentUser={user} />)}
          </>
        )}
        {view === 'admin' && <AdminDashboard stats={stats} usersList={usersList} />}
        {view === 'profile' && <ProfileView user={selectedProfile} setView={setView} currentUser={user} />}
      </div>

      <div style={{padding: '10px 20px'}}>
        <div style={{background: '#16181c', borderRadius: '16px', padding: '15px', marginTop: '10px', maxHeight: '80vh', overflowY: 'auto'}}>
          <h3 style={{marginTop: 0, marginBottom: '20px', position: 'sticky', top: 0, background: '#16181c', paddingBottom: '10px'}}>Who to follow</h3>
          {usersList.map(u => (
            <div key={u.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', cursor: 'pointer'}} onClick={() => openProfile(u)}>
              <div style={{display: 'flex', gap: '10px'}}>
                <div className="avatar" style={{minWidth: '40px', height: '40px', borderRadius: '50%', background: u.profile_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff'}}>{u.username[0].toUpperCase()}</div>
                <div>
                  <div style={{fontWeight: 'bold', fontSize: '14px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{u.username}</div>
                  <div style={{color: '#71767b', fontSize: '13px'}}>@{u.username.toLowerCase()}</div>
                </div>
              </div>
              <div style={{background: '#e7e9ea', color: '#000', padding: '6px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: 'bold'}}>Follow</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
