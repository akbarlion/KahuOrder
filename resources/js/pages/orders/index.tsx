import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from '@/types';

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

export default function OrdersIndex({ orders }: { orders?: Order[] }) {
    const [phone, setPhone] = useState('');
    const formatPrice = (value: number) =>
        Number(value).toLocaleString('id-ID');

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/orders', { phone }, { preserveState: true });
    };

    return (
        <>
            <Head title="Cek Status Order" />

            <div className="mb-6">
                <p className="text-sm font-medium text-zinc-500">Status</p>
                <h1 className="text-2xl font-bold tracking-normal text-zinc-950">
                    Cek Pesanan
                </h1>
            </div>

            <Card className="mb-6 overflow-hidden rounded-lg border-zinc-200 shadow-sm">
                <CardContent>
                    <form
                        onSubmit={search}
                        className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor HP / WA</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="08xxxxxxxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">
                            <Search className="h-4 w-4" />
                            Cari
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {orders != null ? (
                orders.length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 text-center">
                        <Search className="h-9 w-9 text-zinc-400" />
                        <p className="mt-3 font-medium text-zinc-900">
                            Tidak ada pesanan ditemukan.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="font-semibold text-zinc-950">
                                            Pesanan {order.public_code}
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                                        <Badge
                                            variant={
                                                statusVariant[order.status]
                                            }
                                        >
                                            {statusLabel[order.status]}
                                        </Badge>
                                        <p className="text-sm font-semibold text-zinc-950 sm:mt-2">
                                            Rp {formatPrice(order.total_price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end border-t border-zinc-100 pt-3">
                                    <Button asChild variant="outline" size="sm">
                                        <Link
                                            href={`/orders/${order.public_code}`}
                                        >
                                            Lihat Detail
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500">
                    Masukkan nomor HP yang kamu gunakan saat pre-order.
                </div>
            )}
        </>
    );
}
