export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Transaction {
  id: number | string;
  date: string;
  time: string;
  symbol: string;
  name: string;
  type: TransactionType;
  price: number;
  shares: number;
  fee: number;
  tax: number;
}
