import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Home() {
  const [blogs, setBlogs] = useState([])
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/posts/all-blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching all blogs:', error);
      }
    };

    fetchAllBlogs();
  }, [backendUrl]);

  return (
    <>
      <div className="container mt-4">
        <h1>All Blogs</h1>
        {blogs.map(blog => (
          <div key={blog.id} className="card mt-3">
            <div className="card-header">
              <Link to={`/blog/${blog.id}`}>
                <h2>{blog.title}</h2>
              </Link>
              <p> <strong>From:</strong> {blog.user.username}   &nbsp;  &nbsp; <strong>Date:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="card-body">
              <p> &nbsp; &nbsp; {blog.content.slice(0, 150)}...</p>
              <strong>Comments: {blog.comments.length}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
