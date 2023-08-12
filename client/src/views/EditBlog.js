import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function EditBlog() {
  const { id } = useParams();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Login to get details");
      return;
    }
    axios.get(`${backendUrl}/posts/blog/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setNewTitle(response.data.title);
        setNewContent(response.data.content);
      })
      .catch(error => {
        console.log(error);
      });
  }, [backendUrl, id]);

  const handleUpdateBlog = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${backendUrl}/posts/edit-blog/${id}`, {
        title: newTitle,
        content: newContent
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Blog Update successful...!');
      window.history.back();
    } catch (error) {
      console.log(error);
    }
  };
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container mt-5">
      <h2>Edit Blog</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="newTitle" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="newTitle"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="newContent" className="form-label">Content</label>
        <textarea
          className="form-control"
          id="newContent"
          rows="6"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
      </div>
      <div className="d-grid gap-2">
        <button className="btn btn-primary" onClick={handleUpdateBlog}>Save</button>
      </div>
      <div className="col-md-2 pt-3">
        <div className="mb-1">  <button className="btn btn-secondary" onClick={handleBack}>Back</button>
        </div>
      </div>
    </div>

  );
}
