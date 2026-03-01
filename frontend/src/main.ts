import { renderAuthApp } from './app.js';

const app = document.getElementById('app');

if (app) {
  const path = window.location.pathname;
  const route = path === '/register' || path === '/verify' || path === '/login' ? path : '/login';
  app.innerHTML = renderAuthApp(route);
}

