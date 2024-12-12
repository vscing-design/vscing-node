// import { Icons } from "@/assets/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/shadcn-ui/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn-ui/ui/form";
import { Input } from "@/shadcn-ui/ui/input";
import { Label } from "@/shadcn-ui/ui/label";
import { z } from "zod";
import { Card, CardContent } from "@/shadcn-ui/ui/card";
import { BellRing, Check, ChevronsUpDown, Plus } from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { bookmarkConfig, getDynamicSchema, readAsStringAsync, Title, Directory, Url, ItemProps, nanoid, handleBookmark } from "./config";
import localforage from "localforage";
import styles from './index.module.less';
import { Sidebar, SidebarInset, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/shadcn-ui/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shadcn-ui/ui/dropdown-menu";
import Images from "@/assets"
import { useTheme } from "@/shadcn-ui/components/theme-provider";
import TreeMenu from "@/components/TreeMenu";

function About() {

  const { theme, setTheme } = useTheme();

  const isDark = useMemo(() => {
    return theme === 'dark' || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [theme]);

  // 文件资源句柄
  const fileRef = useRef<any>();
  // 存储所有书签库名字列表、书签库下的目录、网址
  const storeRef = useRef<Title[]>([]);
  // 存储所有目录和网址的扁平化数组
  const serachListRef = useRef<ItemProps[]>([]); 

  // 变量定义
  const [createType, setCreateType] = useState<number>(1);
  const [loading, setLoading] = useState<number>(1); // loading状态 1 导入中 2 导入成功 3 导入失败
  const [status, setStatus] = useState<number>(0); // 0 加载中 1 创建页 2 管理页
  const [currData, setCurrData] = useState<any>();

  useEffect(() => {
    init();
  }, []);

  // 初始化数据
  const init = async() => {
    try {
      const newStatus: any = await localforage.getItem('status');
      storeRef.current = await localforage.getItem('store') ?? [];
      serachListRef.current = await localforage.getItem('serachList') ?? [];
      setStatus(newStatus ?? 1);
    } catch(err) {
      console.error(err);
    }
  }

  // 根据 type 动态创建表单 schema
  const formSchema = getDynamicSchema(createType);

  // 声明表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookmarkName: "",
      file: undefined,
    },
  });

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    if (files && files[0]) {
      // 将 File 对象设置为 field 的值
      fileRef.current = files[0];
    }
  };

  const loadingText = useMemo(() => {
    if(loading === 1) {
      return "导入中";
    } else if(loading === 2) {
      return "导入成功";
    } else if (loading === 3) {
      return "导入失败";
    } else {
      return "";
    }
  }, [loading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log('%c [ values, fileRef.current ]-46', 'font-size:13px; background:pink; color:#bf2c9f;', values, fileRef.current);
    setLoading(1);

    try {
      // 数据处理
      const titleId = `title_${nanoid(5)}`;
      const titleNode = new Title(titleId, values.bookmarkName);
      const fileData: any = await readAsStringAsync(fileRef.current);
      handleBookmark(fileData, titleNode, serachListRef.current);
      storeRef.current.push(titleNode);
      
      localforage.setItem('store', storeRef.current);
      localforage.setItem('serachList', serachListRef.current);
      localforage.setItem('status', 2);
      setStatus(2);
      setLoading(2);
    } catch (err) {
      setLoading(3);
    }
  }

  return <>
    {status === 0 && <div>loading</div>}
    {status === 1 && <div>
      <Header />
      <div className="flex flex-col items-center">

        <div className="mt-10 h-7 font-semibold text-xl">导入或创建书签库{loadingText}</div>

        <div className="flex items-center gap-4 mt-12">
          {
            bookmarkConfig.map((item: any) => {

              const IconComponent = item.icon ?? null;

              return <Label
                key={item.key}
                onClick={() => setCreateType(item.key)}
                className="w-[236px] h-[92px] rd-lg flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary relative"
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.title}</span>
                {
                  createType === item.key && <div className="absolute top-0 right-0 bg-gray-400 flex items-center justify-center">
                  <Check />
                </div>}
                
              </Label>
            })
          }
        </div>

        <Card className="w-[488px] mt-4">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="bookmarkName"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>书签库名字</FormLabel>
                      <FormControl>
                        <Input placeholder="如：设计导航" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {createType === 1 && <FormField
                  control={form.control}
                  name="file"
                  render={({ field }: any) => {
                    return (
                      <FormItem>
                        <FormLabel>书签文件</FormLabel>
                        <FormControl>
                          {/* <Input type="file" {...field} /> */}
                          <label className={`${styles.upload}`} htmlFor={field.id}>
                            <Plus />
                            <span>点击或拖拽文件上传</span>
                            <Input
                              id={field.id}
                              type="file"
                              onChange={(e: any) => {
                                field?.onChange(e);
                                handleFileChange(e);
                              }}
                              style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                            />
                          </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />}
                <Button className="w-full" type="submit">
                  立即{createType === 1 ? "生成" : "创建"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

      </div>
    </div>}
    {
      status === 2 && <SidebarProvider>
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
          <TreeMenu 
            store={storeRef.current?.[0]} 
            data={storeRef.current?.[0]?.directorys ?? []} 
            handleClick={(node: any) => {
              console.log('%c [ node ]-263', 'font-size:13px; background:pink; color:#bf2c9f;', node)
              setCurrData(node);
            }}
          />
          <div className={styles.list}>
            <div>目录信息 </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
    }
  </>
}

export default About;
