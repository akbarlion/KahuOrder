import { Head, useForm } from '@inertiajs/react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { useLocale } from '@/hooks/use-locale';
import type { Product } from '@/types';

interface Props { products: Product[] }
interface OrderItemForm { product_id: number | ''; qty: number }

export default function OrderCreate({ products }: Props) {
    const { t } = useLocale();
    const { data, setData, post, processing, errors } = useForm<{
        items: OrderItemForm[];
        notes: string;
    }>({ items: [{ product_id: '', qty: 1 }], notes: '' });

    const addItem = () => setData('items', [...data.items, { product_id: '', qty: 1 }]);
    const removeItem = (i: number) => setData('items', data.items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof OrderItemForm, value: number | string) => {
        const items = [...data.items];
        items[i] = { ...items[i], [field]: value };
        setData('items', items);
    };
    const getPrice = (id: number | '') => !id ? 0 : (products.find(p => p.id === Number(id))?.price ?? 0);
    const total = data.items.reduce((sum, item) => sum + getPrice(item.product_id) * item.qty, 0);

    return (
        <>
            <Head title={t('create_order')} />
            <div className="p-4">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader><CardTitle>{t('create_order')}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); post('/orders'); }} className="space-y-4">
                            {data.items.map((item, i) => (
                                <div key={i} className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Label>{t('product')}</Label>
                                        <select
                                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                            value={item.product_id}
                                            onChange={(e) => updateItem(i, 'product_id', e.target.value)}
                                        >
                                            <option value="">—</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — Rp {p.price.toLocaleString('id-ID')} / {p.unit}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={(errors as Record<string, string>)[`items.${i}.product_id`]} />
                                    </div>
                                    <div className="w-24">
                                        <Label>{t('qty')}</Label>
                                        <Input type="number" min={1} value={item.qty}
                                            onChange={(e) => updateItem(i, 'qty', Number(e.target.value))} />
                                        <InputError message={(errors as Record<string, string>)[`items.${i}.qty`]} />
                                    </div>
                                    <div className="w-32 text-right text-sm">
                                        Rp {(getPrice(item.product_id) * item.qty).toLocaleString('id-ID')}
                                    </div>
                                    <Button type="button" variant="ghost" size="icon"
                                        onClick={() => removeItem(i)} disabled={data.items.length === 1}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button type="button" variant="outline" onClick={addItem} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> {t('add_item')}
                            </Button>

                            <div>
                                <Label>{t('notes_optional')}</Label>
                                <Input value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="font-semibold">
                                    {t('total')}: Rp {total.toLocaleString('id-ID')}
                                </span>
                                <Button type="submit" disabled={processing}>{t('submit_order')}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OrderCreate.layout = {
    breadcrumbs: [
        { title: 'Orders', href: '/orders' },
        { title: 'Create', href: '/orders/create' },
    ],
};
