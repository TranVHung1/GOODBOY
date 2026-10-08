import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoodBoyGame } from './components/GoodBoyGame';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoodBoyGame />
  </StrictMode>,
);
