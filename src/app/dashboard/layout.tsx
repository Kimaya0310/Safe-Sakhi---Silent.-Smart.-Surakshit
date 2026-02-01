'use client';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/auth-provider';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Home,
  LogOut,
  PanelLeft,
  Settings,
  ShieldAlert,
  Siren,
  User,
  Activity,
  UserCheck,
  Building,
  ShieldCheck,
  LineChart,
  FileClock,
  SlidersHorizontal,
} from 'lucide-react';
import React from 'react';
import { AppStateProvider } from '@/context/app-state-provider';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import FirebaseErrorListener from '@/components/FirebaseErrorListener';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);
  
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const navItems = {
    passenger: [
      { icon: Home, label: 'Home', href: '/dashboard' },
      { icon: Activity, label: 'Ride History', href: '/dashboard/ride-history' },
      { icon: UserCheck, label: 'Emergency Contacts', href: '/dashboard/emergency-contacts' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    responder: [
      { icon: Siren, label: 'Active Alerts', href: '/dashboard' },
      { icon: Activity, label: 'Past Incidents', href: '/dashboard/past-incidents' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    authority: [
      { icon: ShieldAlert, label: 'Emergency Cases', href: '/dashboard' },
      { icon: Building, label: 'Organizations', href: '/dashboard/organizations' },
      { icon: LineChart, label: 'Analytics', href: '/dashboard/analytics' },
      { icon: FileClock, label: 'Audit Log', href: '/dashboard/audit-log' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
    admin: [
        { icon: LineChart, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: FileClock, label: 'Audit Log', href: '/dashboard/audit-log' },
        { icon: SlidersHorizontal, label: 'System Config', href: '/dashboard/system-config' },
    ]
  }

  return (
    <AppStateProvider>
      <FirebaseErrorListener />
      <div className="flex min-h-screen w-full bg-muted/40">
        <aside className={`relative z-10 flex-col border-r bg-card transition-all duration-300 ${isSidebarOpen ? 'flex w-64' : 'hidden w-0 md:flex md:w-16'}`}>
          <div className="flex h-16 shrink-0 items-center border-b px-6">
             <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'md:opacity-0 md:w-0'}`}>
                <Logo />
             </div>
             <ShieldCheck className={`transition-all duration-300 ${!isSidebarOpen ? 'h-6 w-6' : 'md:hidden'}`} />
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="grid gap-2 px-4">
              {(navItems[user.role] || []).map(item => (
                <li key={item.label}>
                   <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: pathname === item.href ? 'secondary' : 'ghost' }),
                        'w-full justify-start gap-2'
                      )}
                   >
                      <item.icon className="h-4 w-4" />
                      <span className={`${isSidebarOpen ? 'inline' : 'md:hidden'}`}>{item.label}</span>
                   </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
            <Button size="icon" variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="shrink-0" suppressHydrationWarning>
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex items-center gap-4">
               <span className="text-sm font-medium text-muted-foreground">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" suppressHydrationWarning>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </AppStateProvider>
  );
}
