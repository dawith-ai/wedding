import { useLayoutEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import { Invite } from './pages/Invite';
import { Privacy } from './pages/Privacy';
import { Manage } from './pages/Manage';
import { ErrorBoundary } from './components/ErrorBoundary';

function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/v/:encoded" element={<Invite />} />
          <Route path="/i/:coupleId/:encoded" element={<Invite />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
