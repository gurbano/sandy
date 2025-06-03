import { jsx as _jsx } from "react/jsx-runtime";
// index.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(_jsx(App, {}));
