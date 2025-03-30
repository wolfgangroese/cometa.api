import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Debug-Ausgabe
  console.log('Interceptor triggered for URL:', req.url);

  const token = localStorage.getItem('jwtToken');
  console.log('Token found in localStorage:', token ? 'Yes (length: ' + token.length + ')' : 'No');

  if (token) {
    // Better JWT format check
    const isValidFormat = token.startsWith('eyJ');
    console.log('Token format check:', isValidFormat ? 'Valid JWT format' : 'Invalid format');
    console.log('Token preview:', token.substring(0, 20) + '...');

    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Added Authorization header to request');

    // Log the actual header being sent
    console.log('Authorization header:', cloned.headers.get('Authorization'));

    return next(cloned);
  }
  console.log('No token found, sending request without Authorization');
  return next(req);
};
