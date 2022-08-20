/**
 * 扁平化处理嵌套结构的数据
 * @param {Array} list 数据列表
 * @param {String} key 数据条目的子数据所对应的 key 键名称
 * @param {Boolean} keep 扁平化处理时是否保留父级数据条目
 */
export const flatten = (list, key, keep = false) => {
  console.log("list", list);
  let result = [];

  Array.isArray(list) &&
    list.forEach((item) => {
      let children = item[key]; // 查找路由中是否有children字段

      // 这里是看其是否有子路由（对于目前的项目来说。我们在一开始就过滤掉了父路由）
      if (children) {
        if (keep) {
          result.push(item);
        }
        result.push.apply(result, getFlattenedMenuItems(children, key, keep));
      } else {
        result.push(item);
      }
    });

  return result;
};

/**
 * 扁平化处理菜单项
 * @param {Array} 路由列表
 */
export const getFlattenedMenuItems = (list, keep = false) =>
  flatten(list, "children", keep);
