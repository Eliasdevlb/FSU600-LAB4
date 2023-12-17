import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './components/RoutesComponent'; // Import your RoutesComponent
import './index.css';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <RoutesComponent />
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
