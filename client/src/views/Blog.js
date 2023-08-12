import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { toast } from 'react-toastify';

export default function Blog() {
    const [blog, setBlog] = useState({});
    const { postId } = useParams();
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwt_decode(storedToken);
                if (decoded) {
                    setLoggedInUserId(decoded.userId);
                }
            } catch (error) {
                toast.error("Unauthorized")
            }
        }

        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${backendUrl}/posts/blog/${postId}`);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };

        fetchBlog();
    }, [backendUrl, postId]);


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!loggedInUserId) {
            toast.error('plz login to comment ..!')
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/comments/create-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: loggedInUserId,
                    postId: blog.id,
                    content: newComment,
                }),
            });

            if (response.ok) {
                const comment = await response.json();
                setComments([...comments, comment]);
                setNewComment('');
            } else {
                console.log('faid to post comment')
            }
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <h1>{blog.title}</h1>
                            <p className="text-muted">Posted by {blog.user?.username} on {new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="card-body">
                            <p> &nbsp; &nbsp; {blog.content}</p>
                        </div>
                    </div>

                    <div className="card mt-4">
                        <div className="card-header">
                            <h3>Add a Comment</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCommentSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="commentContent" className="form-label">
                                        Your Comment
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="commentContent"
                                        rows="3"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Post Comment
                                </button>
                            </form>
                        </div>
                    </div>


                    <div className="card mt-4">
                        <div className="card-header">
                            <h3>Comments</h3>
                        </div>
                        <div className="card-body">
                            <p>Total Comments: {blog.comments?.length}</p>
                            <ul className="list-group">
                                {blog.comments?.map(comment => (
                                    <li className="list-group-item" key={comment.id}>
                                        <p className="font-weight-bold">{comment.user?.username}</p>
                                        <p>{comment.content}</p>
                                        <p className="text-muted">Posted on {new Date(comment.createdAt).toLocaleString()}</p>
                                    </li>
                                ))}
                                {/* {comments.map((comment) => (
                                    <li className="list-group-item">
                                        <p>{comment.content}</p>
                                      
                                    </li>
                                ))} */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
