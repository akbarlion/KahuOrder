import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from '@/types';

const statusVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
} as const;

const statusLabel = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' } as const;

export default function OrdersIndex({ orders }: { orders?: Order[] }) {
    const [phone, setPhone] = useState('');

    const search = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/orders', { phone }, { preserveState: true });
    };

    return (
        <>
            <Head title="Cek Status Order" />

            <h1 className="mb-4 text-xl font-bold">Cek Status Pesanan</h1>

            <form onSubmit={search} className="mb-6 flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="phone">Nomor HP</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-end">
                    <Button type="submit">Cari</Button>
                </div>
            </form>

            {orders != null ? (
                orders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Tidak ada pesanan ditemukan untuk nomor ini.</p>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div key={order.id} className="rounded-lg border bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Pesanan #{order.id}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={statusVariant[order.status]}>
                                            {statusLabel[order.status]}
                                        </Badge>
                                        <p className="mt-1 text-sm font-semibold">
                                            Rp {Number(order.total_price).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/orders/${order.id}`}>Lihat Detail</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <p className="text-muted-foreground text-center py-8 text-sm">
                    Masukkan nomor HP yang kamu gunakan saat pre-order untuk melihat status pesanan.
                </p>
            )}
        </>
    );
}
