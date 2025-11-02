declare module 'react-paystack' {
  import { ReactNode } from 'react';

  export interface PaystackProps {
    reference: string;
    email: string;
    amount: number;
    publicKey: string;
    text?: string;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    metadata?: Record<string, any>;
    currency?: string;
    channels?: string[];
    className?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    [key: string]: any;
  }

  export const PaystackButton: React.FC<PaystackProps>;
  export const usePaystackPayment: (config: Omit<PaystackProps, 'text' | 'onSuccess' | 'onClose'>) => 
    (callback: { onSuccess: (reference: any) => void, onClose: () => void }) => void;
}