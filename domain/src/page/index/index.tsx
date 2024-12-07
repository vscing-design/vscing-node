import { BellRing, ChevronsUpDown, Moon, Plus, Sun } from "lucide-react"

import { Button } from "@/shadcn-ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn-ui/ui/dropdown-menu"
import { useTheme } from "@/shadcn-ui/components/theme-provider"
import { Sidebar, SidebarInset, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/shadcn-ui/ui/sidebar"
import { useMemo } from "react"
import Images from "@/assets"
import TreeMenu from "@/components/TreeMenu"

function ModeToggle() {

  const { theme, setTheme } = useTheme();

  const isDark = useMemo(() => {
    return theme === 'dark' || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [theme]);

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <div className="w-[122px] h-[24px]">
          <img src={isDark ? Images.darkLogo : Images.lightLogo} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <span className="truncate text-xs">设计导航</span>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-356 rounded-lg"
            align="center"
            side="bottom"
            sideOffset={4}
          >
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  设计网站
                </p>
                <p className="text-sm text-muted-foreground">
                  127个网站
                </p>
              </div>
              <div className="flex">
                <BellRing />
                <BellRing />
              </div>
            </div>
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  设计网站
                </p>
                <p className="text-sm text-muted-foreground">
                  127个网站
                </p>
              </div>
              <div className="flex">
                <BellRing />
                <BellRing />
              </div>
            </div>
            <Button>导入或创建书签库</Button>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>预览书签库</div>
       
      </Sidebar>
      <SidebarInset>
        <main>
          <SidebarTrigger />
          123333
          <TreeMenu />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ModeToggle;
