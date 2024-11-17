# 1.0.0

- [vite](https://cn.vite.dev/)
- [shadcn ui](https://www.shadcn.com.cn/)
- [tree](https://mui.com/x/react-tree-view/getting-started/#installation)
- [localForage](https://localforage.github.io/localForage/)
- [zustand](https://zustand-demo.pmnd.rs/)
- [书签](https://mp.weixin.qq.com/s/XTaJreIdUeBuFFQxG4nz3g， https://juejin.cn/team/6930507995474313230/posts，https://www.codefather.cn/)
- webwork、indexdb、批量导入

-     <input type="file" id="fileInput" />
</body>
<script>
    function parseBookmarks(bookmarksHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(bookmarksHtml, 'text/html');
        const folders = [];
        const noFolderLinks = [];

        // 递归函数用于提取文件夹和链接
        function traverse(node) {
            Array.from(node.querySelectorAll('DL')).forEach(folderNode => {
                const folderTitle = folderNode.querySelector('H3');
                if (folderTitle) {
                    const folder = {
                        title: folderTitle.textContent.trim(),
                        links: [],
                        subFolders: []
                    };
                    folders.push(folder);
                    const subDl = folderNode.querySelectorAll('DL');
                    // 查找子文件夹
                    subDl.forEach(subFolder => {
                        traverse(subFolder);
                    });
                    const links = folderNode.querySelectorAll('A');
                    links.forEach(link => {
                        folder.links.push({
                            title: link.textContent.trim(),
                            url: link.href
                        });
                    });
                }
            });
            // 没有文件夹的链接
            Array.from(node.querySelectorAll('A')).forEach(link => {
                noFolderLinks.push({
                    title: link.textContent.trim(),
                    url: link.href
                });
            });
        }

        traverse(doc.body);
        return { folders, noFolderLinks };
    }

    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            console.log(contents); // 输出文件内容
            // 你可以在这里进一步解析HTML内容
        };
        reader.onerror = function (e) {
            console.error("File could not be read! Code " + e.target.error.code);
        };

        reader.readAsText(file); // 读取文件内容为文本
    });

    // webwork 处理数据
    // 解析数据
    // indexdb 存储数据
    // 不支持的情况处理
</script>
