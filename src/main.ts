import './styles/main.css';
import './styles/mobile.css';
import { App } from './app';
import { NotificationSystem } from './ui/NotificationSystem';

document.addEventListener('DOMContentLoaded', () => {
  // Init Notifications
  NotificationSystem.init();

  // Global Error Handlers
  window.addEventListener('error', (event) => {
      console.error('Global Error:', event.error);
      NotificationSystem.show(`System Error: ${event.message}`, 'error', 5000);
  });

  window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Rejection:', event.reason);
      NotificationSystem.show(`Promise Error: ${event.reason}`, 'error', 5000);
  });

  try {
    new App();
    console.log('Image3D App Initialized');
    // NotificationSystem.show('System Online', 'success');
  } catch (error: any) {
    console.error('Failed to initialize app', error);
    NotificationSystem.show(`Init Failed: ${error.message}`, 'error');
  }

  // Register Service Worker for PWA
  // Skip on localhost to avoid refresh loops with DevServer
  if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
      // Use relative path for GitHub Pages compatibility
      navigator.serviceWorker.register('./service-worker.js').then(
        (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        },
        (err) => {
          console.log('ServiceWorker registration failed: ', err);
        }
      );
    });
  } else if (window.location.hostname === 'localhost') {
      console.log('Service Worker skipped (Localhost)');
      // Force unregister if exists to clear the loop
      navigator.serviceWorker.getRegistrations().then((registrations) => {
          for(let registration of registrations) {
              registration.unregister();
              console.log('Unregistered existing SW on localhost'); 
          }
      });
  }
});
