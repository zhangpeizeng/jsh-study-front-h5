/**
 * 获取元素距离某个节点的距离
 * @param ele
 * @param className
 * @returns {number}
 */
const getElementOffsetTop = (ele, className) => {
  let count = 0;
  let node = ele;
  while (
    node.parentNode.tagName !== "BODY" &&
    node.parentNode.className.indexOf(className) < 0
  ) {
    count += node.offsetTop;
    node = node.parentNode;
  }
  return count;
};

export { getElementOffsetTop };
