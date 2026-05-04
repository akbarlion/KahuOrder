import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import type { Order } from '@/types';

const statusVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
} as const;

export default function OrdersIndex({ orders }: { orders: Order[] }) {
    const { t } = useLocale();

    return (
        <>
            <Head title={t('orders')} />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{t('my_orders')}</h1>
                    <Button asChild>
                        <Link href="/orders/create">{t('create_order')}</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">{t('date')}</th>
                                <th className="px-4 py-3 text-right">{t('total')}</th>
                                <th className="px-4 py-3 text-center">{t('status')}</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                                        {t('no_orders')}
                                    </td>
                                </tr>
                            )}
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-3">{order.id}</td>
                                    <td className="px-4 py-3">
                                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge variant={statusVariant[order.status]}>
                                            {t(order.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/orders/${order.id}`}>{t('detail')}</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [{ title: 'Orders', href: '/orders' }],
};
