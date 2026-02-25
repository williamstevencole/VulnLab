import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Mail, Shield } from 'lucide-react';
import Post from './Post';

const ProfileView = ({ user, setView, currentUser, isSecure, token }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://${window.location.hostname}:8080`;

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const headers = isSecure ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/users/${user.id}/posts`, { headers });
      const data = await res.json();
      setUserPosts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div>
      <div className="page-header" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
        <ArrowLeft style={{cursor: 'pointer'}} onClick={() => setView('feed')} />
        <div>
           <div style={{fontWeight: 'bold', fontSize: '18px'}}>{user.username}</div>
           <div style={{color: '#71767b', fontSize: '13px'}}>{userPosts.length} Posts</div>
        </div>
      </div>
      
      <div className="profile-banner"></div>
      <div className="profile-avatar-large" style={{background: user.profile_color, color: '#fff'}}>
        {user.username[0].toUpperCase()}
      </div>
      
      <div style={{padding: '15px'}}>
        <h2 style={{margin: 0}}>{user.username}</h2>
        <div style={{color: '#71767b', marginBottom: '15px'}}>@{user.username.toLowerCase()}</div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', color: '#71767b'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Shield size={16}/> {user.role.toUpperCase()} ACCESS LEVEL</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Mail size={16}/> {user.email || 'no-email@vuln.lab'}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Calendar size={16}/> Joined February 2026</div>
        </div>
      </div>
      
      <div style={{borderBottom: '1px solid #2f3336', display: 'flex', marginTop: '20px'}}>
         <div style={{padding: '15px 30px', borderBottom: '4px solid #1d9bf0', fontWeight: 'bold'}}>Posts</div>
         <div style={{padding: '15px 30px', color: '#71767b'}}>Replies</div>
         <div style={{padding: '15px 30px', color: '#71767b'}}>Media</div>
         <div style={{padding: '15px 30px', color: '#71767b'}}>Likes</div>
      </div>

      <div className="user-posts">
        {loading ? (
          <div style={{padding: '40px', textAlign: 'center', color: '#71767b'}}>Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div style={{padding: '40px', textAlign: 'center', color: '#71767b'}}>No posts from this user yet.</div>
        ) : (
          userPosts.map(p => (
            <Post 
              key={p.id} 
              id={p.id} 
              username={p.username} 
              content={p.content} 
              date={p.created_at} 
              comment_count={p.comment_count} 
              profile_color={p.profile_color} 
              currentUser={currentUser} 
              isSecure={isSecure}
              token={token}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileView;
