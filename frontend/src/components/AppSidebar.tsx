import { Link, useLocation } from 'react-router-dom'
import { BarChart3, CalendarCheck, CalendarRange, Receipt, Wallet, Settings, PlusCircle } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()

  const mainMenuItems = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      path: '/',
    },
    {
      title: 'Minhas Apostas',
      icon: Receipt,
      path: '/apostas',
    },
    {
      title: 'Nova Aposta',
      icon: PlusCircle,
      path: '/nova-aposta',
    },
    {
      title: 'Bancas',
      icon: Wallet,
      path: '/bancas',
    },
    {
      title: 'Fechamento',
      icon: CalendarCheck,
      path: '/fechamento',
    },
    {
      title: 'Anual',
      icon: CalendarRange,
      path: '/anual',
    },
    {
      title: 'Configurações',
      icon: Settings,
      path: '/configuracoes',
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
    >
      {/* Header Premium - Expandido */}
      <div className="pt-8 pb-6 px-4 group-data-[collapsible=icon]:hidden">
        <h1 className="text-2xl font-bold text-sidebar-foreground">BetPulse</h1>
      </div>


      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-6 px-3 pt-6 pb-8 group-data-[collapsible=icon]:space-y-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <SidebarMenuItem key={item.path} className="group-data-[collapsible=icon]:w-auto">
                    {state === "collapsed" ? (
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-center justify-center rounded-xl transition-all duration-200",
                              "px-2.5 py-2",
                              isActive
                                ? "bg-primary/12 text-primary shadow-[0_6px_16px_-10px_rgba(37,99,235,0.65)] dark:bg-primary/22 dark:text-primary-foreground dark:shadow-[0_10px_22px_-14px_rgba(79,70,229,0.9)]"
                                : "text-muted-foreground hover:bg-accent/90 hover:text-accent-foreground dark:text-sidebar-foreground/80 dark:hover:bg-sidebar-accent"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                              )}
                              strokeWidth={2}
                            />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="bg-popover text-popover-foreground border-border px-3 py-1.5 text-sm font-medium"
                        >
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] transition-all duration-200 w-full",
                          isActive
                            ? "bg-primary/12 text-primary font-semibold shadow-[0_8px_20px_-14px_rgba(37,99,235,0.7)] dark:bg-primary/22 dark:text-primary-foreground dark:shadow-[0_12px_24px_-16px_rgba(79,70,229,0.95)]"
                            : "text-muted-foreground hover:bg-accent/90 hover:text-accent-foreground dark:text-sidebar-foreground/80 dark:hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                          strokeWidth={2}
                        />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center justify-between rounded-xl border border-sidebar-border/90 bg-sidebar-accent/80 px-3 py-2 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.5)] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 dark:bg-sidebar-accent/90 dark:shadow-[0_10px_22px_-16px_rgba(2,6,23,0.98)]">
          <span className="text-xs font-medium text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">
            Tema
          </span>
          <ThemeToggle />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
