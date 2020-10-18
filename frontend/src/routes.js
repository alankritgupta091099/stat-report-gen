import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import FileDropView from 'src/views/fileDropZone/FileDropView';
import Home from 'src/views/home';
import PrivateRoute from "./protectedRoutes.js";
import store from './store';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <PrivateRoute component={AccountView} /> },
      { path: 'register-new', element: <PrivateRoute component={RegisterView} /> },
      { path: 'report-gen', element: <PrivateRoute component={FileDropView}/> },
      { path: 'customers', element: <PrivateRoute component={CustomerListView}/> },
      { path: 'dashboard', element: <PrivateRoute component={DashboardView}/> },
      { path: '/', element: <Navigate to="/404" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },      
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Home /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
