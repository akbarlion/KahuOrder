import { Head, useForm } from '@inertiajs/react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import type { Product } from '@/types';

interface Props { products: Product[] }
interface OrderItemForm { product_id: number | ''; qty: number }

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

    const addItem = () => setData('items', [...data.items, { product_id: '', qty: 1 }]);
    const removeItem = (i: number) => setData('items', data.items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof OrderItemForm, value: number | string) => {
        const items = [...data.items];
        items[i] = { ...items[i], [field]: value };
        setData('items', items);
    };

    const getPrice = (id: number | '') =>
        !id ? 0 : (products.find((p) => p.id === Number(id))?.price ?? 0);

    const total = data.items.reduce(
        (sum, item) => sum + getPrice(item.product_id) * item.qty,
        0,
    );

    const buildWaMessage = () => {
        const lines = [
            `*Pre-Order Baru*`,
            `Nama: ${data.guest_name}`,
            `HP: ${data.guest_phone}`,
            ``,
            `*Pesanan:*`,
            ...data.items.map((item) => {
                const product = products.find((p) => p.id === Number(item.product_id));
                if (!product) return '';
                return `- ${product.name} x${item.qty} = Rp ${(product.price * item.qty).toLocaleString('id-ID')}`;
            }).filter(Boolean),
            ``,
            `*Total: Rp ${total.toLocaleString('id-ID')}*`,
            data.notes ? `Catatan: ${data.notes}` : '',
        ].filter((l) => l !== undefined);

        return encodeURIComponent(lines.join('\n'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/order');
    };

    return (
        <>
            <Head title="Pre-Order" />
            <Card>
                <CardHeader>
                    <CardTitle>Form Pre-Order</CardTitle>
                    <p className="text-muted-foreground text-sm">
                        Isi form di bawah. Admin akan mengkonfirmasi ketersediaan barang.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Guest info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="guest_name">Nama Lengkap</Label>
                                <Input
                                    id="guest_name"
                                    value={data.guest_name}
                                    onChange={(e) => setData('guest_name', e.target.value)}
                                    placeholder="Budi Santoso"
                                    required
                                />
                                <InputError message={errors.guest_name} />
                            </div>
                            <div>
                                <Label htmlFor="guest_phone">Nomor HP / WA</Label>
                                <Input
                                    id="guest_phone"
                                    type="tel"
                                    value={data.guest_phone}
                                    onChange={(e) => setData('guest_phone', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                                <InputError message={errors.guest_phone} />
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            <Label>Barang yang dipesan</Label>
                            {data.items.map((item, i) => (
                                <div key={i} className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <select
                                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                            value={item.product_id}
                                            onChange={(e) => updateItem(i, 'product_id', e.target.value)}
                                            required
                                        >
                                            <option value="">— Pilih barang —</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — Rp {Number(p.price).toLocaleString('id-ID')} / {p.unit}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={(errors as Record<string, string>)[`items.${i}.product_id`]} />
                                    </div>
                                    <div className="w-20">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-28 text-right text-sm font-medium">
                                        Rp {(getPrice(item.product_id) * item.qty).toLocaleString('id-ID')}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(i)}
                                        disabled={data.items.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addItem} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Barang
                            </Button>
                        </div>

                        {/* Notes */}
                        <div>
                            <Label htmlFor="notes">Catatan (opsional)</Label>
                            <Input
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Warna, ukuran, atau permintaan khusus..."
                            />
                        </div>

                        {/* Total + actions */}
                        <div className="flex flex-col gap-3 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">Estimasi Total</span>
                                <span className="text-lg font-bold">
                                    Rp {total.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    Kirim Pre-Order
                                </Button>
                                {data.guest_name && data.guest_phone && data.items[0].product_id && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-green-500 text-green-700 hover:bg-green-50"
                                        asChild
                                    >
                                        <a
                                            href={`https://wa.me/?text=${buildWaMessage()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Konfirmasi via WA
                                        </a>
                                    </Button>
                                )}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                * Pre-order perlu disetujui admin. Kami akan menghubungi Anda via WA/HP.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
