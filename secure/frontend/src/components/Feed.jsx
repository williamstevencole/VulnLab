import React from 'react';

const Feed = ({ posts }) => {
  return (
    <div className="feed-view">
      <h2>NETWORK_FEED</h2>
      {posts.length === 0 ? <p>NO DATA RECEIVED...</p> : 
        posts.map(post => (
          <div key={post.id} className="post-node">
            <div className="post-header">REF: {post.id} | AUTH: {post.username} | {new Date(post.created_at).toLocaleDateString()}</div>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      }
    </div>
  );
};

export default Feed;
