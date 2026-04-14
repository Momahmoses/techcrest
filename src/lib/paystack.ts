'use client';

export interface PaystackOptions {
  email: string;
  amount: number; // in kobo (amount * 100)
  reference: string;
  publicKey: string;
  currency?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (opts: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        currency: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export function initPaystackPayment(opts: PaystackOptions) {
  const handler = window.PaystackPop.setup({
    key:      opts.publicKey,
    email:    opts.email,
    amount:   opts.amount * 100, // convert to kobo
    ref:      opts.reference,
    currency: opts.currency ?? 'NGN',
    metadata: opts.metadata,
    callback: (response) => opts.onSuccess(response.reference),
    onClose:  opts.onClose,
  });
  handler.openIframe();
}

export function generatePaystackRef(prefix = 'TC'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}
