import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, ShoppingCart, Package, CheckSquare } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { useLocale } from '@/hooks/use-locale';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const { locale, setLocale, t } = useLocale();
    const isAdmin = auth.user?.role === 'admin';

    const mainNavItems: NavItem[] = [
        { title: t('dashboard'), href: dashboard(), icon: LayoutGrid },
        { title: t('orders'), href: '/orders', icon: ShoppingCart },
        ...(isAdmin ? [
            { title: t('products'), href: '/products', icon: Package },
            { title: t('approvals'), href: '/approvals', icon: CheckSquare },
        ] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <div className="px-2 py-1">
                    <button
                        onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                        className="text-muted-foreground hover:text-foreground w-full rounded px-2 py-1 text-left text-xs transition-colors"
                    >
                        🌐 {locale === 'id' ? 'English' : 'Indonesia'}
                    </button>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
