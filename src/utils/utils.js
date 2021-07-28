/**
 * 日期格式化
 * @param date 时间戳
 * @param fmt 格式
 */
const formatDate = (date, fmt) => {
  const dateObj = new Date(date);
  let ret;
  const opt = {
    "y+": dateObj.getFullYear().toString(), // 年
    "M+": (dateObj.getMonth() + 1).toString(), // 月
    "d+": dateObj.getDate().toString(), // 日
    "h+": dateObj.getHours().toString(), // 时
    "m+": dateObj.getMinutes().toString(), // 分
    "s+": dateObj.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        //@ts-ignore
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
};

/**
 * 获取年份
 */
const handleYear = data => {
  let date = new Date(data);
  return date.getFullYear();
};

export { formatDate, handleYear };
