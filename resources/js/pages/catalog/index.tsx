import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

    return (
        <>
            <Head title="Katalog" />

            {/* Banners */}
            {banners.length > 0 && (
                <div className="mb-6 space-y-3">
                    {banners.map((banner) => (
                        <a
                            key={banner.id}
                            href={banner.link_url ?? '#'}
                            target={banner.link_url ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="block overflow-hidden rounded-xl"
                        >
                            <img src={banner.image_url} alt={banner.title} className="h-40 w-full object-cover" />
                        </a>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Produk Tersedia</h2>
                <Button asChild size="sm">
                    <Link href="/order">Pre-Order Sekarang</Link>
                </Button>
            </div>

            {products.length === 0 ? (
                <p className="py-12 text-center text-gray-500">Belum ada produk tersedia.</p>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => setSelected(product)}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm text-left w-full hover:shadow-md transition-shadow"
                        >
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="h-36 w-full object-cover" />
                            ) : (
                                <div className="flex h-36 items-center justify-center bg-gray-100 text-4xl">📦</div>
                            )}
                            <div className="p-3">
                                <p className="font-semibold leading-tight text-gray-900">{product.name}</p>
                                {product.description && (
                                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{product.description}</p>
                                )}
                                <p className="mt-2 text-sm font-bold text-blue-600">
                                    Rp {Number(product.price).toLocaleString('id-ID')}
                                    <span className="ml-1 font-normal text-gray-400">/ {product.unit}</span>
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">Stok: {product.stock} {product.unit}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Product detail modal */}
            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="max-w-sm p-0 overflow-hidden">
                    {selected && (
                        <>
                            {selected.image_url ? (
                                <img src={selected.image_url} alt={selected.name} className="w-full max-h-72 object-contain bg-gray-100" />
                            ) : (
                                <div className="flex h-52 items-center justify-center bg-gray-100 text-6xl">📦</div>
                            )}
                            <div className="p-5">
                                <DialogHeader>
                                    <DialogTitle>{selected.name}</DialogTitle>
                                </DialogHeader>
                                {selected.description && (
                                    <p className="mt-2 text-sm text-gray-500">{selected.description}</p>
                                )}
                                <div className="mt-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-xl font-bold text-blue-600">
                                            Rp {Number(selected.price).toLocaleString('id-ID')}
                                            <span className="ml-1 text-sm font-normal text-gray-400">/ {selected.unit}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">Stok: {selected.stock} {selected.unit}</p>
                                    </div>
                                    <Button asChild size="sm">
                                        <Link href="/order">Pesan</Link>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
