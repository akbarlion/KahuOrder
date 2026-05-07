import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Order } from '@/types';

export default function ApprovalsIndex({ orders }: { orders: Order[] }) {
    return (
        <>
            <Head title="Approval Pre-Order" />
            <div className="space-y-4 p-4">
                <h1 className="text-xl font-semibold">Pre-Order Menunggu Konfirmasi</h1>
                {orders.length === 0 && (
                    <p className="text-muted-foreground text-sm">Tidak ada pre-order yang perlu dikonfirmasi.</p>
                )}
                {orders.map((order) => (
                    <ApprovalCard key={order.id} order={order} />
                ))}
            </div>
        </>
    );
}

function ApprovalCard({ order }: { order: Order }) {
    const approve = useForm({});
    const reject = useForm({ note: '' });

    const waPhone = order.guest_phone?.replace(/^0/, '62').replace(/\D/g, '');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                    <span>Pesanan #{order.id}</span>
                    <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-normal text-green-600 hover:underline"
                    >
                        WA {order.guest_phone}
                    </a>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm">
                    <p><span className="font-medium">Nama:</span> {order.guest_name}</p>
                    <p className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                        })}
                        {' · '}Rp {Number(order.total_price).toLocaleString('id-ID')}
                        {order.notes && ` · ${order.notes}`}
                    </p>
                </div>

                <table className="w-full text-sm">
                    <tbody>
                        {order.items?.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="py-1">{item.product?.name}</td>
                                <td className="py-1 text-right">{item.qty} {item.product?.unit}</td>
                                <td className="py-1 text-right">
                                    Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <form
                    onSubmit={(e) => { e.preventDefault(); reject.post(`/approvals/${order.id}/reject`); }}
                    className="flex items-end gap-2"
                >
                    <div className="flex-1">
                        <Label>Alasan penolakan</Label>
                        <Input
                            placeholder="Wajib diisi jika menolak"
                            required
                            value={reject.data.note}
                            onChange={(e) => reject.setData('note', e.target.value)}
                        />
                        <InputError message={reject.errors.note} />
                    </div>
                    <Button
                        type="button"
                        onClick={() => approve.post(`/approvals/${order.id}/approve`)}
                        disabled={approve.processing || reject.processing}
                    >
                        Setujui
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={approve.processing || reject.processing}
                    >
                        Tolak
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

ApprovalsIndex.layout = {
    breadcrumbs: [{ title: 'Approvals', href: '/approvals' }],
};
