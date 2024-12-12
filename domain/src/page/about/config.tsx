import { AppWindowIcon, FolderCodeIcon } from "lucide-react";
import { z } from "zod";
import { customAlphabet } from 'nanoid';

export const nanoid = customAlphabet('1234567890', 10);

export interface ItemProps {
  id: string; // 唯一值 
  name: string; // 名称
  type: string; // 类型 folder url
  icon?: string; // icon 只有网址才有
  url?: string; // url 只有网址才有
  addDate?: string; // 新增日期
  lastModified?: string; // 最后修改日期
  children?: ItemProps[]; // 子目录
}

// 书签创建选项
export const bookmarkConfig = [
  {
    key: 1,
    icon: AppWindowIcon,
    title: "导入浏览器书签文件并自动生成"
  },
  {
    key: 2,
    icon: FolderCodeIcon,
    title: "从零开始手动创建"
  }
];

// 定义校验模式
const baseSchema = z.object({
  bookmarkName: z.string().min(1, '书签名称至少需要1个字符').max(50, '书签名称最多不超过50个字符'),
});

const fileSchema = z.object({
  file: z.string().regex(/\.html$/, '文件必须是.html格式'),
  // file: z.instanceof(File).refine((file) => file.type === 'text/html', {
  //   message: '文件必须是 .html 格式',
  // }),
});

// 根据 type 动态构建 schema
export function getDynamicSchema(type: number) {
  switch (type) {
    case 1:
      // 如果 type 为 1，校验 bookmarkName 和 file
      return baseSchema.and(fileSchema);
    case 2:
      // 如果 type 为 2，只校验 bookmarkName
      return baseSchema;
    default:
      // 默认情况或其他类型，可以抛出错误或返回一个基本的 schema
      throw new Error('Unsupported type');
  }
}

export function walkBookmarksTree(root: any, result: any[]) {
  let node = root.querySelector("dl");
  let els = node.children;
  if (els && els.length > 0) {
    for (let i = 0; i < els.length; i++) {
      let item = els[i];
      // p标签直接跳过
      if (item.tagName === "P") {
        continue;
      }
      // dt标签
      if (item.tagName === "DT") {
        let h3Node = item.querySelector("h3");
        let aNode = item.querySelector("a");
        let dlNode = item.querySelector("dl");
        let child = null;
        if (h3Node && dlNode) {
          child = {
            id: `folder_${nanoid(5)}`,
            name: h3Node.innerText ?? "",
            folder: true,
            addDate: h3Node.getAttribute("add_date"),
            lastModified: h3Node.getAttribute("last_modified"),
            children: [],
          };
          walkBookmarksTree(item, child.children);
          result.push(child);
        } else if (aNode) {
          result.push({
            id: `url_${nanoid(5)}`,
            name: aNode.innerText ?? "",
            url: aNode.href ?? "",
            addDate: aNode.getAttribute("add_date") ?? "",
            icon: aNode.getAttribute("icon") ?? "",
          })
        }
      }
    }
  }
  return result;
}

export const to = async (promise: Promise<any>) => {
  try {
    const res = await promise;
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}

export const readAsStringAsync = async (file: Blob) => {
  const result: any[] = [];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bookmarksHtml = e.target.result;
      const parser = new DOMParser();
      const root = parser.parseFromString(bookmarksHtml, "text/html");
      walkBookmarksTree(root, result);
      resolve(result);
    };
    reader.onerror = () => {
      reject(result);
    };
    reader.readAsText(file);
  });
};

class Url {

  id: string;
  name: string;
  directoryId: string;
  icon: string;
  url: string;
  addDate: string;
  lastModified: string;

  constructor(id: string, name: string, directoryId: string, icon: string, url: string, addDate: string, lastModified: string) {
    this.id = id;
    this.name = name;
    this.directoryId = directoryId;
    this.icon = icon;
    this.url = url;
    this.addDate = addDate;
    this.lastModified = lastModified;
  }
}

class Directory {

  id: string;
  name: string;
  parentId: string;
  addDate: string; // 新增日期
  lastModified: string; // 最后修改日期
  children: Directory[];
  urls: Url[];

  constructor(id: string, name: string, parentId: string, addDate: string, lastModified: string) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.addDate = addDate;
    this.lastModified = lastModified;
    this.children = [];
    this.urls = [];
  }

  addDirectory(directory: Directory) {
    this.children.push(directory);
  }

  removeDirectory(directoryId: string) {
    this.children = this.children.filter(directory => directory.id !== directoryId);
  }

  addUrl(url: Url) {
    this.urls.push(url);
  }

  removeUrl(urlId: string) {
    this.urls = this.urls.filter(url => url.id !== urlId);
  }
}

class Title {

  id: string;
  name: string;
  directorys: Directory[];
  unassignedUrls: Url[];
  
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.directorys = []; // 存储目录
    this.unassignedUrls = []; // 存储未分配的网址
  }

  addDirectory(directory: Directory) {
    this.directorys.push(directory);
  }

  removeDirectory(directoryId: string) {
    this.directorys = this.directorys.filter(directory => directory.id !== directoryId);
  }

  addUnassignedUrl(url: Url) {
    this.unassignedUrls.push(url);
  }
  
  removeUnassignedUrl(urlId: string) {
    this.unassignedUrls = this.unassignedUrls.filter(url => url.id !== urlId);
  }
}

export const handleBookmark = (data: any[], node: any, serachList: any[]) => {
  data.forEach((item: any, index: number) => {

    let newNode: any = null;

    if(item.name === "书签栏" && index === 0) {
      item.children && handleBookmark(item.children, node, serachList);
    } else if(item.folder) {
      
      // 是书签名下的目录
      if(node instanceof Title) {
        newNode = new Directory(item.id, item.name, "0", item.addDate, item.lastModified);
        node.addDirectory(newNode);
      } else if (node instanceof Directory) {
        newNode = new Directory(item.id, item.name, node.id, item.addDate, item.lastModified);
        node.addDirectory(newNode);
      }

      serachList.push({
        id: item.id, // 唯一值 
        name: item.name, // 名称
        type: "folder", // 类型 folder url
        icon: item.icon ?? '', // icon 只有网址才有
        url: item.url ?? '', // url 只有网址才有
      })
    } else if(!item.folder) {
      // 是书签名下的网址
      if(node instanceof Title) {
        newNode = new Url(item.id, item.name, "0", item.icon, item.url, item.addDate, item.lastModified);
        node.addUnassignedUrl(newNode);
      } else if (node instanceof Directory) {
        newNode = new Url(item.id, item.name, node.id, item.icon, item.url, item.addDate, item.lastModified);
        node.addUrl(newNode);
      }

      serachList.push({
        id: item.id, // 唯一值 
        name: item.name, // 名称
        type: "url", // 类型 folder url
        icon: item.icon ?? '', // icon 只有网址才有
        url: item.url ?? '', // url 只有网址才有
      })
    }

    if(newNode && item.children) {
      item.children && handleBookmark(item.children, newNode, serachList);
    }
  })
}

export {
  Title,
  Directory,
  Url
}
