import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Repeat2, Send } from 'lucide-react';

const Post = ({ id, username, content, date, comment_count, profile_color, currentUser, isSecure, token }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Secure backend runs on 3000
  const API_URL = `http://${window.location.hostname}:3000`;

  const fetchComments = async () => {
    setLoading(true);
    try {
      const headers = isSecure ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/posts/${id}/comments`, { headers });
      const data = await res.json();
      setComments(data);
    } catch (err) { console.error("Error fetching comments:", err); }
    setLoading(false);
  };

  const toggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (isSecure) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/posts/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          post_id: id, 
          user_id: currentUser.id, 
          comment_text: newComment 
        })
      });
      
      if (res.ok) {
        setNewComment('');
        fetchComments();
      } else {
        console.error("Failed to post comment");
      }
    } catch (err) { console.error("Network error while posting comment:", err); }
  };

  return (
    <div style={{borderBottom: '1px solid #2f3336', padding: '15px', display: 'flex', gap: '12px', flexDirection: 'column'}}>
      <div style={{display: 'flex', gap: '12px'}}>
        <div className="avatar" style={{minWidth: '40px', height: '40px', borderRadius: '50%', background: profile_color || '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff'}}>{username[0].toUpperCase()}</div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
            <span style={{fontWeight: 'bold'}}>{username}</span>
            <span style={{color: '#71767b'}}>@{username.toLowerCase()} · {new Date(date).toLocaleDateString()}</span>
          </div>
          <div style={{marginTop: '5px', fontSize: '15px', color: '#e7e9ea', lineHeight: '1.4', whiteSpace: 'pre-wrap'}}>{content}</div>
          <div style={{marginTop: '12px', display: 'flex', justifyContent: 'space-between', maxWidth: '400px', color: '#71767b'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: showComments ? '#1d9bf0' : 'inherit'}} onClick={toggleComments}>
                <MessageCircle size={18}/> <span>{showComments ? comments.length : (comment_count || 0)}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Repeat2 size={18}/></div>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Heart size={18}/></div>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Share2 size={18}/></div>
          </div>
        </div>
      </div>
      
      {showComments && (
        <div style={{marginLeft: '52px', marginTop: '10px', borderLeft: '2px solid #2f3336', paddingLeft: '15px'}}>
           <form onSubmit={handlePostComment} style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
              <input 
                type="text" 
                placeholder="Post your reply" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{background: 'transparent', border: 'none', borderBottom: '1px solid #2f3336', color: '#fff', flex: 1, padding: '5px', outline: 'none'}}
              />
              <button type="submit" style={{background: 'transparent', border: 'none', color: '#1d9bf0', cursor: 'pointer'}}><Send size={18}/></button>
           </form>

           {loading && <div style={{color: '#71767b', fontSize: '12px'}}>Loading...</div>}
           {comments.map(c => (
             <div key={c.id} style={{marginBottom: '12px'}}>
               <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <div style={{width: '20px', height: '20px', borderRadius: '50%', background: c.profile_color, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>{c.username[0].toUpperCase()}</div>
                  <div style={{fontWeight: 'bold', fontSize: '13px'}}>{c.username}</div>
                  <div style={{color: '#71767b', fontSize: '12px'}}>· {new Date(c.created_at).toLocaleDateString()}</div>
               </div>
               <div style={{fontSize: '14px', color: '#e7e9ea', marginTop: '2px'}}>{c.comment_text}</div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Post;
