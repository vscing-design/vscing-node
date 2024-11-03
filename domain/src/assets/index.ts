// 本地
const imagesFiles: any = import.meta.glob('./images/**/*.*', { eager: true });

const Images = Object.keys(imagesFiles).reduce((files: { [key: string]: any }, path: string) => {
  const fileName = path.replace(/^\.\/images\/(.*)\.\w+$/, '$1');
  files[fileName] = imagesFiles[path]?.default;
  return files;
}, {});

export default Images;
