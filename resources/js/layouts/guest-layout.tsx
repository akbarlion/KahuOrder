import { Link } from '@inertiajs/react';
import { ClipboardList, Search, ShoppingBag } from 'lucide-react';

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-h-screen bg-zinc-50 text-zinc-950"
            style={{ colorScheme: 'light' }}
        >
            <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <Link
                        href="/"
                        className="text-lg font-bold tracking-normal text-zinc-950"
                    >
                        {import.meta.env.VITE_APP_NAME || 'KahuOrder'}
                    </Link>
                    <nav className="grid grid-cols-3 gap-1 rounded-md bg-zinc-100 p-1 text-sm sm:flex sm:bg-transparent sm:p-0">
                        <Link
                            href="/catalog"
                            className="inline-flex min-h-9 items-center justify-center gap-2 rounded px-3 font-medium text-zinc-600 hover:bg-white hover:text-zinc-950 sm:hover:bg-zinc-100"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Katalog
                        </Link>
                        <Link
                            href="/order"
                            className="inline-flex min-h-9 items-center justify-center gap-2 rounded bg-zinc-950 px-3 font-medium text-white hover:bg-zinc-800"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Pesan
                        </Link>
                        <Link
                            href="/orders"
                            className="inline-flex min-h-9 items-center justify-center gap-2 rounded px-3 font-medium text-zinc-600 hover:bg-white hover:text-zinc-950 sm:hover:bg-zinc-100"
                        >
                            <Search className="h-4 w-4" />
                            Cek Order
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
                {children}
            </main>
        </div>
    );
}
