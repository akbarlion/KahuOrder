import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    MessageCircle,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';

const statusVariant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
} as const;
const statusLabel = {
    pending: 'Menunggu Konfirmasi',
    approved: 'Disetujui',
    rejected: 'Ditolak',
} as const;
const statusDescription = {
    pending: 'Admin akan menghubungi Anda setelah pesanan dicek.',
    approved: 'Pesanan sudah disetujui dan siap diproses.',
    rejected: 'Pesanan belum bisa diproses saat ini.',
} as const;
const statusIcon = {
    pending: Clock3,
    approved: CheckCircle2,
    rejected: XCircle,
} as const;

export default function OrderShow({ order }: { order: Order }) {
    const StatusIcon = statusIcon[order.status];
    const waPhone = order.guest_phone?.replace(/^0/, '62').replace(/\D/g, '');
    const waMessage = encodeURIComponent(
        `Halo ${order.guest_name}, pesanan Anda ${order.public_code} sudah kami terima dan sedang diproses. Terima kasih!`,
    );
    const formatPrice = (value: number) =>
        Number(value).toLocaleString('id-ID');

    return (
        <>
            <Head title={`Pesanan ${order.public_code}`} />

            <div className="mb-4">
                <Button asChild variant="ghost" size="sm" className="-ml-3">
                    <Link href="/orders">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-500">
                                    Pesanan
                                </p>
                                <h1 className="mt-1 text-2xl font-bold tracking-normal text-zinc-950">
                                    {order.public_code}
                                </h1>
                                <p className="mt-2 text-sm text-zinc-500">
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <Badge variant={statusVariant[order.status]}>
                                {statusLabel[order.status]}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="mb-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-md bg-white p-2 text-zinc-700 shadow-sm">
                                    <StatusIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-zinc-950">
                                        {statusLabel[order.status]}
                                    </p>
                                    <p className="mt-1 text-sm text-zinc-600">
                                        {statusDescription[order.status]}
                                    </p>
                                    {order.approval?.note && (
                                        <p className="mt-3 rounded-md bg-white p-3 text-sm text-zinc-600">
                                            {order.approval.note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-zinc-200">
                            <div className="hidden grid-cols-[minmax(0,1fr)_7rem_4rem_8rem] bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-500 sm:grid">
                                <span>Barang</span>
                                <span className="text-right">Harga</span>
                                <span className="text-right">Qty</span>
                                <span className="text-right">Subtotal</span>
                            </div>
                            <div className="divide-y divide-zinc-100">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_7rem_4rem_8rem] sm:items-center"
                                    >
                                        <p className="font-medium text-zinc-950">
                                            {item.product?.name}
                                        </p>
                                        <div className="flex justify-between gap-3 sm:block sm:text-right">
                                            <span className="text-zinc-500 sm:hidden">
                                                Harga
                                            </span>
                                            <span>
                                                Rp {formatPrice(item.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3 sm:block sm:text-right">
                                            <span className="text-zinc-500 sm:hidden">
                                                Qty
                                            </span>
                                            <span>{item.qty}</span>
                                        </div>
                                        <div className="flex justify-between gap-3 font-semibold sm:block sm:text-right">
                                            <span className="text-zinc-500 sm:hidden">
                                                Subtotal
                                            </span>
                                            <span>
                                                Rp{' '}
                                                {formatPrice(
                                                    Number(item.price) *
                                                        item.qty,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-zinc-200 bg-zinc-50 px-4 py-4 font-semibold">
                                <span>Total</span>
                                <span className="text-lg text-zinc-950">
                                    Rp {formatPrice(order.total_price)}
                                </span>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-4">
                                <p className="text-sm font-medium text-zinc-950">
                                    Catatan
                                </p>
                                <p className="mt-1 text-sm text-zinc-600">
                                    {order.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <aside className="space-y-4">
                    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <p className="font-semibold text-zinc-950">Customer</p>
                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <p className="text-zinc-500">Nama</p>
                                <p className="mt-1 font-medium text-zinc-950">
                                    {order.guest_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-500">HP / WA</p>
                                <p className="mt-1 font-medium text-zinc-950">
                                    {order.guest_phone}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <p className="font-semibold text-zinc-950">Bantuan</p>
                        <p className="mt-2 text-sm text-zinc-500">
                            Sertakan kode pesanan saat menghubungi admin.
                        </p>
                        <Button
                            asChild
                            variant="outline"
                            className="mt-4 w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                        >
                            <a
                                href={`https://wa.me/${waPhone}?text=${waMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Hubungi via WA
                            </a>
                        </Button>
                    </section>
                </aside>
            </div>
        </>
    );
}
