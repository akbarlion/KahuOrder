import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ImageOff, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Banner {
    id: number;
    title: string;
    image_url: string;
    link_url: string | null;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    unit: string;
    image_url: string | null;
    stock: number;
}

interface Props {
    banners: Banner[];
    products: Product[];
}

export default function CatalogIndex({ banners, products }: Props) {
    const [selected, setSelected] = useState<Product | null>(null);
    const formatPrice = (value: number) =>
        Number(value).toLocaleString('id-ID');

    return (
        <>
            <Head title="Katalog" />

            <div className="space-y-6">
                {banners.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                        {banners.map((banner, index) => (
                            <a
                                key={banner.id}
                                href={banner.link_url ?? '#'}
                                target={banner.link_url ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className={
                                    index === 0
                                        ? 'block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm md:col-span-2'
                                        : 'block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm'
                                }
                            >
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className={
                                        index === 0
                                            ? 'h-44 w-full object-cover sm:h-56'
                                            : 'h-36 w-full object-cover'
                                    }
                                />
                            </a>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-normal text-zinc-950">
                            Produk Tersedia
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            {products.length} produk siap dipesan hari ini
                        </p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/order">
                            <ShoppingCart className="h-4 w-4" />
                            Pre-Order
                        </Link>
                    </Button>
                </div>

                {products.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 text-center">
                        <Package className="h-10 w-10 text-zinc-400" />
                        <p className="mt-3 font-medium text-zinc-900">
                            Belum ada produk tersedia.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => setSelected(product)}
                                className="group grid overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <ImageOff className="h-9 w-9 text-zinc-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid min-h-40 grid-rows-[auto_1fr_auto] gap-3 p-4">
                                    <div>
                                        <p className="line-clamp-2 leading-snug font-semibold text-zinc-950">
                                            {product.name}
                                        </p>
                                        {product.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="self-end">
                                        <p className="text-lg font-bold text-zinc-950">
                                            Rp {formatPrice(product.price)}
                                            <span className="ml-1 text-sm font-normal text-zinc-500">
                                                / {product.unit}
                                            </span>
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            Stok {product.stock} {product.unit}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
            >
                <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
                    {selected && (
                        <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <div className="aspect-square bg-zinc-100 sm:aspect-auto">
                                {selected.image_url ? (
                                    <img
                                        src={selected.image_url}
                                        alt={selected.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full min-h-64 items-center justify-center">
                                        <ImageOff className="h-12 w-12 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col p-5">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">
                                        {selected.name}
                                    </DialogTitle>
                                </DialogHeader>
                                {selected.description && (
                                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                                        {selected.description}
                                    </p>
                                )}
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <p className="text-2xl font-bold text-zinc-950">
                                            Rp {formatPrice(selected.price)}
                                            <span className="ml-1 text-base font-normal text-zinc-500">
                                                / {selected.unit}
                                            </span>
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            Stok {selected.stock}{' '}
                                            {selected.unit}
                                        </p>
                                    </div>
                                    <Button asChild className="w-full">
                                        <Link href="/order">
                                            <ShoppingCart className="h-4 w-4" />
                                            Pesan Produk
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
