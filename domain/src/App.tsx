import { ThemeProvider } from "@/shadcn-ui/components/theme-provider";
// import styles from "./App.less";
import 'dayjs/locale/zh-cn';
import { RouterProvider} from "react-router-dom";
import router from '@/routers';
import localforage from "localforage";

function App() {

  useEffect(() => {
    localforage.config({
      name: 'vscing'
    });
  }, []);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
