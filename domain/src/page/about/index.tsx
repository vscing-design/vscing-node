import { Icons } from "@/assets/icons";
import Header from "@/components/Header";
import { Label } from "@/shadcn-ui/ui/label";

function About() {
  return <div>
    <Header/>
    
    <div>
      <div>导入或创建书签库</div>
      <div>
      <Label
        htmlFor="paypal"
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        <Icons.paypal className="mb-3 h-6 w-6" />
        Paypal
      </Label>
      </div>
    </div>
    
  </div>
}

export default About;