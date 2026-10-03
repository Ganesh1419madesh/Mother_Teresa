import QRCode from 'qrcode';

export interface UpiParams {
  pa: string; // Payee VPA / UPI ID
  pn: string; // Payee Name
  am?: number; // Amount; omitted for reusable payee QR codes
  cu?: string; // Currency, defaults to INR
  tn?: string; // Transaction note
  tr?: string; // Transaction reference ID
}

/**
 * Builds a valid UPI Payment Intent URI according to NPCI UPI specifications.
 */
export function buildUpiUri(params: UpiParams): string {
  const { pa, pn, am, cu = 'INR', tn, tr } = params;
  
  const queryParams = new URLSearchParams();
  queryParams.append('pa', pa.trim());
  queryParams.append('pn', pn.trim());
  if (am !== undefined) {
    // Standard UPI requires amount with 2 decimals or integer
    queryParams.append('am', am.toFixed(2));
  }
  queryParams.append('cu', cu);

  if (tn) {
    queryParams.append('tn', tn.trim());
  }

  if (tr) {
    queryParams.append('tr', tr.trim());
  }

  return `upi://pay?${queryParams.toString()}`;
}

/**
 * Generates a high-contrast QR Code Data URL from a UPI URI string.
 */
export async function generateUpiQrCode(upiUri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(upiUri, {
      width: 380,
      margin: 2,
      color: {
        dark: '#0f172a', // Deep slate for sharp high-contrast scanning
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Failed to generate UPI QR code:', error);
    throw error;
  }
}

/**
 * Generates unique donation tracking reference ID
 */
export function generateDonationRef(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TRST-${dateStr}-${rand}`;
}
