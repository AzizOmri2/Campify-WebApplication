import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApiProvider } from './contexts/ApiContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserProvider } from './contexts/UserContext';
import { OrderProvider } from './contexts/OrderContext';
import "./index.css";
import { ProductProvider } from './contexts/ProductContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ApiProvider>
      <NotificationProvider>
        <UserProvider>
          <ProductProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </ProductProvider>
        </UserProvider>
      </NotificationProvider>
    </ApiProvider>
  </React.StrictMode>
);