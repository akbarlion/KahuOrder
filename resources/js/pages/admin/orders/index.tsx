import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Search,
    XCircle,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from '@/types';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

type Props = {
    orders: Paginated<Order>;
    filters: {
        search: string;
        status: StatusFilter;
    };
    summary: Record<StatusFilter, number>;
};

const statusVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
} as const;

const statusLabel = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
} as const;

const statusTabs: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

export default function AdminOrdersIndex({ orders, filters, summary }: Props) {
    const [search, setSearch] = useState(filters.search);

    const applyFilters = (next: Partial<typeof filters>) => {
        router.get(
            '/admin/orders',
            {
                search,
                status: filters.status,
                ...next,
            },
            { preserveState: true, replace: true },
        );
    };

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        applyFilters({ search });
    };

    return (
        <>
            <Head title="Order Management" />

            <div className="space-y-5 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Admin
                        </p>
                        <h1 className="text-2xl font-bold tracking-normal">
                            Order Management
                        </h1>
                    </div>

                    <form
                        onSubmit={submitSearch}
                        className="grid gap-2 sm:grid-cols-[minmax(18rem,1fr)_auto]"
                    >
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari kode, nama, nomor HP"
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit">
                            <Search className="h-4 w-4" />
                            Cari
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => applyFilters({ status: tab.value })}
                            className={
                                filters.status === tab.value
                                    ? 'rounded-lg border border-zinc-950 bg-zinc-950 p-4 text-left text-white shadow-sm'
                                    : 'rounded-lg border bg-white p-4 text-left shadow-sm hover:bg-muted/40'
                            }
                        >
                            <p className="text-xs opacity-70">{tab.label}</p>
                            <p className="mt-1 text-2xl font-bold">
                                {summary[tab.value]}
                            </p>
                        </button>
                    ))}
                </div>

                <Card className="hidden overflow-hidden lg:block">
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        Items
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-muted-foreground"
                                        >
                                            Tidak ada order ditemukan.
                                        </td>
                                    </tr>
                                )}
                                {orders.data.map((order) => (
                                    <OrderTableRow
                                        key={order.id}
                                        order={order}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <div className="space-y-3 lg:hidden">
                    {orders.data.length === 0 && (
                        <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                            Tidak ada order ditemukan.
                        </div>
                    )}
                    {orders.data.map((order) => (
                        <OrderMobileCard key={order.id} order={order} />
                    ))}
                </div>

                <Pagination orders={orders} />
            </div>
        </>
    );
}

function OrderTableRow({ order }: { order: Order }) {
    return (
        <tr className="border-t align-top">
            <td className="px-4 py-4">
                <p className="font-mono text-xs font-semibold">
                    {order.public_code}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(order.created_at)}
                </p>
            </td>
            <td className="px-4 py-4">
                <p className="font-medium">{order.guest_name}</p>
                <a
                    href={`https://wa.me/${toWaPhone(order.guest_phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline"
                >
                    <MessageCircle className="h-3 w-3" />
                    {order.guest_phone}
                </a>
            </td>
            <td className="max-w-sm px-4 py-4">
                <OrderItems order={order} />
                {order.notes && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        Catatan: {order.notes}
                    </p>
                )}
            </td>
            <td className="px-4 py-4 text-right font-semibold">
                Rp {formatPrice(order.total_price)}
            </td>
            <td className="px-4 py-4 text-center">
                <Badge variant={statusVariant[order.status]}>
                    {statusLabel[order.status]}
                </Badge>
            </td>
            <td className="px-4 py-4">
                <OrderActions order={order} align="end" />
            </td>
        </tr>
    );
}

function OrderMobileCard({ order }: { order: Order }) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-mono text-xs font-semibold">
                        {order.public_code}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                        {order.guest_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDate(order.created_at)}
                    </p>
                </div>
                <Badge variant={statusVariant[order.status]}>
                    {statusLabel[order.status]}
                </Badge>
            </div>

            <div className="mt-4 border-t pt-3">
                <OrderItems order={order} />
                {order.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">
                        Catatan: {order.notes}
                    </p>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-3">
                <a
                    href={`https://wa.me/${toWaPhone(order.guest_phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-emerald-700"
                >
                    <MessageCircle className="h-4 w-4" />
                    WA
                </a>
                <p className="font-semibold">
                    Rp {formatPrice(order.total_price)}
                </p>
            </div>

            <OrderActions order={order} />
        </div>
    );
}

function OrderItems({ order }: { order: Order }) {
    return (
        <div className="space-y-1">
            {order.items?.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between gap-3 text-xs"
                >
                    <span className="line-clamp-1">
                        {item.product?.name ?? 'Produk dihapus'} x{item.qty}
                    </span>
                    <span className="shrink-0 font-medium">
                        Rp {formatPrice(Number(item.price) * item.qty)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function OrderActions({
    order,
    align = 'start',
}: {
    order: Order;
    align?: 'start' | 'end';
}) {
    const approve = useForm({});
    const reject = useForm({ note: '' });
    const isProcessed = order.status !== 'pending';

    if (isProcessed) {
        return (
            <div
                className={
                    align === 'end'
                        ? 'text-right text-xs text-muted-foreground'
                        : 'mt-4 text-xs text-muted-foreground'
                }
            >
                {order.approval?.note
                    ? `Catatan: ${order.approval.note}`
                    : 'Order sudah diproses.'}
            </div>
        );
    }

    return (
        <div className={align === 'end' ? 'ml-auto max-w-64' : 'mt-4'}>
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                        approve.post(`/approvals/${order.id}/approve`, {
                            preserveScroll: true,
                        })
                    }
                    disabled={approve.processing || reject.processing}
                >
                    <CheckCircle2 className="h-4 w-4" />
                    Setujui
                </Button>
            </div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    reject.post(`/approvals/${order.id}/reject`, {
                        preserveScroll: true,
                    });
                }}
                className="mt-2 space-y-2"
            >
                <Label className="sr-only">Alasan penolakan</Label>
                <Input
                    placeholder="Alasan tolak"
                    value={reject.data.note}
                    onChange={(event) =>
                        reject.setData('note', event.target.value)
                    }
                    required
                />
                <InputError message={reject.errors.note} />
                <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    disabled={approve.processing || reject.processing}
                >
                    <XCircle className="h-4 w-4" />
                    Tolak
                </Button>
            </form>
        </div>
    );
}

function Pagination({ orders }: { orders: Paginated<Order> }) {
    if (orders.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 rounded-lg border bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">
                Menampilkan {orders.from} - {orders.to} dari {orders.total}
            </p>
            <div className="flex gap-2">
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={!orders.prev_page_url}
                >
                    <Link
                        href={orders.prev_page_url ?? '#'}
                        preserveScroll
                        preserveState
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    disabled={!orders.next_page_url}
                >
                    <Link
                        href={orders.next_page_url ?? '#'}
                        preserveScroll
                        preserveState
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

function formatPrice(value: number | string) {
    return Number(value).toLocaleString('id-ID');
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function toWaPhone(value: string) {
    return value.replace(/^0/, '62').replace(/\D/g, '');
}

AdminOrdersIndex.layout = {
    breadcrumbs: [{ title: 'Orders', href: '/admin/orders' }],
};
