import { Transaction, TransactionType, CategoryType } from '@/types';

interface ParsedSMS {
  amount: number;
  type: TransactionType;
  merchant: string;
  date: Date;
  balance?: number;
  isWithdrawal: boolean;
}

// Common SMS patterns for Lesotho banks and mobile money
const SMS_PATTERNS = {
  // M-Pesa patterns
  mpesa: {
    received: /(?:received|credited)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    sent: /(?:sent|paid|transferred)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    withdrawal: /(?:withdraw|withdrawn|cash\s*out)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    balance: /(?:balance|bal|available)\s*(?:is|:)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
  },
  // EcoCash patterns
  ecocash: {
    received: /(?:received|credited)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    sent: /(?:sent|paid|transferred)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    withdrawal: /(?:cash\s*out|withdraw)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    balance: /(?:balance|bal)\s*(?:is|:)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
  },
  // FNB Lesotho patterns
  fnb: {
    credit: /(?:credited|deposit|received)\s*(?:with)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    debit: /(?:debited|paid|purchase|withdrawn)\s*(?:with)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    withdrawal: /(?:atm|cash|withdrawal)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    balance: /(?:avail(?:able)?\.?\s*bal(?:ance)?\.?|balance)\s*(?:is|:)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
  },
  // Standard Lesotho Bank patterns
  slb: {
    credit: /(?:credit|deposit|cr)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    debit: /(?:debit|dr|purchase|payment)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    withdrawal: /(?:atm|cash|withdrawal)\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    balance: /(?:bal(?:ance)?)\s*(?:is|:)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
  },
};

// Merchant/keyword to category mapping
const CATEGORY_KEYWORDS: Record<string, CategoryType> = {
  // Food
  shoprite: 'food',
  pick: 'food',
  spar: 'food',
  woolworths: 'food',
  food: 'food',
  restaurant: 'food',
  cafe: 'food',
  kfc: 'food',
  nandos: 'food',
  grocery: 'food',
  supermarket: 'food',
  
  // Transport
  taxi: 'transport',
  bus: 'transport',
  fuel: 'transport',
  petrol: 'transport',
  garage: 'transport',
  total: 'transport',
  shell: 'transport',
  engen: 'transport',
  uber: 'transport',
  
  // Accommodation
  rent: 'accommodation',
  hostel: 'accommodation',
  landlord: 'accommodation',
  accommodation: 'accommodation',
  housing: 'accommodation',
  
  // Entertainment
  cinema: 'entertainment',
  movie: 'entertainment',
  game: 'entertainment',
  sports: 'entertainment',
  bar: 'entertainment',
  club: 'entertainment',
  
  // Utilities
  vodacom: 'utilities',
  mtn: 'utilities',
  econet: 'utilities',
  airtime: 'utilities',
  data: 'utilities',
  electricity: 'utilities',
  water: 'utilities',
  lewa: 'utilities',
  
  // Education
  university: 'education',
  nul: 'education',
  tuition: 'education',
  book: 'education',
  stationery: 'education',
  school: 'education',
  
  // Health
  pharmacy: 'health',
  clinic: 'health',
  hospital: 'health',
  medicine: 'health',
  doctor: 'health',
};

function extractAmount(text: string): number | null {
  const match = text.match(/M?\s*([\d,]+(?:\.\d{2})?)/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  return null;
}

function extractDate(text: string): Date {
  // Try various date formats
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{2,4})/i,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return new Date(match[0]);
    }
  }
  
  return new Date();
}

function detectCategory(text: string): CategoryType {
  const lowerText = text.toLowerCase();
  
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lowerText.includes(keyword)) {
      return category;
    }
  }
  
  return 'other';
}

function extractMerchant(text: string): string {
  // Try to find merchant name (usually appears after "at", "to", "from")
  const merchantPatterns = [
    /(?:at|to|from)\s+([A-Za-z\s]+?)(?:\s+on|\s+\d|$)/i,
    /(?:paid|payment)\s+(?:to\s+)?([A-Za-z\s]+?)(?:\s+on|\s+\d|$)/i,
  ];
  
  for (const pattern of merchantPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'Unknown';
}

function detectTransactionType(text: string): { type: TransactionType; isWithdrawal: boolean } {
  const lowerText = text.toLowerCase();
  
  // Check for withdrawal
  if (lowerText.includes('withdraw') || lowerText.includes('cash out') || lowerText.includes('atm')) {
    return { type: 'withdrawal', isWithdrawal: true };
  }
  
  // Check for credit
  if (lowerText.includes('received') || lowerText.includes('credited') || lowerText.includes('deposit')) {
    return { type: 'credit', isWithdrawal: false };
  }
  
  // Default to debit
  return { type: 'debit', isWithdrawal: false };
}

function extractBalance(text: string): number | null {
  const balancePatterns = [
    /(?:balance|bal|available)\s*(?:is|:)?\s*M?\s*([\d,]+(?:\.\d{2})?)/i,
    /M?\s*([\d,]+(?:\.\d{2})?)\s*(?:bal|balance)/i,
  ];
  
  for (const pattern of balancePatterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  
  return null;
}

export function parseSMS(smsText: string): ParsedSMS | null {
  if (!smsText || smsText.trim().length === 0) {
    return null;
  }
  
  const { type, isWithdrawal } = detectTransactionType(smsText);
  const amount = extractAmount(smsText);
  
  if (!amount || amount <= 0) {
    return null;
  }
  
  return {
    amount,
    type,
    merchant: extractMerchant(smsText),
    date: extractDate(smsText),
    balance: extractBalance(smsText) ?? undefined,
    isWithdrawal,
  };
}

export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function checkDuplicate(newSms: string, existingTransactions: Transaction[]): boolean {
  // Check if SMS already exists (simple hash comparison)
  const smsHash = newSms.toLowerCase().replace(/\s+/g, '');
  
  return existingTransactions.some(txn => {
    if (txn.rawSms) {
      const existingHash = txn.rawSms.toLowerCase().replace(/\s+/g, '');
      return existingHash === smsHash;
    }
    return false;
  });
}

export function smsToTransaction(smsText: string): Transaction | null {
  const parsed = parseSMS(smsText);
  
  if (!parsed) {
    return null;
  }
  
  return {
    id: generateTransactionId(),
    amount: parsed.amount,
    type: parsed.type,
    category: detectCategory(smsText),
    merchant: parsed.merchant,
    description: smsText.substring(0, 100),
    date: parsed.date,
    balance: parsed.balance,
    source: 'sms',
    rawSms: smsText,
    isWithdrawal: parsed.isWithdrawal,
    cashSpendingRecorded: false,
  };
}
