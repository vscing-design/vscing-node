import React from 'react';
import * as Icons from '@ant-design/icons';

// 线上
let scriptUrl = [];
try {
  scriptUrl = JSON.parse(import.meta.env.VITE_ICON_SCRIPTURL.replace(/'/g, '"'));
} catch (error) {
  console.error(error);
}
export const IconFont = Icons.createFromIconfontCN({
  scriptUrl: scriptUrl
});

// 组件类型
export interface IProps {
  name?: string | undefined;
  [key: string]: any;
}

const VIcon = (props: IProps) => {

  const name = props.name;

  if(!name) return null;

  const newProps = {...props, name: undefined}

  if(name!.startsWith('icon-')) {
    return <IconFont type={name!} {...newProps} />
  }

  return React.createElement((Icons as any)[name], newProps)
}

export default VIcon;
