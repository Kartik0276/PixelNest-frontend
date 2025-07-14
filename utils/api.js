const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    credentials: 'include', // Include cookies for authentication
  };

  // Only add Content-Type header if not sending FormData
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers = {
      'Content-Type': 'application/json',
    };
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    return {
      success: response.ok,
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: 500,
    };
  }
};

// Auth API calls
export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  logout: () => apiCall('/auth/logout', {
    method: 'GET',
  }),

  // Get user profile (protected endpoint)
  getProfile: () => apiCall('/auth/profile', {
    method: 'GET',
  }),
};

// Posts API calls
export const postsAPI = {
  getMyPosts: () => apiCall('/posts/myPosts', {
    method: 'GET',
  }),

  getAllPosts: () => apiCall('/posts/allPosts', {
    method: 'GET',
  }),

  getPostById: (id) => apiCall(`/posts/getPost/${id}`, {
    method: 'GET',
  }),

  createPost: (formData) => apiCall('/posts/createPost', {
    method: 'POST',
    body: formData, // FormData for file upload
  }),

  editPost: (id, postData) => apiCall(`/posts/editPost/${id}`, {
    method: 'PUT',
    body: postData,
  }),

  deletePost: (id) => apiCall(`/posts/deletePost/${id}`, {
    method: 'DELETE',
  }),

  toggleLike: (id) => apiCall(`/posts/likeToggle/${id}`, {
    method: 'PUT',
  }),

  addComment: (id, comment) => apiCall(`/posts/comment/${id}`, {
    method: 'POST',
    body: JSON.stringify(comment),
  }),

  deleteComment: (postId, commentId) => apiCall(`/posts/comment/${postId}/delete/${commentId}`, {
    method: 'DELETE',
  }),

  editComment: (postId, commentId, comment) => apiCall(`/posts/comment/${postId}/edit/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify(comment),
  }),

  getComments: (postId) => apiCall(`/posts/getUserComments/${postId}`, {
    method: 'GET',
  }),
};
