import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Debug-Ausgabe
  console.log('Interceptor triggered for URL:', req.url);

  const token = localStorage.getItem('jwtToken');
  console.log('Token found in localStorage:', token ? 'Yes' : 'No');

  if (token) {
    // Wichtig: Token-Format überprüfen (sollte mit "ey" beginnen für JWT)
    console.log('Token format check:', token.startsWith('ey') ? 'Valid JWT format' : 'Invalid format');

    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Added Authorization header to request');
    return next(cloned);
  }
  console.log('No token found, sending request without Authorization');
  return next(req);
};
