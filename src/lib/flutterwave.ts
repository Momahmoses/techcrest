'use client';

export interface FlutterwaveOptions {
  email: string;
  name: string;
  amount: number; // in naira (whole units)
  txRef: string;
  publicKey: string;
  currency?: string;
  meta?: Record<string, unknown>;
  onSuccess: (transactionId: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (opts: {
      public_key: string;
      tx_ref: string;
      amount: number;
      currency: string;
      payment_options: string;
      customer: { email: string; name: string };
      meta?: Record<string, unknown>;
      customizations: { title: string; description: string };
      callback: (data: { transaction_id: string; status: string }) => void;
      onclose: () => void;
    }) => void;
  }
}

export function initFlutterwavePayment(opts: FlutterwaveOptions) {
  window.FlutterwaveCheckout({
    public_key:      opts.publicKey,
    tx_ref:          opts.txRef,
    amount:          opts.amount,
    currency:        opts.currency ?? 'NGN',
    payment_options: 'card,ussd,banktransfer',
    customer: {
      email: opts.email,
      name:  opts.name,
    },
    meta: opts.meta,
    customizations: {
      title:       'TechCrest',
      description: 'Course Payment',
    },
    callback: (data) => {
      if (data.status === 'successful' || data.status === 'completed') {
        opts.onSuccess(data.transaction_id);
      } else {
        opts.onClose();
      }
    },
    onclose: opts.onClose,
  });
}

export function generateFlutterwaveRef(prefix = 'TC'): string {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
