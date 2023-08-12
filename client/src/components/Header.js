import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { debounce } from 'lodash';
export default function Header() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;



  const handleSearch = async () => {
    try {
      const response = await axios.get(`${backendUrl}/posts/search-blogs/${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('search blogs');
    }
  };

  const debouncedHandleSearch = debounce(handleSearch);
  const handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);
    debouncedHandleSearch(searchValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/create-user`, {
        username,
        email,
        password,
      });
      setSuccessMessage(response.data);
      toast.success('Successfully signed up. Please login.');
      setShowRegisterModal(false);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/login`, {
        email,
        password,
      });
      const login = response.data.token;
      localStorage.setItem('token', login);
      toast.success('successful login...!');
      setShowLoginModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error.response.data.error);
      setError(error.response.data.error);

    }
  };


  useEffect(() => {
    const logintoken = localStorage.getItem('token');
    setLoggedIn(logintoken)
  }, [loggedIn])


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    toast.success('Logout successful...!')
    setLoggedIn(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href='/'>BlogApp</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {loggedIn && (
                <li className="nav-item">
                  <a className="nav-link" href="/user">Profile</a>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link" href="/user/create-blog">Create_Blog</a>
              </li>
            </ul>
            <form className="d-flex pe-5" role="search">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search blogs"
                aria-label="Search"
                value={query}
                onChange={handleSearchInputChange}
              />
              <svg xmlns="http://www.w3.org/2000/svg" height="2.2em" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
            </form>
            {loggedIn && (
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            )}
            {!loggedIn && (
              <>
                <button className="btn btn-outline-primary ms-3" onClick={() => setShowLoginModal(true)}>
                  Login
                </button>
                <button className="btn btn-outline-primary ms-3" onClick={() => setShowRegisterModal(true)}>
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="mt-4">
        {query !== '' && searchResults.length > 0 && (
          <div className="border p-3">
            <h3 className="mb-3">Search Results:</h3>
            <ul className="list-group">
              {searchResults.map((blog, index) => (
                <li key={index} className="list-group-item">
                  <a href={`/blog/${blog.id}`}>
                    <h4 className="mb-2">{blog.title}</h4>
                  </a>
                  <p className="mb-2"> &nbsp; &nbsp; {blog.content}</p>
                  <div className='d-flex'>
                    <p className="mb-0 pe-5"> <strong>By:</strong>{blog.user.username}</p>
                    <p className="mb-0 ps-5"><strong>Created on:</strong>  {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>


      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        {error && <div className="alert alert-danger">{error}</div>}

        <Modal.Body>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </form>
              <p className="mt-3">
                Already registered? <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </>
  )
}
