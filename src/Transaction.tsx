export enum TransactionType {
  Buy = "BUY",
  Sell = "SELL",
  Crd = "CRD",
  Deb = "DEB",
  Rec = "REC",
  Del = "DEL"
}

export interface Transaction {
  id: number;
  entryDate: Date;
  effectiveDate: Date;
  type: TransactionType;
  security: string;
  description: string;
  quantity: number;
  amount: number;
}