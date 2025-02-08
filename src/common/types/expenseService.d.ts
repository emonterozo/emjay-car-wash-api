export interface AddExpenseProps {
  category: 'MANPOWER' | 'BILLS' | 'CONSUMABLES' | 'OTHER';
  description: string;
  amount: number;
  date: string;
}
