import { map } from "lodash";

function merge(arrOfStrs = [], str = "") {
  return map(arrOfStrs, (item) => {
    return item + " " + str;
  });
}

export default function combine(arr = [[], []]) {
  var [first, ...rest] = arr.at(-1);
  var resultedArr;
  var lastItemSlicedArr = arr.slice(0, -1);
  var transformedArr = [...lastItemSlicedArr, rest];

  if (lastItemSlicedArr.length === 1) {
    resultedArr = merge(lastItemSlicedArr[0], first);
  } else {
    resultedArr = merge(combine(lastItemSlicedArr), first);
  }

  if (!rest.length) {
    return resultedArr;
  }

  // console.log("resarr", resultedArr.concat(combine(transformedArr)));

  return resultedArr.concat(combine(transformedArr));
}

/* Test Cases

["prop1", "prop2"] -> ["prop3", "prop4"]

["prop1 prop3", "prop2 prop3", "prop1 prop4", "prop2 prop4"]



["prop1", "prop2"] -> ["prop3", "prop4"] -> ["prop5"]

["prop1 prop3 prop5", "prop2 prop3 prop5", "prop1 prop4 prop5", "prop2 prop4 prop5"]



["prop1", "prop2", "prop3"] -> ["prop4", "prop5"] -> ["prop6"]

["prop1 prop4 prop6", "prop2 prop4 prop6", "prop3 prop4 prop6", "prop1 prop5 prop6", "prop2 prop5 prop6", "prop3 prop5 prop6"]



["prop1", "prop2", "prop3"] -> ["prop4", "prop5"] -> ["prop6", "prop7"]

["prop1 prop4 prop6", "prop2 prop4 prop6", "prop3 prop4 prop6", "prop1 prop5 prop6", "prop2 prop5 prop6", "prop3 prop5 prop6", "prop1 prop4 prop7", "prop2 prop4 prop7", "prop3 prop4 prop7", "prop1 prop5 prop7", "prop2 prop5 prop7", "prop3 prop5 prop7"]



["prop1", "prop2"] -> ["prop3", "prop4"] -> ["prop5"]

["prop1 prop3 prop5", "prop1 prop4 prop5", "prop2 prop3 prop5", "prop2 prop4 prop5"]


*/
