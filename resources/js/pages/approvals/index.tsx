import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/hooks/use-locale';
import type { Order } from '@/types';

export default function ApprovalsIndex({ orders }: { orders: Order[] }) {
    const { t } = useLocale();

    return (
        <>
            <Head title={t('approvals')} />
            <div className="space-y-4 p-4">
                <h1 className="text-xl font-semibold">{t('pending_approvals')}</h1>
                {orders.length === 0 && (
                    <p className="text-muted-foreground text-sm">{t('no_pending')}</p>
                )}
                {orders.map((order) => (
                    <ApprovalCard key={order.id} order={order} />
                ))}
            </div>
        </>
    );
}

function ApprovalCard({ order }: { order: Order }) {
    const { t } = useLocale();
    const approve = useForm({});
    const reject = useForm({ note: '' });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">
                    {t('order_number', { id: order.id })} — {order.user?.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">
                    {new Date(order.created_at).toLocaleDateString('id-ID')} ·{' '}
                    Rp {Number(order.total_price).toLocaleString('id-ID')}
                    {order.notes && ` · ${order.notes}`}
                </p>

                <table className="w-full text-sm">
                    <tbody>
                        {order.items?.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="py-1">{item.product?.name}</td>
                                <td className="py-1 text-right">{item.qty} {item.product?.unit}</td>
                                <td className="py-1 text-right">Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <form
                    onSubmit={(e) => { e.preventDefault(); reject.post(`/approvals/${order.id}/reject`); }}
                    className="flex items-end gap-2"
                >
                    <div className="flex-1">
                        <Label>{t('rejection_note')}</Label>
                        <Input
                            placeholder={t('rejection_note_required')}
                            required
                            value={reject.data.note}
                            onChange={(e) => reject.setData('note', e.target.value)}
                        />
                        <InputError message={reject.errors.note} />
                    </div>
                    <Button type="button"
                        onClick={() => approve.post(`/approvals/${order.id}/approve`)}
                        disabled={approve.processing || reject.processing}>
                        {t('approve')}
                    </Button>
                    <Button type="submit" variant="destructive"
                        disabled={approve.processing || reject.processing}>
                        {t('reject')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

ApprovalsIndex.layout = {
    breadcrumbs: [{ title: 'Approvals', href: '/approvals' }],
};
