import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import './mouse.less';
import styles from './index.module.less';
import { Context } from './Context';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  FolderOutlined,
  HolderOutlined,
} from '@ant-design/icons';

// 将树形结构转换为带有索引和映射表的扁平数组
function flattenTree(tree: any[]) {
  const flatArray: any[] = [];
  const indexMap: any = new Map();
  let currentIndex = 0;

  function traverse(node: any, pid: number, level: number) {
    flatArray.push({
      id: node.id,
      title: node.title,
      pid,
      level
    });

    indexMap.set(node.id, currentIndex);
    currentIndex++;

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => traverse(child, node.id, level + 1));
    }
  }

  tree.forEach(node => traverse(node, 0, 1));
  return [flatArray, indexMap];
}

// 根据更新后的扁平数组重建树形结构
function rebuildTree(flatArray: any[]) {
  const map = new Map();
  const tree: any = [];

  flatArray.forEach(node => {
    map.set(node.id, { ...node, children: [] });
  });

  flatArray.forEach(node => {
    if (node.pid === 0) {
      tree.push(map.get(node.id));
    } else {
      const parent = map.get(node.pid);
      if (parent) {
        parent.children.push(map.get(node.id));
      }
    }
  });

  return tree;
}

// 树节点组件，用于递归渲染树
const TreeNode = ({ node, level = 0 }: any) => {

  const { previewRef, draggedItemRef, currDataRef, isDraggingRef, positionRef, toggleNode, isExpanded, flatObj, changeTree } = useContext(Context);
  const [flatArray, indexMap] = flatObj;


  const onMouseDown = (e: any, data: any) => {
    e.preventDefault();
    if (isDraggingRef.current) {
      const { node } = data;
      if (node.id && isExpanded[node.id]) {
        toggleNode(node.id);
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
      if (node.id && !isExpanded[node.id]) {
        toggleNode(node.id);
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY;

      if (y < rect.top + 5) {
        positionRef.current = 1;
      } else if (y > rect.bottom - 5) {
        positionRef.current = 3;
      } else if (!(y < rect.top + 5 || y > rect.bottom - 5)) {
        positionRef.current = 2;
      }

      e.currentTarget.classList.toggle('border-highlight-top', y < rect.top + 5);
      e.currentTarget.classList.toggle('border-highlight-bottom', y > rect.bottom - 5);
      e.currentTarget.classList.toggle('highlight', !(y < rect.top + 5 || y > rect.bottom - 5));
    }
  }

  const onMouseOut = (e: any, data: any) => {
    if (isDraggingRef.current && e.currentTarget !== draggedItemRef.current) {
      e.currentTarget.classList.remove('border-highlight-top', 'border-highlight-bottom', 'highlight');
      positionRef.current = 0;
    }
  }

  const onMouseUp = (e: any, data: any) => {
    // 数据处理
    const { node } = data;
    const { node: prevNode } = currDataRef.current;
    if (isDraggingRef.current && e.currentTarget !== draggedItemRef.current && node.id && prevNode.id) {
      
      console.log('%c [ positionRef.current ]-127', 'font-size:13px; background:pink; color:#bf2c9f;', positionRef.current)

      const updatedFlatArray: any = [...flatArray];
      const updatedIndexMap: any = new Map(indexMap);

      // 查找被拖拽的节点及其索引
      const draggedIndex = updatedIndexMap.get(prevNode.id);
      const draggedNode = updatedFlatArray[draggedIndex];

      // 查找目标节点
      const targetIndex = updatedIndexMap.get(node.id);
      const targetNode = updatedFlatArray[targetIndex];

      // 移除原位置的节点
      updatedFlatArray.splice(draggedIndex, 1);

      // 更新映射表中的索引
      for (let i = draggedIndex; i < updatedFlatArray.length; i++) {
        updatedIndexMap.set(updatedFlatArray[i].id, i);
      }

      // 判断方位
      switch (positionRef.current) {
        case 1:
          // 插入到目标节点之前
          updatedFlatArray.splice(targetIndex, 0, {
            ...draggedNode,
            pid: targetNode.pid
          });
          break;
        case 2:
          // prevNode放置在node里面第一个，并移除prevNode数据
          updatedFlatArray.push({
            ...draggedNode,
            pid: targetNode.id
          })
          break;
        case 3:
          // 插入到目标节点之后
          updatedFlatArray.splice(targetIndex + 1, 0, {
            ...draggedNode,
            pid: targetNode.pid
          });
          break;
      }
      e.currentTarget.classList.remove('border-highlight-top', 'border-highlight-bottom', 'highlight');
      positionRef.current = 0;
      changeTree(updatedFlatArray);
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
        onMouseUp={(e) => onMouseUp(e, {
          node
        })}
      >
        <div className={styles.leftNode}>
          <span className={styles.move} onMouseDown={() => {
            isDraggingRef.current = true;
          }}>
            <HolderOutlined />
          </span>
          {node?.children?.length > 0 && (
            <span onClick={() => toggleNode(node.id)}>
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
          />
        ))}
    </>
  );
};

const Tree = (props: any) => {
  const { data } = props;

  // 句柄
  const previewRef = useRef<any>(null);
  const draggedItemRef = useRef<any>(null);
  const currDataRef = useRef<any>(null);
  const isDraggingRef = useRef<boolean>(false);
  const positionRef = useRef<number>(0); // 1 放置在元素上方 2 放置在元素下级 3 放置在元素下方 

  // 状态：跟踪每个节点的展开状态
  const [isExpanded, setIsExpanded] = useState({});
  const [tree, setTree] = useState<any[]>(data);

  const flatObj = useMemo(() => {
    return flattenTree(tree);
  }, [tree]);

  useEffect(() => {
    function handleMouseMove(e: any) {
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

  // 更新树形数据
  const changeTree = (newFlatArray: any[]) => {
    const newTree = rebuildTree(newFlatArray);
    console.log('%c [ newTree ]-281', 'font-size:13px; background:pink; color:#bf2c9f;', newTree)
    setTree(newTree);
  }

  return (
    <Context.Provider value={{
      previewRef,
      draggedItemRef,
      currDataRef,
      isDraggingRef,
      positionRef,
      isExpanded,
      flatObj,
      toggleNode,
      changeTree
    }}>
      <div>
        {(tree || []).map((node: any) => (
          <TreeNode key={node.id} node={node} />
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
