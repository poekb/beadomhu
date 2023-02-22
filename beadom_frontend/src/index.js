import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ConfirmEmail from './ConfirmEmail';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Docs from './Docs';

const root = ReactDOM.createRoot(document.getElementById('root'));

if ('serviceWorker' in navigator) {
  
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service worker registered:', registration);
    }).catch(function(error) {
      console.error('Service worker registration failed:', error);
    });
  });
}

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/regist" element={<ConfirmEmail />}/>

      <Route path="/docs" element={<Docs />}/>
      <Route path="/doks" element={<Docs />}/>

      
      <Route path="*" element={<App />}/>


    </Routes>
  </BrowserRouter>
);


reportWebVitals();
