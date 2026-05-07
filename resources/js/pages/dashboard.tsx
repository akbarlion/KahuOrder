import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import type { Order } from '@/types';

interface Stats {
    total_orders: number;
    pending_orders: number;
    total_products: number;
    total_revenue: number;
}

const statusVariant = { pending: 'secondary', approved: 'default', rejected: 'destructive' } as const;
const statusLabel = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' } as const;

export default function Dashboard({ stats, recent_orders }: { stats: Stats; recent_orders: Order[] }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4">

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard label="Total Pesanan" value={stats.total_orders} />
                    <StatCard
                        label="Menunggu Konfirmasi"
                        value={stats.pending_orders}
                        highlight={stats.pending_orders > 0}
                        href="/approvals"
                    />
                    <StatCard label="Produk Aktif" value={stats.total_products} href="/products" />
                    <StatCard
                        label="Total Revenue"
                        value={`Rp ${Number(stats.total_revenue).toLocaleString('id-ID')}`}
                    />
                </div>

                {/* Recent orders */}
                <div>
                    <h2 className="mb-3 text-base font-semibold">5 Pesanan Terbaru</h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left">#</th>
                                    <th className="px-4 py-3 text-left">Nama</th>
                                    <th className="px-4 py-3 text-left">HP</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                                            Belum ada pesanan.
                                        </td>
                                    </tr>
                                )}
                                {recent_orders.map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="px-4 py-3 font-mono text-xs">#{order.id}</td>
                                        <td className="px-4 py-3">{order.guest_name}</td>
                                        <td className="px-4 py-3 text-gray-500">{order.guest_phone}</td>
                                        <td className="px-4 py-3 text-right">
                                            Rp {Number(order.total_price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Badge variant={statusVariant[order.status]}>
                                                {statusLabel[order.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}

function StatCard({
    label, value, highlight = false, href,
}: {
    label: string;
    value: string | number;
    highlight?: boolean;
    href?: string;
}) {
    const content = (
        <div className={`rounded-xl border p-4 ${highlight ? 'border-orange-300 bg-orange-50' : 'bg-white'}`}>
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${highlight ? 'text-orange-600' : ''}`}>{value}</p>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
