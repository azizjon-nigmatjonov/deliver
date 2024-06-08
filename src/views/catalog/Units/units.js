import toPairs from "lodash/toPairs";

var map = {
  Килограмм: "кг",
  Грамм: "г",
  Штука: "шт",
  Литр: "л",
  Миллилитр: "мл",
};

var pairs = toPairs(map); // [["Килограмм", "кг"], ["Грамм", "г"], ...]

export var mappedReductions = Object.freeze(new Map(pairs));

export var units = ["Килограмм", "Грамм", "Штука", "Литр", "Миллилитр"];
export var units_eng = ["Kilogram", "Gram", "Unit", "Liter", "Milliliter"];
export var units_uz = ["Kilogram", "Gram", "Dona", "Litr", "Mililitr"];

export var accuracies = [
  "1",
  "0.1",
  "0.01",
  "0.001",
  "0.0001",
  "0.00001",
  "0.000001",
];
