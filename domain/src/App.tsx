import { ThemeProvider } from "@/shadcn-ui/components/theme-provider";
// import styles from "./App.less";
import 'dayjs/locale/zh-cn';
import { RouterProvider} from "react-router-dom";
import router from '@/routers';

function App() {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
