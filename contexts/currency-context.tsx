'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/utils/api-client';

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
];

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number | null | undefined) => string;
  currencies: Currency[];
  loadCurrency: () => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  const loadCurrency = async () => {
    try {
      const { currency } = await api.getCurrency();
      const currencyObj = currencies.find((c) => c.code === currency);
      console.log('currencyObj', currencyObj);
      if (currencyObj) {
        setCurrency(currencyObj);
      } else {
        setCurrency(currencies[0]);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  useEffect(() => {
    loadCurrency();
  }, []);

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) {
      return `${currency.symbol}0.00`;
    }
    return `${currency.symbol} ${price.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies, loadCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
