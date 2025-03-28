// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import SignIn from './components/Signin';
import LogIn from './components/Login';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import  {LetterContainer}  from './components/LetterContainer';
import MyDrafts from './components/MyDrafts';
function Layout() {
  const location = useLocation();
  return (
    <div className={`max-w-7xl mx-auto px-6`}>
      <Routes>
        <Route path='/text_edit' element={<LetterContainer/>}/>
        <Route path="/text_edit/:id" element={<LetterContainer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<LogIn />} />
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
