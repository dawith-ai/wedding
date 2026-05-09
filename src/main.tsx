import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/invite.css';
import './styles/editorial.css';
import './styles/signatures.css';
import './styles/features.css';
import './styles/builder.css';
import './styles/cinematic.css';
import App from './App.tsx';
import { setCustomThemes } from './data/themes';
import { loadCustomThemes } from './lib/customThemes';

setCustomThemes(loadCustomThemes());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
