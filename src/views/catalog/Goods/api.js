var formFields = {
  active: true,
  description_ru: "",
  description_uz: "",
  description_en: "",
  in_price: "",
  out_price: "",
  is_divisible: null,
  title_ru: "",
  title_uz: "",
  title_en: "",
  brand: null,
  unit: null,
  currency: null,
  tags: null,
  category_ids: null,
  images: [],
  unit_short: null,
  accuracy: "",
  properties: [], // { property: null, property_option: null }
  code: "", // artikul
  favourites: [],
  variant_ids: [],
  property_ids: [
    {
      label: "",
      value: "",
    },
  ],
  type: "",
  combo: {
    combo_id: "",
    products: {
      active: "",
      order: 0,
      product_id: "",
      variants: [],
    },
  },
  rate_id: "",
  options: [
    {
      id: "",
      title: {
        uz: "",
        ru: "",
        en: "",
      },
    },
  ],
  order: "",
  package_code: "",
  ikpu: "",
};

export var divisibility = ["divisible", "nondivisible"];

export var currencies = ["UZS"];

export default formFields;

export var types = ["origin", "modifier", "simple", "combo"];
