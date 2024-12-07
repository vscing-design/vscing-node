import { useContext, useEffect, useRef, useState } from 'react';
import './mouse.less';
import styles from './index.module.less';
import { Context } from './Context';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  FolderOutlined,
  HolderOutlined,
} from '@ant-design/icons';

// 树节点组件，用于递归渲染树
const TreeNode = ({ node, level = 0, onToggle, isExpanded }: any) => {

  const { previewRef, draggedItemRef, currDataRef, isDraggingRef, positionRef } = useContext(Context);

  const onMouseDown = (e: any, data: any) => {
    e.preventDefault();
    if (isDraggingRef.current) {
      const { node } = data;
      if(node.id && isExpanded[node.id]) {
        onToggle(node.id);
      }
      
      draggedItemRef.current = e.currentTarget;
      currDataRef.current = data;
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
      const { node } = data;
      if(node.id && !isExpanded[node.id]) {
        onToggle(node.id);
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY;

      if(y < rect.top + 5 && y > rect.top - 5) {
        positionRef.current = 1;
      } else if(y > rect.bottom - 5 && y > rect.bottom + 5) {
        positionRef.current = 3;
      } else if(y > rect.top + 5 && y < rect.bottom - 5) {
        positionRef.current = 2;
      }

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
      // 数据处理
      const { node } = data;
      const prevNode = currDataRef.current;
      // 判断方位
      switch (positionRef.current) {
        case 1:
          // prevNode放置在node上面，并移除prevNode数据
          break;
        case 2:
          // prevNode放置在node里面第一个，并移除prevNode数据
          break;
        case 3:
          // prevNode放置在node下面，并移除prevNode数据
          break;
      }
      e.currentTarget.classList.remove('border-highlight-top', 'border-highlight-bottom', 'highlight');
    }
  }

  return (
    <>
      <div
        className={styles.node}
        style={{ marginLeft: level * 20 }}
        onMouseDown={(e) => onMouseDown(e, {
          node
        })}
        onMouseMove={(e) => onMouseMove(e, {
          node
        })}
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

  // 将树形结构转换为带有索引和映射表的扁平数组
  function flattenTree(tree: any[], indexMap = new Map()) {
    const flatArray: any[] = [];
    let currentIndex = 0;

    function traverse(node: any, parentId: number, level: number) {
      const newIndex = currentIndex++;
      flatArray.push({ ...node, parentId, level });
      indexMap.set(node.id, newIndex);

      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => traverse(child, node.id, level + 1));
      }
    }

    tree.forEach(node => traverse(node, 0, 1));
    return { flatArray, indexMap };
  }

console.log(flattenTree(data));

  // 句柄
  const previewRef = useRef<any>(null);
  const draggedItemRef = useRef<any>(null);
  const currDataRef = useRef<any>(null);
  const isDraggingRef = useRef<boolean>(false);
  const positionRef = useRef<number>(0); // 1 放置在元素上方 2 放置在元素下级 3 放置在元素下方 

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
      const newState: any = { ...prevState };
      // 切换当前节点的展开状态
      newState[nodeId] = !newState[nodeId];
      return newState;
    });
  };

  return (
    <Context.Provider value={{
      previewRef,
      draggedItemRef,
      currDataRef,
      isDraggingRef,
      positionRef
    }}>
      <div>
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
    <div>
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
    </div>
  );
}

export default project;
