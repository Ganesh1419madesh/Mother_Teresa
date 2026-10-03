export interface DonorInfo {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface DonationSession {
  amount: number;
  donor: DonorInfo;
  transactionRef: string;
  timestamp: number;
  upiIntentOpened: boolean;
  utrNumber?: string;
  paymentReportedAt?: number;
}
