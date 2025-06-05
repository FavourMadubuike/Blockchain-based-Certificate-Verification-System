import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Web3Provider from "./providers/Web3Provider";
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <Web3Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Web3Provider>
);