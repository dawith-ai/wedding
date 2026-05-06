import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import { Invite } from './pages/Invite';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/v/:encoded" element={<Invite />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
