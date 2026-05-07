import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { useLocale } from '@/hooks/use-locale';
import type { Product } from '@/types';

export default function ProductEdit({ product }: { product: Product }) {
    const { t } = useLocale();
    const { data, setData, post, processing, errors } = useForm<{
        name: string; description: string; price: string; stock: string; unit: string; image: File | null; _method: string;
    }>({
        name: product.name,
        description: product.description ?? '',
        price: String(product.price),
        stock: String(product.stock),
        unit: product.unit,
        image: null,
        _method: 'PUT',
    });

    return (
        <>
            <Head title={t('edit_product')} />
            <div className="p-4">
                <Card className="mx-auto max-w-lg">
                    <CardHeader><CardTitle>{t('edit_product')}</CardTitle></CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => { e.preventDefault(); post(`/products/${product.id}`, { forceFormData: true }); }}
                            className="space-y-4"
                        >
                            <div>
                                <Label>{t('name')}</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label>{t('description')}</Label>
                                <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>{t('price')}</Label>
                                    <Input type="number" min={0} value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                    <InputError message={errors.price} />
                                </div>
                                <div>
                                    <Label>{t('stock')}</Label>
                                    <Input type="number" min={0} value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                                    <InputError message={errors.stock} />
                                </div>
                            </div>
                            <div>
                                <Label>{t('unit')}</Label>
                                <Input value={data.unit} onChange={(e) => setData('unit', e.target.value)} />
                                <InputError message={errors.unit} />
                            </div>
                            <div>
                                <Label>Gambar (opsional)</Label>
                                {product.image_url && !data.image && (
                                    <img src={product.image_url} alt={product.name} className="mb-2 h-24 w-24 rounded object-cover" />
                                )}
                                {data.image && (
                                    <img src={URL.createObjectURL(data.image)} alt="preview" className="mb-2 h-24 w-24 rounded object-cover" />
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                />
                                <InputError message={errors.image} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => history.back()}>{t('cancel')}</Button>
                                <Button type="submit" disabled={processing}>{t('update')}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProductEdit.layout = {
    breadcrumbs: [{ title: 'Produk', href: '/products' }, { title: 'Edit' }],
};
