import { StrictMode, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App/App';
import { BrowserRouter } from 'react-router-dom';
import Store from './utils/storage/store';

const store = new Store();
export const Context = createContext({ store });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Context.Provider value={{ store} }>
        <App />
      </Context.Provider>
    </BrowserRouter>
  </StrictMode>,
)
