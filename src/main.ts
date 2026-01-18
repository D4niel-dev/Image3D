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

  // KILL SWITCH: Force Unregister All, Service Workers
  // This is temporary to fix the "Resource was not cached" loop
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for(let registration of registrations) {
        registration.unregister();
        console.log('💀 Killed Zombie Service Worker:', registration.scope);
      }
      if (registrations.length === 0) {
        console.log('✅ No Service Workers found (Clean State)');
      }
    });
  }
});
