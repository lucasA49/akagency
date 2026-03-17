/**
 * @file main.jsx
 * @description Point d'entree de l'application React.
 *
 * Routes publiques (layout App — Navbar + Footer) :
 *   /                  → Home
 *   /services          → Services
 *   /realisations      → Realisations
 *   /contact           → Contact
 *   /mentions-legales  → Cgv
 *
 * Routes admin (layout AdminLayout — sans Navbar/Footer) :
 *   /admin/login            → Login
 *   /admin/forgot-password  → ForgotPassword
 *   /admin/reset-password   → ResetPassword
 *   /admin                  → Dashboard (protégé)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

/* ── Layout public */
import App from './App';

/* ── Pages publiques */
import Home         from './pages/Home';
import Services     from './pages/Services';
import Realisations from './pages/Realisations';
import Contact      from './pages/Contact';
import Cgv          from './pages/Cgv';

/* ── Layout & guards admin */
import AdminLayout    from './layouts/AdminLayout';
import ProtectedRoute from './pages/admin/ProtectedRoute';

/* ── Pages admin */
import Login          from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword  from './pages/admin/ResetPassword';
import Dashboard      from './pages/admin/Dashboard';

/* ── Contexte auth */
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  /* ═══════ Layout public ═══════ */
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,              element: <Home />         },
      { path: 'services',         element: <Services />     },
      { path: 'realisations',     element: <Realisations /> },
      { path: 'contact',          element: <Contact />      },
      { path: 'mentions-legales', element: <Cgv />          },
    ],
  },

  /* ═══════ Pages auth admin (sans layout) ═══════ */
  { path: '/admin/login',           element: <Login />          },
  { path: '/admin/forgot-password', element: <ForgotPassword /> },
  { path: '/admin/reset-password',  element: <ResetPassword />  },

  /* ═══════ Panel admin protégé ═══════ */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
