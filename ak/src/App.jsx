/**
 * @component App
 * @description Layout racine de l'application.
 *   Enveloppe toutes les pages avec la Navbar et le Footer.
 *   L'<Outlet /> est fourni par React Router et rend la page active.
 *
 * Structure :
 *   <Navbar />          ← sticky, z-50
 *   <main>
 *     <Outlet />        ← contenu de la page courante
 *   </main>
 *   <Footer />
 */

import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050711]">
      {/* Restaure le scroll en haut a chaque changement de route */}
      <ScrollRestoration />

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
