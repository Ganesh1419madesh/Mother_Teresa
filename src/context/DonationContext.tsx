import React, { createContext, useContext, useState } from 'react';
import { TRUST_CONFIG, TrustConfig } from '../config/trustConfig';
import { DonationSession, DonorInfo } from '../types/donation';
import { generateDonationRef } from '../utils/upi';

interface DonationContextType {
  amount: number;
  setAmount: (amount: number) => void;
  donorInfo: DonorInfo;
  setDonorInfo: (info: Partial<DonorInfo>) => void;
  transactionRef: string;
  generateNewRef: () => void;
  trustConfig: TrustConfig;
  updateTrustConfig: (custom: Partial<TrustConfig>) => void;
  resetTrustConfig: () => void;
  paymentInitiated: boolean;
  setPaymentInitiated: (initiated: boolean) => void;
  utrNumber: string;
  setUtrNumber: (utr: string) => void;
  lastDonationReceipt: DonationSession | null;
  donationHistory: DonationSession[];
  saveCompletedDonation: () => DonationSession;
}

const STORAGE_KEY_AMOUNT = 'aashraya_donation_amount';
const STORAGE_KEY_DONOR = 'aashraya_donation_donor';
const STORAGE_KEY_CONFIG = 'aashraya_custom_trust_config';
const STORAGE_KEY_HISTORY = 'aashraya_donation_history';

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [amount, setAmountState] = useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY_AMOUNT);
    return saved ? Number(saved) : 500;
  });

  const [donorInfo, setDonorInfoState] = useState<DonorInfo>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY_DONOR);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: '',
      email: '',
      phone: '',
      message: '',
    };
  });

  const [transactionRef, setTransactionRef] = useState<string>(generateDonationRef);
  const [paymentInitiated, setPaymentInitiated] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [lastDonationReceipt, setLastDonationReceipt] = useState<DonationSession | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved) as DonationSession[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [trustConfig, setTrustConfigState] = useState<TrustConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        const savedConfig = JSON.parse(saved) as Partial<TrustConfig>;
        const mergedConfig = { ...TRUST_CONFIG, ...savedConfig };
        const shouldRefreshPaymentDetails =
          savedConfig.upiId === 'aashrayatrust@upi' ||
          savedConfig.upiId === 'davidaraj99-4@okhdfcbank' ||
          (savedConfig.upiId === TRUST_CONFIG.upiId && !TRUST_CONFIG.isDemoPlaceholder);
        const shouldRenameTrust =
          savedConfig.name === 'Aashraya Charitable & Welfare Trust' ||
          savedConfig.payeeName === 'David Araj';
        const shouldUpdateDisplayName = savedConfig.name === 'ANNAI TERESA';
        const shouldUpdatePayeeName =
          savedConfig.payeeName === 'ANNAI TERESA' || savedConfig.payeeName === 'ANGEL FOODS';

        if (shouldRenameTrust) {
          mergedConfig.name = TRUST_CONFIG.name;
          mergedConfig.payeeName = TRUST_CONFIG.payeeName;
        }
        if (shouldUpdateDisplayName) {
          mergedConfig.name = TRUST_CONFIG.name;
        }
        if (shouldUpdatePayeeName) {
          mergedConfig.payeeName = TRUST_CONFIG.payeeName;
        }
        if (shouldRefreshPaymentDetails) {
          mergedConfig.upiId = TRUST_CONFIG.upiId;
          mergedConfig.payeeName = TRUST_CONFIG.payeeName;
          mergedConfig.isDemoPlaceholder = TRUST_CONFIG.isDemoPlaceholder;
          mergedConfig.name = TRUST_CONFIG.name;
        }
        if (shouldRenameTrust || shouldUpdateDisplayName || shouldUpdatePayeeName || shouldRefreshPaymentDetails) {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(mergedConfig));
        }
        return mergedConfig;
      } catch {
        // fallback
      }
    }
    return TRUST_CONFIG;
  });

  const setAmount = (val: number) => {
    setAmountState(val);
    sessionStorage.setItem(STORAGE_KEY_AMOUNT, String(val));
  };

  const setDonorInfo = (info: Partial<DonorInfo>) => {
    setDonorInfoState((prev) => {
      const updated = { ...prev, ...info };
      sessionStorage.setItem(STORAGE_KEY_DONOR, JSON.stringify(updated));
      return updated;
    });
  };

  const generateNewRef = () => {
    const newRef = generateDonationRef();
    setTransactionRef(newRef);
    setPaymentInitiated(false);
    setUtrNumber('');
  };

  const updateTrustConfig = (custom: Partial<TrustConfig>) => {
    setTrustConfigState((prev) => {
      const updated = { ...prev, ...custom, isDemoPlaceholder: false };
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
      return updated;
    });
  };

  const resetTrustConfig = () => {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    setTrustConfigState(TRUST_CONFIG);
  };

  const saveCompletedDonation = (): DonationSession => {
    const receipt: DonationSession = {
      amount,
      donor: donorInfo,
      transactionRef,
      timestamp: Date.now(),
      upiIntentOpened: paymentInitiated,
      utrNumber: utrNumber.trim() || undefined,
      paymentReportedAt: Date.now(),
    };

    setLastDonationReceipt(receipt);
    setDonationHistory((current) => {
      const updated = [receipt, ...current].slice(0, 500);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      return updated;
    });
    return receipt;
  };

  return (
    <DonationContext.Provider
      value={{
        amount,
        setAmount,
        donorInfo,
        setDonorInfo,
        transactionRef,
        generateNewRef,
        trustConfig,
        updateTrustConfig,
        resetTrustConfig,
        paymentInitiated,
        setPaymentInitiated,
        utrNumber,
        setUtrNumber,
        lastDonationReceipt,
        donationHistory,
        saveCompletedDonation,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = (): DonationContextType => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};
