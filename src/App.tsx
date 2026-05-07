import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import { Invite } from './pages/Invite';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/v/:encoded" element={<Invite />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
