import React, { useContext, useEffect, useRef, useState } from 'react';
import './mouse.less';
// .drag-preview {
//   position: fixed;
//   top: 0;
//   left: 0;
//   border: 1px dashed #eaeaea;
//   pointer-events: none; /* 防止helper元素影响其他元素的事件 */
// }
// .border-highlight-top {
//   border-top-color: red !important;
// }
// .border-highlight-bottom {
//   border-bottom-color: red !important;
// }
// .highlight {
//   background-color: #113af2 !important;
// }
import styles from './index.less';
// .node {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   max-width: 300px;
//   border: 1px dashed #ccc;
//   padding: 5px 10px;
//   margin-top: 5px;
//   transition: background-color 0.2s, border-color 0.2s;
//   cursor: pointer;
//   .leftNode {
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     .move {
//       display: block;
//       cursor: move;
//     }
//   }
// }
import Container from '@/components/Container';
import { to } from '@/utils/util';
import { message } from '@/utils/message';
import { Context } from './Context';
// import React from "react";

// export const Context = React.createContext<any>({});
import {
  CaretDownOutlined,
  CaretRightOutlined,
  FolderOutlined,
  HolderOutlined,
} from '@ant-design/icons';

// 树节点组件，用于递归渲染树
const TreeNode = ({ node, level = 0, onToggle, isExpanded }) => {

  const { previewRef, draggedItemRef, isDraggingRef } = useContext(Context);

  const onMouseDown = (e: any, data: any) => {
    e.preventDefault();
    if (isDraggingRef.current) {
      draggedItemRef.current = e.currentTarget;
      // 创建拖动预览元素
      previewRef.current = document.createElement('div');
      previewRef.current.style.width = `${e.currentTarget.offsetWidth}px`;
      previewRef.current.style.height = `${e.currentTarget.offsetHeight}px`;
      previewRef.current.className = 'drag-preview';
      document.body.appendChild(previewRef.current);

      // 移动位置
      previewRef.current.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
    }
  }

  const onMouseMove = (e: any, data: any) => {
    if (isDraggingRef.current && e.currentTarget !== draggedItemRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY;

      e.currentTarget.classList.toggle('border-highlight-top', y < rect.top + 5);
      e.currentTarget.classList.toggle('border-highlight-bottom', y > rect.bottom - 5);
      e.currentTarget.classList.toggle('highlight', !(y < rect.top + 5 || y > rect.bottom - 5));
    }
  }

  const onMouseOut = (e: any, data: any) => {
    if (e.currentTarget !== draggedItemRef.current) {
      e.currentTarget.classList.remove('border-highlight-top', 'border-highlight-bottom', 'highlight');
    }
  }

  const onMouseUp = (e: any, data: any) => {
    if (e.currentTarget !== draggedItemRef.current) {
      e.currentTarget.classList.remove('border-highlight-top', 'border-highlight-bottom', 'highlight');
    }
  }

  return (
    <>
      <div
        className={styles.node}
        style={{ marginLeft: level * 20 }}
        onMouseDown={(e) => onMouseDown(e, {})}
        onMouseMove={(e) => onMouseMove(e, {})}
        onMouseOut={(e) => onMouseOut(e, {})}
        onMouseUp={(e) => onMouseUp(e, {})}
      >
        <div className={styles.leftNode}>
          <span className={styles.move} onMouseDown={() => {
            isDraggingRef.current = true;
          }}>
            <HolderOutlined />
          </span>
          {node?.children?.length > 0 && (
            <span onClick={() => onToggle(node.id)}>
              {isExpanded[node.id] ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </span>
          )}
          <span>
            <FolderOutlined />
          </span>
          <span>{node.title}</span>
        </div>
        <span>ext</span>
      </div>
      {isExpanded[node.id] &&
        node.children.map((child: any) => (
          <TreeNode
            key={child.id}
            node={child}
            level={level + 1}
            onToggle={onToggle}
            isExpanded={isExpanded}
          />
        ))}
    </>
  );
};

const Tree = (props: any) => {
  const { data } = props;

  // 句柄
  const previewRef = useRef<any>(null);
  const treeRef = useRef<any>(null);
  const draggedItemRef = useRef<any>(null);
  const isDraggingRef = useRef<boolean>(false);

  // 状态：跟踪每个节点的展开状态
  const [isExpanded, setIsExpanded] = useState({});

  useEffect(() => {
    function handleMouseMove(e) {
      if (isDraggingRef.current) {
        if (previewRef.current) {
          previewRef.current.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
        }
      }
    }

    function handleMouseUp() {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (previewRef.current) {
          document.body.removeChild(previewRef.current);
          previewRef.current = null;
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // 处理节点展开/折叠的函数
  const toggleNode = (nodeId: any) => {
    setIsExpanded((prevState) => {
      const newState = { ...prevState };
      const currentExpandedState = { ...newState[nodeId] };
      // 切换当前节点的展开状态
      newState[nodeId] = !newState[nodeId];
      return newState;
    });
  };

  return (
    <Context.Provider value={{
      previewRef,
      draggedItemRef,
      isDraggingRef
    }}>
      <div ref={treeRef}>
        {(data || []).map((node: any) => (
          <TreeNode key={node.id} node={node} onToggle={toggleNode} isExpanded={isExpanded} />
        ))}
      </div>
    </Context.Provider>
  );
};

function project() {
  // op 1 不变 2 新增一级 3 删除一级 4 新增/删除 二级

  // 初始查询
  useEffect(() => {
    init();
  }, []);

  // 查询表头信息
  const init = async () => {
    // const [err, res] = await to(await queryStandards());
    // if(res) {
    //   console.log('%c [ res ]-22', 'font-size:13px; background:pink; color:#bf2c9f;', res);
    // } else {
    //   message.error("获取数据失败");
    // }
  };

  return (
    <div className={styles.warp}>
      <Container>
          <Tree
            data={[
              {
                id: 1,
                title: 'Node 1',
                children: [
                  {
                    id: 2,
                    title: 'Node 1.1',
                    children: [],
                  },
                  {
                    id: 3,
                    title: 'Node 1.2',
                    children: [],
                  },
                ],
              },
              {
                id: 4,
                title: 'Node 2',
                children: [
                  {
                    id: 5,
                    title: 'Node 2.1',
                    children: [],
                  },
                ],
              },
              {
                id: 6,
                title: 'Node 3',
                children: [],
              },
            ]}
          />
      </Container>
    </div>
  );
}

export default project;
