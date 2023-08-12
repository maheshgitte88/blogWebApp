import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function User() {
  const [userBlogs, setUserBlogs] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("login to get details");
      return;
    }
    axios.get(`${backendUrl}/posts/user-blogs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setUserBlogs(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [backendUrl]);


  const handleDelete = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/posts/delete-blog/${blogId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserBlogs(userBlogs.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };


  return (
    <div className="container mt-5">
      <div className='d-flex'>
        <h2 className="mb-4 pe-5">Your Blogs</h2>
        <h2 className="mb-4 ps-5 " ><Link to={`/user/create-blog`}>Create New Blog</Link></h2>
      </div>
      <ul className="list-group">
        {userBlogs.map(blog => (
          <li className="list-group-item" key={blog.id}>
            <Link to={`/blog/${blog.id}`}>
              <h3>{blog.title}</h3>
            </Link>
            <p>{blog.content}</p>
            <p className="text-muted">Created on: {new Date(blog.createdAt).toLocaleDateString()}</p>
            <div className="d-flex">
              <Link to={`/edit-blog/${blog.id}`} className="btn btn-primary me-2">Edit</Link>
              <button className="btn btn-danger" onClick={() => handleDelete(blog.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
