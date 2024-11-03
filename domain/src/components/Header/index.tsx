import Images from "@/assets";
import { Icons } from "@/assets/icons";
import { useTheme } from "@/shadcn-ui/components/theme-provider";
import { Button } from "@/shadcn-ui/ui/button";
import { Moon, Sun } from "lucide-react";
import { useMemo } from "react";

function Header() {

  const { theme, setTheme } = useTheme();

  const isDark = useMemo(() => {
    return theme === 'dark' || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [theme]);

  return <div className="flex justify-between items-center w-[1440px] h-[72px] mx-auto pl-[24px] pr-[32px]">
    <div className="w-[122px] h-[24px]">
      <img src={isDark ? Images.darkLogo : Images.lightLogo}/>
    </div>

    <div className="flex gap-[16px]">
      <Button variant="outline" size="icon">
        <img src={Images.beer} width={16} />
      </Button>
      <Button variant="outline" size="icon">
        <Icons.gitHub />
      </Button>
      <Button variant="outline" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")}>
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  </div>
}

export default Header;