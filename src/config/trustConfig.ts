/**
 * TRUST CONFIGURATION FILE
 * 
 * IMPORTANT:
 * Replace the placeholder values below with your actual Trust details,
 * specifically your registered Trust UPI ID to receive payments directly.
 */

export interface TrustConfig {
  /** Name of the charitable trust displayed on the website */
  name: string;
  
  /** Short tagline/motto */
  tagline: string;

  
  upiId: string;

  /** Registered Payee Name as approved on your merchant/trust bank account */
  payeeName: string;

  /** Official contact email */
  contactEmail: string;

  /** Official contact phone */
  contactPhone: string;

  /** Trust office location / address */
  address: string;

  /** Is this still using placeholder/demo credentials */
  isDemoPlaceholder: boolean;
}

export const TRUST_CONFIG: TrustConfig = {
  name: "Mother Teresa's Leprosy Rehabilitation Centre & Shishu Bhawan",
  tagline: "Restoring dignity through compassionate rehabilitation and nurturing care for children.",
  
  // Payment destination taken from the UPI QR supplied by the user.
  upiId: "mtlrcsb@tmb",
  payeeName: "MTLRCSB",
  
  contactEmail: "care@aashrayatrust.org",
  contactPhone: "+91 98765 43210",
  address: "Plot 42, Sevagram Welfare Complex, Institutional Area, Sector 5, New Delhi - 110001",
  
  isDemoPlaceholder: false,
};

export const DONATION_PRESETS = [
  {
    amount: 10,
    label: "₹10",
    impact: "Contributes toward meals and essential supplies for people in need.",
  },
  {
    amount: 100,
    label: "₹100",
    impact: "Helps provide nutritious meals and daily essentials.",
    popular: true,
  },
  {
    amount: 1000,
    label: "₹1,000",
    impact: "Supports essential health, education, and community welfare needs.",
  },
  {
    amount: 2000,
    label: "₹2,000",
    impact: "Contributes to emergency food and essential supply support.",
  },
  {
    amount: 5000,
    label: "₹5,000",
    impact: "Supports education, health, and community welfare programs.",
  },
];
