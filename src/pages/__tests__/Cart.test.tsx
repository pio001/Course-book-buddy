import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../Cart';
import { CartProvider } from '@/lib/cart-context';

// Mock the cart context
jest.mock('@/lib/cart-context', () => ({
  useCart: () => ({
    items: [
      {
        book: {
          _id: '1',
          title: 'Test Book',
          author: 'Test Author',
          price: 1000,
        },
        quantity: 2,
      },
    ],
    total: 2000,
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    checkout: jest.fn().mockResolvedValue('ORDER123'),
    loading: false,
  }),
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the PaymentForm component
jest.mock('@/components/PaymentForm', () => ({
  __esModule: true,
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="payment-form">
      <button onClick={onSuccess}>Complete Payment</button>
      <button onClick={onCancel}>Cancel Payment</button>
    </div>
  ),
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock the Header component
jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>,
}));

describe('Cart', () => {
  test('renders cart with items', () => {
    render(<Cart />);
    
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('₦1,000')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('₦2,000')).toBeInTheDocument();
  });

  test('shows payment options', () => {
    render(<Cart />);
    
    expect(screen.getByText('Delivery Type')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    
    const paymentSelect = screen.getByText('Cash').parentElement;
    fireEvent.change(paymentSelect!, { target: { value: 'card' } });
    
    expect(screen.getByText('Proceed to Payment')).toBeInTheDocument();
  });

  test('shows payment form when card payment is selected', () => {
    render(<Cart />);
    
    // Select card payment
    const paymentSelect = screen.getByText('Cash').parentElement;
    fireEvent.change(paymentSelect!, { target: { value: 'card' } });
    
    // Click proceed to payment
    const proceedButton = screen.getByText('Proceed to Payment');
    fireEvent.click(proceedButton);
    
    // Payment form should be displayed
    expect(screen.getByTestId('payment-form')).toBeInTheDocument();
    expect(screen.getByText('Complete Payment')).toBeInTheDocument();
    expect(screen.getByText('Cancel Payment')).toBeInTheDocument();
  });

  test('handles payment completion', () => {
    render(<Cart />);
    
    // Select card payment and proceed
    const paymentSelect = screen.getByText('Cash').parentElement;
    fireEvent.change(paymentSelect!, { target: { value: 'card' } });
    fireEvent.click(screen.getByText('Proceed to Payment'));
    
    // Complete payment
    fireEvent.click(screen.getByText('Complete Payment'));
    
    // Should return to cart (payment form no longer visible)
    expect(screen.queryByTestId('payment-form')).not.toBeInTheDocument();
  });

  test('handles payment cancellation', () => {
    render(<Cart />);
    
    // Select card payment and proceed
    const paymentSelect = screen.getByText('Cash').parentElement;
    fireEvent.change(paymentSelect!, { target: { value: 'card' } });
    fireEvent.click(screen.getByText('Proceed to Payment'));
    
    // Cancel payment
    fireEvent.click(screen.getByText('Cancel Payment'));
    
    // Should return to cart (payment form no longer visible)
    expect(screen.queryByTestId('payment-form')).not.toBeInTheDocument();
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });
});