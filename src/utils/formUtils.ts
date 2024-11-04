import { isObject, isUnDef } from "@/utils/is";

/**
 * 修改对象中为undefined的字段，使其能在使用JSON.stringify时显示该字段
 * @param paramsData
 * @constructor
 */
export const fEmptyValue = (paramsData): Object => {
  function cldReset(data) {
    let temp = {};
    if (isObject(data) && Object.keys(data).length) {
      Object.keys(data).map(function (v) {
        if (isUnDef(data[v])) {
          temp[v] = "";
        } else {
          temp[v] = cldReset(data[v]);
        }
      });
    } else {
      temp = data;
    }
    return temp;
  }
  return cldReset(paramsData);
};

export const fIntNumber = (value): string | number => {
  if (typeof value === "string") {
    return !isNaN(Number(value)) ? value.replace(/\./g, "") : 0;
  } else if (typeof value === "number") {
    return !isNaN(value) ? String(value).replace(/\./g, "") : 0;
  } else {
    return 0;
  }
};
/**
 * @description 数字变化，乘除100 10000
 * @param number
 * @param operation m1*10 m10 * 10000 d1 / 10 d10 /10000
 */
export const fFigure = (
  number: number | string,
  operation: string
): number | string => {
  let result: string | number;
  const formatNumber = Number(number);
  if (isNaN(formatNumber)) {
    return number;
  }
  switch (operation) {
    case "m1":
      result = formatNumber * 10000;
      result = Number(result.toFixed(4));
      break;
    case "m10":
      result = formatNumber * 10000;
      result = Number(result.toFixed(4));
      break;
    case "d1":
      result = formatNumber / 10000;
      result = result.toFixed(4);
      break;
    case "d10":
      result = formatNumber / 10000;
      result = result.toFixed(4);
      break;
    case "rm1":
      result = (formatNumber * 10000) / 100;
      result = Number(result.toFixed(4));
      break;
    case "rd1":
      result = (formatNumber * 100) / 10000;
      result = result.toFixed(4);
      break;
    default:
      break;
  }
  return result;
};
export const fIpNumber = (value: string | number): string | number => {
  return value;
};
