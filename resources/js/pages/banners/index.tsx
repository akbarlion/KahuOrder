import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

interface Banner {
    id: number;
    title: string;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    order: number;
}

export default function BannersIndex({ banners }: { banners: Banner[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '', image_url: '', link_url: '', is_active: true, order: 0,
    });

    const { delete: destroy } = useForm();

    return (
        <>
            <Head title="Banners" />
            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold">Manajemen Banner</h1>

                {/* Add form */}
                <Card>
                    <CardHeader><CardTitle className="text-base">Tambah Banner</CardTitle></CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => { e.preventDefault(); post('/banners', { onSuccess: () => reset() }); }}
                            className="space-y-3"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Judul</Label>
                                    <Input value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                    <InputError message={errors.title} />
                                </div>
                                <div>
                                    <Label>URL Gambar</Label>
                                    <Input placeholder="https://..." value={data.image_url} onChange={(e) => setData('image_url', e.target.value)} required />
                                    <InputError message={errors.image_url} />
                                </div>
                                <div>
                                    <Label>URL Link (opsional)</Label>
                                    <Input placeholder="https://..." value={data.link_url} onChange={(e) => setData('link_url', e.target.value)} />
                                    <InputError message={errors.link_url} />
                                </div>
                                <div>
                                    <Label>Urutan</Label>
                                    <Input type="number" min={0} value={data.order} onChange={(e) => setData('order', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <Label htmlFor="is_active">Aktif</Label>
                            </div>
                            <Button type="submit" disabled={processing}>Simpan</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List */}
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left">Judul</th>
                                <th className="px-4 py-3 text-left">Gambar</th>
                                <th className="px-4 py-3 text-center">Aktif</th>
                                <th className="px-4 py-3 text-right">Urutan</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                                        Belum ada banner.
                                    </td>
                                </tr>
                            )}
                            {banners.map((banner) => (
                                <tr key={banner.id} className="border-t">
                                    <td className="px-4 py-3">{banner.title}</td>
                                    <td className="px-4 py-3">
                                        <img src={banner.image_url} alt={banner.title} className="h-10 w-20 rounded object-cover" />
                                    </td>
                                    <td className="px-4 py-3 text-center">{banner.is_active ? '✅' : '—'}</td>
                                    <td className="px-4 py-3 text-right">{banner.order}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => { if (confirm('Hapus banner ini?')) destroy(`/banners/${banner.id}`); }}
                                        >
                                            Hapus
                                        </Button>
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

BannersIndex.layout = {
    breadcrumbs: [{ title: 'Banners', href: '/banners' }],
};
