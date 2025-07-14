import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { postsAPI } from '../../utils/api';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const result = await postsAPI.getAllPosts();
      if (result.success && result.data.success) {
        setPosts(result.data.allPosts || []);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MDBContainer className="py-4">
      <MDBTypography tag="h2" className="text-center mb-4">
        PixelNest
      </MDBTypography>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <MDBTypography tag="p" className="text-center text-muted">
          No posts available. Be the first to share an image!
        </MDBTypography>
      ) : (
        <MDBRow>
          {posts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdate={fetchAllPosts}
              style={{animationDelay: `${index * 0.1}s`}}
            />
          ))}
        </MDBRow>
      )}
    </MDBContainer>
  );
};

export default Home;
