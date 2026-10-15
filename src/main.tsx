import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Context } from './utils/Context.tsx';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
    <Context>
      <App />
    </Context>
    </MantineProvider>
  </StrictMode>
)
