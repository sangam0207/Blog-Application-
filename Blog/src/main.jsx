
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store, persistor } from '../redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import  ThemeProvider from '../src/components/ThemeProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      {/* We can add theme inside the whole body by wrapping the App inside the ThemeProvider wrapper */}
      <ThemeProvider>
      <App />
      </ThemeProvider>
       
    </Provider>
  </PersistGate>
);