import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: 'light' }}>
            <header className="sticky top-0 z-10 bg-white shadow-sm">
                <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
                    <Link href="/" className="text-lg font-bold text-gray-900">
                        {import.meta.env.VITE_APP_NAME || 'KahuOrder'}
                    </Link>
                    <nav className="flex gap-4 text-sm">
                        <Link href="/catalog" className="text-gray-600 hover:text-gray-900">
                            Katalog
                        </Link>
                        <Link href="/order" className="font-medium text-blue-600 hover:text-blue-800">
                            Pesan
                        </Link>
                        <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                            Cek Order
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
        </div>
    );
}
