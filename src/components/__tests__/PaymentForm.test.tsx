import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentForm from '../PaymentForm';

// Mock the PaystackButton component
jest.mock('react-paystack', () => ({
  PaystackButton: ({ className, text }) => (
    <button className={className}>{text}</button>
  ),
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('PaymentForm', () => {
  const mockProps = {
    amount: 5000,
    onSuccess: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders payment form with correct amount', () => {
    render(<PaymentForm {...mockProps} />);
    
    expect(screen.getByText(/Amount to Pay:/i)).toBeInTheDocument();
    expect(screen.getByText(/₦5,000/i)).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<PaymentForm {...mockProps} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i);
    const nameInput = screen.getByLabelText(/Full Name/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '08012345678' } });
    
    expect(emailInput).toHaveValue('john@example.com');
    expect(nameInput).toHaveValue('John Doe');
    expect(phoneInput).toHaveValue('08012345678');
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<PaymentForm {...mockProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('shows Paystack button with correct amount', () => {
    render(<PaymentForm {...mockProps} />);
    
    const paystackButton = screen.getByText(/Pay ₦5,000/i);
    expect(paystackButton).toBeInTheDocument();
  });
});