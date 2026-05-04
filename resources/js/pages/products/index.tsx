import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import type { Product } from '@/types';

export default function ProductsIndex({ products }: { products: Product[] }) {
    const { t } = useLocale();
    const { delete: destroy, processing } = useForm();

    return (
        <>
            <Head title={t('products')} />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{t('products')}</h1>
                    <Button asChild>
                        <Link href="/products/create">{t('add_product')}</Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">{t('name')}</th>
                                <th className="px-4 py-3 text-right">{t('price')}</th>
                                <th className="px-4 py-3 text-right">{t('stock')}</th>
                                <th className="px-4 py-3 text-left">{t('unit')}</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                                        {t('no_products')}
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="px-4 py-3">{product.name}</td>
                                    <td className="px-4 py-3 text-right">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                    <td className="px-4 py-3 text-right">{product.stock}</td>
                                    <td className="px-4 py-3">{product.unit}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/products/${product.id}/edit`}>{t('edit_product')}</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" disabled={processing}
                                                onClick={() => { if (confirm(t('confirm_delete'))) destroy(`/products/${product.id}`); }}>
                                                {t('delete')}
                                            </Button>
                                        </div>
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

ProductsIndex.layout = {
    breadcrumbs: [{ title: 'Produk', href: '/products' }],
};
