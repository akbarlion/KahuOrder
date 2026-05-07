import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order } from '@/types';

const statusVariant = { pending: 'secondary', approved: 'default', rejected: 'destructive' } as const;
const statusLabel = { pending: 'Menunggu Konfirmasi', approved: 'Disetujui', rejected: 'Ditolak' } as const;

export default function OrderShow({ order }: { order: Order }) {
    const waPhone = order.guest_phone?.replace(/^0/, '62').replace(/\D/g, '');
    const waMessage = encodeURIComponent(
        `Halo ${order.guest_name}, pesanan Anda #${order.id} sudah kami terima dan sedang diproses. Terima kasih!`,
    );

    return (
        <>
            <Head title={`Pesanan #${order.id}`} />

            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Pesanan #{order.id}</CardTitle>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </p>
                    </div>
                    <Badge variant={statusVariant[order.status]}>{statusLabel[order.status]}</Badge>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Guest info */}
                    <div className="rounded-md bg-gray-50 p-3 text-sm">
                        <p><span className="font-medium">Nama:</span> {order.guest_name}</p>
                        <p><span className="font-medium">HP:</span> {order.guest_phone}</p>
                    </div>

                    {/* Items */}
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-3 py-2 text-left">Barang</th>
                                <th className="px-3 py-2 text-right">Harga</th>
                                <th className="px-3 py-2 text-right">Qty</th>
                                <th className="px-3 py-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-3 py-2">{item.product?.name}</td>
                                    <td className="px-3 py-2 text-right">
                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-3 py-2 text-right">{item.qty}</td>
                                    <td className="px-3 py-2 text-right">
                                        Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t font-semibold">
                                <td colSpan={3} className="px-3 py-2 text-right">Total</td>
                                <td className="px-3 py-2 text-right">
                                    Rp {Number(order.total_price).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {order.notes && (
                        <p className="text-muted-foreground text-sm">
                            <span className="font-medium">Catatan:</span> {order.notes}
                        </p>
                    )}

                    {/* Approval info */}
                    {order.approval && (
                        <div className="bg-muted rounded-md p-3 text-sm">
                            <p className="font-medium">
                                {order.approval.status === 'approved' ? '✅ Disetujui' : '❌ Ditolak'}
                            </p>
                            {order.approval.note && (
                                <p className="text-muted-foreground mt-1">{order.approval.note}</p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/orders">← Kembali</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                            <a
                                href={`https://wa.me/${waPhone}?text=${waMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Hubungi via WA
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
