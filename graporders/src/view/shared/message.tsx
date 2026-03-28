import * as toastr from 'toastr';
import 'toastr/build/toastr.css';

export default class Message {
  static success(message = 'Task Submission Complete', duration = 3000) {
    // Check if CSS is loaded, if not add it dynamically
    if (!document.querySelector('#custom-toast-style')) {
      const style = document.createElement('style');
      style.id = 'custom-toast-style';
      style.textContent = `
        .custom-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(-100px);
          background-color: #48BB78;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 12px #48BB78;
          opacity: 0;
          z-index: 1000;
          transition: transform 0.3s ease, opacity 0.3s ease;
          max-width: 70%;
          width:100%;
          word-wrap: break-word;
          text-align: center;
        }
        .custom-toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        
        .custom-toast-container {
          position: relative;
          width: 100%;
          min-height: 60px;
        }
      `;
      document.head.appendChild(style);
    }

    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
      existingToast.classList.remove('show');
      setTimeout(() => existingToast.remove(), 300);
    }

    // Create and show new toast
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, duration);
  }

  static error(message = 'An error occurred', duration = 3000) {
    // Add error-specific styles if not already present
    if (!document.querySelector('#custom-toast-error-style')) {
      const style = document.createElement('style');
      style.id = 'custom-toast-error-style';
      style.textContent = `
        .custom-toast-error {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% - 20px)); /* start slightly above center */
          background: rgba(246, 44, 44); /* black with slight transparency */
          color: white;
          font-size: 16px;               /* small text */
          padding: 10px 12px;              /* minimal padding */
          border-radius: 4px;              /* clean, subtle rounding */
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 400;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* very subtle shadow */
          opacity: 0;
          z-index: 1000;
          transition: transform 0.3s ease, opacity 0.3s ease;
          max-width: 50%;
          width: auto;                     /* let it shrink to content */
          word-wrap: break-word;
          text-align: center;
          line-height: 1.4;
          pointer-events: none;            /* optional: allow clicks through */
        }
        .custom-toast-error.show {
          transform: translate(-50%, -50%); /* centered */
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }

    // Remove any existing error toast (optional, shows only one at a time)
    const existingToast = document.querySelector('.custom-toast-error');
    if (existingToast) {
      existingToast.classList.remove('show');
      setTimeout(() => existingToast.remove(), 300);
    }

    // Create the error toast element
    const toast = document.createElement('div');
    toast.className = 'custom-toast-error';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    // Automatically remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, duration);
  }
}