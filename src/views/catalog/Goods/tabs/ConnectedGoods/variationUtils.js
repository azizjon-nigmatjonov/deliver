import * as yup from "yup";
import validate from "helpers/validateField";
import { invokeMap, map, filter, get } from "lodash";

export const initials = {
  combinations: [
    {
      code: "",
      in_price: "",
      out_price: "",
      images: [],
      name: "",
    },
  ],
  variations: [
    { attribute: { label: "", value: "" }, options: [], selectedOptions: [] },
  ],
};

export function resetToDefaults(pageInd) {
  var data = Object.assign({}, initials);

  for (let i = 0; i < pageInd; i++) {
    data.combinations.push(initials.combinations[0]);
  }

  return data;
}

export const validationSchema = yup.object().shape({
  combinations: yup.array().of(
    yup.object().shape({
      code: validate(),
      in_price: validate("number"),
      out_price: validate("number"),
      images: validate("arrayStr"),
      // name: validate("string"),
    }),
  ),
  variations: yup.array().of(
    yup.object().shape({
      attribute: yup
        .object()
        .shape({
          label: yup.string(),
          value: yup.string(),
        })
        .nullable(),
      options: yup.array().of(yup.string()),
      selectedOptions: yup.array().of(
        yup.object().shape({
          label: yup.string(),
          value: yup.string(),
        }),
      ),
    }),
  ),
});

export function applyInvocation(arr = [], name = "") {
  var filteredArr = filterByName(arr, name);

  var result = invokeMap(filteredArr, function () {
    var that = this;
    var mappedArr = map(this.options, (option) => {
      return {
        property_id: that.id,
        value: option,
      };
    });

    var property_ids = Array.from(
      new Set(mappedArr.map((property) => property.property_id)),
    );

    return [mappedArr, property_ids];
  });

  var correctedForm = [[], []];

  result.forEach((eachOption) => {
    correctedForm[0].push(...eachOption[0]);
    correctedForm[1].push(...eachOption[1]);
  });

  return correctedForm;
}

export function getOptions(arr = []) {
  var result = map(arr, (item) => {
    // console.log("getOptions", item);

    var options = get(item, "selectedOptions");
    // console.log("forvald88", options);
    return map(options, (option) => {
      // return option?.label;
      return {
        label: option?.label,
        option_id: option.value,
        property_id: item.attribute.value,
      };
    });
  });

  if (result.length > 1) {
    return result?.filter((item) => item.length > 0);
  }

  return [result[0]];
}

export function hasValidFields(variations = []) {
  var result = variations.every((variation) => {
    return !(variation.attribute && variation.selectedOptions.length);
  });
  return result;
}

function filterByName(arr = [], name = "") {
  var filteredArr = map(arr, (item) => {
    var options = filter(
      item.options,
      // (option) => name.includes(option) && !!option,
    );

    return {
      ...item,
      options,
    };
  });

  return filteredArr;
}
