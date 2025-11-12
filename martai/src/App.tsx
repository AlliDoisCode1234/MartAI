import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './routes/HomePage';
import { AboutPage } from './routes/AboutPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
