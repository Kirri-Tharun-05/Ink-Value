import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import  LetterContainer  from './components/LetterContainer';
import MyDrafts from './components/MyDrafts';
function Layout() {
  const location = useLocation();
  return (
    <div className={`mx-auto px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white`}>
      <Routes>
        <Route path='/text_edit' element={<LetterContainer/>}/>
        <Route path="/text_edit/:id" element={<LetterContainer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my_draft_files" element={<MyDrafts />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout /> {/* Now Layout is correctly inside BrowserRouter */}
    </BrowserRouter>
  );
}

export default App;
