import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBTypography, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../utils/api';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const result = await postsAPI.getMyPosts();
      if (result.success && result.data.success) {
        setPosts(result.data.posts || []);
      } else {
        setError('Failed to fetch your posts');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch my posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MDBContainer className="py-4">
      {/* Enhanced Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <MDBTypography tag="h2" className="mb-1 d-flex align-items-center">
            <i className="fas fa-user-images me-2 text-primary"></i>
            My Posts
          </MDBTypography>

        </div>
        <MDBBtn color="primary" tag={Link} to="/createPost" className="btn-interactive ripple">
          <i className="fas fa-plus me-2"></i>
          <span className="d-none d-sm-inline">Create New Post</span>
          <span className="d-sm-none">Create</span>
        </MDBBtn>
      </div>



      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-5">
          <MDBTypography tag="h4" className="text-muted mb-3">
            No posts yet
          </MDBTypography>
          <MDBTypography tag="p" className="text-muted mb-4">
            Share your first image with the community!
          </MDBTypography>
          <MDBBtn color="primary" tag={Link} to="/createPost">
            <i className="fas fa-plus me-1"></i>
            Create Your First Post
          </MDBBtn>
        </div>
      ) : (
        <MDBRow>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdate={fetchMyPosts} showActions={true} />
          ))}
        </MDBRow>
      )}
    </MDBContainer>
  );
};

export default MyPosts;
