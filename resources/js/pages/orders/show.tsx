import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import type { Order } from '@/types';

const statusVariant = { pending: 'secondary', approved: 'default', rejected: 'destructive' } as const;

export default function OrderShow({ order }: { order: Order }) {
    const { t } = useLocale();

    return (
        <>
            <Head title={t('order_detail')} />
            <div className="p-4">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{t('order_number', { id: order.id })}</CardTitle>
                        <Badge variant={statusVariant[order.status]}>{t(order.status)}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-muted-foreground text-sm">
                            <p>{t('date')}: {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                            {order.notes && <p>{t('notes')}: {order.notes}</p>}
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-muted text-muted-foreground">
                                <tr>
                                    <th className="px-3 py-2 text-left">{t('product')}</th>
                                    <th className="px-3 py-2 text-right">{t('price')}</th>
                                    <th className="px-3 py-2 text-right">{t('qty')}</th>
                                    <th className="px-3 py-2 text-right">{t('subtotal')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-3 py-2">{item.product?.name}</td>
                                        <td className="px-3 py-2 text-right">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                                        <td className="px-3 py-2 text-right">{item.qty}</td>
                                        <td className="px-3 py-2 text-right">Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t font-semibold">
                                    <td colSpan={3} className="px-3 py-2 text-right">{t('total')}</td>
                                    <td className="px-3 py-2 text-right">Rp {Number(order.total_price).toLocaleString('id-ID')}</td>
                                </tr>
                            </tfoot>
                        </table>

                        {order.approval && (
                            <div className="bg-muted rounded-md p-3 text-sm">
                                <p className="font-medium">
                                    {order.approval.status === 'approved' ? '✅' : '❌'}{' '}
                                    {t(order.approval.status === 'approved' ? 'approved_by' : 'rejected_by')}{' '}
                                    {order.approval.approver?.name}
                                </p>
                                {order.approval.note && <p className="text-muted-foreground mt-1">{order.approval.note}</p>}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button asChild variant="outline">
                                <Link href="/orders">{t('back')}</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OrderShow.layout = {
    breadcrumbs: [
        { title: 'Orders', href: '/orders' },
        { title: 'Detail' },
    ],
};
