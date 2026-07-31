import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/shop/CartDrawer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <CartDrawer /> {/* Global Slide-Over Cart */}
        </CartProvider>
      </body>
    </html>
  );
}