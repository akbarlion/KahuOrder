export type * from './auth';
export type * from './navigation';
export type * from './ui';

export type Product = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    unit: string;
};

export type OrderItem = {
    id: number;
    order_id: number;
    product_id: number;
    qty: number;
    price: number;
    product?: Product;
};

export type Approval = {
    id: number;
    order_id: number;
    approved_by: number;
    status: 'approved' | 'rejected';
    note: string | null;
    approved_at: string;
    approver?: import('./auth').User;
};

export type Order = {
    id: number;
    user_id: number;
    total_price: number;
    notes: string | null;
    created_at: string;
    status: 'pending' | 'approved' | 'rejected';
    user?: import('./auth').User;
    items?: OrderItem[];
    approval?: Approval;
};
