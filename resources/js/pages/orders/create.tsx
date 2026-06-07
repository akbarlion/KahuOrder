import { Head, useForm } from '@inertiajs/react';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Product } from '@/types';

interface Props {
    products: Product[];
}
interface OrderItemForm {
    product_id: number | '';
    qty: number;
}

export default function OrderCreate({ products }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        guest_name: string;
        guest_phone: string;
        items: OrderItemForm[];
        notes: string;
    }>({
        guest_name: '',
        guest_phone: '',
        items: [{ product_id: '', qty: 1 }],
        notes: '',
    });

    const formatPrice = (value: number) =>
        Number(value).toLocaleString('id-ID');

    const addItem = () =>
        setData('items', [...data.items, { product_id: '', qty: 1 }]);

    const removeItem = (i: number) =>
        setData(
            'items',
            data.items.filter((_, idx) => idx !== i),
        );

    const updateItem = (
        i: number,
        field: keyof OrderItemForm,
        value: number | string,
    ) => {
        const items = [...data.items];
        items[i] = { ...items[i], [field]: value };
        setData('items', items);
    };

    const getProduct = (id: number | '') =>
        !id ? null : (products.find((p) => p.id === Number(id)) ?? null);

    const getPrice = (id: number | '') =>
        !id ? 0 : (products.find((p) => p.id === Number(id))?.price ?? 0);

    const total = data.items.reduce(
        (sum, item) => sum + getPrice(item.product_id) * item.qty,
        0,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/order');
    };

    return (
        <>
            <Head title="Pre-Order" />

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500">
                        Pre-Order
                    </p>
                    <h1 className="text-2xl font-bold tracking-normal text-zinc-950">
                        Buat Pesanan
                    </h1>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600">
                    {products.length} produk tersedia
                </div>
            </div>

            <Card className="overflow-hidden rounded-lg border-zinc-200 shadow-sm">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <section className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="guest_name">Nama Lengkap</Label>
                                <Input
                                    id="guest_name"
                                    value={data.guest_name}
                                    onChange={(e) =>
                                        setData('guest_name', e.target.value)
                                    }
                                    placeholder="Budi Santoso"
                                    required
                                />
                                <InputError message={errors.guest_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guest_phone">
                                    Nomor HP / WA
                                </Label>
                                <Input
                                    id="guest_phone"
                                    type="tel"
                                    value={data.guest_phone}
                                    onChange={(e) =>
                                        setData('guest_phone', e.target.value)
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                                <InputError message={errors.guest_phone} />
                            </div>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <Label>Barang yang dipesan</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addItem}
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah
                                </Button>
                            </div>
                            {data.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[minmax(0,1fr)_6rem_8rem_2.5rem] sm:items-end"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`item-product-${i}`}
                                            className="text-xs text-zinc-500"
                                        >
                                            Produk
                                        </Label>
                                        <select
                                            id={`item-product-${i}`}
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            value={item.product_id}
                                            onChange={(e) =>
                                                updateItem(
                                                    i,
                                                    'product_id',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Pilih barang
                                            </option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - Rp{' '}
                                                    {formatPrice(p.price)} /{' '}
                                                    {p.unit}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={
                                                (
                                                    errors as Record<
                                                        string,
                                                        string
                                                    >
                                                )[`items.${i}.product_id`]
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`item-qty-${i}`}
                                            className="text-xs text-zinc-500"
                                        >
                                            Qty
                                        </Label>
                                        <Input
                                            id={`item-qty-${i}`}
                                            type="number"
                                            min={1}
                                            max={
                                                getProduct(item.product_id)
                                                    ?.stock
                                            }
                                            value={item.qty}
                                            onChange={(e) =>
                                                updateItem(
                                                    i,
                                                    'qty',
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end justify-between gap-3 sm:block sm:text-right">
                                        <span className="text-xs text-zinc-500 sm:hidden">
                                            Subtotal
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-950">
                                                Rp{' '}
                                                {formatPrice(
                                                    getPrice(item.product_id) *
                                                        item.qty,
                                                )}
                                            </p>
                                            {getProduct(item.product_id) && (
                                                <p className="mt-1 text-xs text-zinc-500">
                                                    Stok{' '}
                                                    {
                                                        getProduct(
                                                            item.product_id,
                                                        )?.stock
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(i)}
                                        disabled={data.items.length === 1}
                                        className="justify-self-end"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <InputError message={errors.items} />
                        </section>

                        <section className="space-y-2">
                            <Label htmlFor="notes">Catatan (opsional)</Label>
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                placeholder="Warna, ukuran, atau permintaan khusus..."
                                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                        </section>

                        <section className="rounded-lg border border-zinc-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-zinc-500">
                                        Estimasi Total
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-zinc-950">
                                        Rp {formatPrice(total)}
                                    </p>
                                </div>
                                <ClipboardList className="h-8 w-8 text-zinc-300" />
                            </div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="mt-4 w-full"
                            >
                                Kirim Pre-Order
                            </Button>
                            <p className="mt-3 text-xs text-zinc-500">
                                Admin akan menghubungi Anda via WA/HP setelah
                                pesanan masuk.
                            </p>
                        </section>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
