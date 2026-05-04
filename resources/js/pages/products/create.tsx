import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { useLocale } from '@/hooks/use-locale';

export default function ProductCreate() {
    const { t } = useLocale();
    const { data, setData, post, processing, errors } = useForm({
        name: '', description: '', price: '', stock: '', unit: 'pcs',
    });

    return (
        <>
            <Head title={t('add_product')} />
            <div className="p-4">
                <Card className="mx-auto max-w-lg">
                    <CardHeader><CardTitle>{t('add_product')}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); post('/products'); }} className="space-y-4">
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
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => history.back()}>{t('cancel')}</Button>
                                <Button type="submit" disabled={processing}>{t('save')}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProductCreate.layout = {
    breadcrumbs: [{ title: 'Produk', href: '/products' }, { title: 'Tambah' }],
};
