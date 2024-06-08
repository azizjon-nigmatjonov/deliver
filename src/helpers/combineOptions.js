export const sortCombinedData = (element) => {
  return element.map((el) => {
    if (!Array.isArray(el)) {
      return {
        ...el,
        product_properties: [
          {
            option_id: el.option_id,
            property_id: el.property_id,
          },
        ],
      };
    } else
      return el.reduce(
        (ac, curr, product_properties) => {
          ac.label = ac.label + " " + curr.label;
          ac.product_properties = [
            ...ac.product_properties,
            { option_id: curr.option_id, property_id: curr.property_id },
          ];
          return ac;
        },
        { label: "", product_properties: [] },
      );
  });
};

// combines product with label, option_id and product_id inside array
export const combineOptions = (arr) => {
  if (arr.length === 1) {
    return arr[0];
  } else {
    var ans = [];

    var otherCases = combineOptions(arr.slice(1));
    for (var i = 0; i < otherCases.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        if (Array.isArray(otherCases[i])) {
          ans.push([arr[0][j], ...otherCases[i]]);
        } else {
          ans.push([arr[0][j], otherCases[i]]);
        }
      }
    }

    return ans;
  }
};
