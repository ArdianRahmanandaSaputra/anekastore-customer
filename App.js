import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/globals.css';

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Product from './pages/Product';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

import ProductDetail from './component/ProductDetail';
import Layout from './component/Layout';

import CartContextProvider from './context/CartContext';
import TransactionContextProvider from './context/TransactionContext';
import LoginContextProvider from './context/LoginContext';
import AccountContextProvider from './context/AccountContext';
import { AuthProvider } from './context/AuthContext';
import { UserTokenProvider } from './context/UserTokenContext';
import ProfileDetail from './pages/ProfileDetail';
import Payment from './pages/Payment';
import CheckoutCartContextProvider from './context/CheckoutCart';


export default function App() {
  useEffect(()=>{
    require('bootstrap/dist/js/bootstrap.bundle.min');
  }, []);

  return (
      <AuthProvider>
        <UserTokenProvider>
          <CartContextProvider>
            <CheckoutCartContextProvider>
              <TransactionContextProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path='/product' element={<Product />} />
                      <Route path='/category' element={<Category />} />
                      <Route path='/cart' element={<Cart />} />
                      <Route path='/checkout' element={<Checkout />} />
                      <Route path='/profile' element={<Profile />} />
                      <Route path='/profile-detail' element={<ProfileDetail />} />
                      <Route path='/payment' element={<Payment />} />
                      <Route path='/product/product-detail/:id' Component={ProductDetail} />
                    </Route>
                      <Route path='/login' element={<Login />} />
                      <Route path='/register' element={<Register/>} />
                  </Routes>
                </BrowserRouter>
              </TransactionContextProvider>
            </CheckoutCartContextProvider>
          </CartContextProvider>
        </UserTokenProvider>
      </AuthProvider>
  );
}


