import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const logincheck = localStorage.getItem('token')
        if (!logincheck) {
            toast.error('plz login to Create blog..!',);
            return
        }
        if (!title || !content) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/posts/create-blog`, {
                title,
                content,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response, 24)
            toast.success('Blog created successful...!');
            window.history.back();

        } catch (error) {
            console.error('Create blog error:', error.response.data.error);
            toast.error(error.response.data.error);
        }
    };
    const handleBack = () => {
        window.history.back();
    };


    return (
        <div className="container mt-5">
            <h2>Create Blog</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        id="content"
                        rows="6"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
            <div className="col-md-2 pt-5">
                <div className="mb-1">  <button className="btn btn-secondary" onClick={handleBack}>Back</button>
                </div>
            </div>
        </div>
    )
}
