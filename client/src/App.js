import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Blog from './views/Blog';
import User from './views/User';
import EditBlog from './views/EditBlog';
import CreateBlog from './views/CreateBlog';
import NotFound from './components/NotFound';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/blog/:postId" element={<Blog />} />
          <Route exact path="/edit-blog/:id" element={<EditBlog />} />
          <Route exact path="/user/create-blog" element={<CreateBlog />} />
          <Route exact path="/user" element={<User />} />
          <Route path='*' exact={true} element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>

  );
}

export default App;
