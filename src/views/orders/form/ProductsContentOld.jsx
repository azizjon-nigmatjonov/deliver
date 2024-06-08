// import { useCallback, useState, useEffect } from "react";
// import Card from "components/Card";
// import { useTranslation } from "react-i18next";
// import { Input } from "alisa-ui";
// import { Close, Add } from "@mui/icons-material";
// import AsyncSelect from "components/Select/Async";
// import Button from "components/Button";
// import { getComboProduct, getNonOriginModifierProducts } from "services/v2";
// import { customStyles } from "components/Select";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from "@mui/material/FormControl";
// import Typography from "@mui/material/Typography";
// import { getModifiers } from "services/v2/modifier";
// import { useSelector } from "react-redux";
// import CustomCheckbox from "components/Checkbox/Checkbox";
// import Tag from "components/Tag";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function ProductContent({
//   selectedProducts,
//   setSelectedProducts,
//   generalPrice,
// }) {
//   const { t } = useTranslation();
//   const lang = useSelector((state) => state.lang.current);
//   const [comboStatus, setComboStatus] = useState(false);
//   const [comboProducts, setComboProducts] = useState([]);
//   const [comboVariantStatus, setComboVariantStatus] = useState(false);
//   const [radioValue, setRadioValue] = useState(new Map());
//   const [selectId, setSelectId] = useState({
//     id: "",
//     index: "",
//   });
//   const [radioVariant, setRadioVariant] = useState("");
//   const [comboProductId, setComboProductId] = useState("");
//   const [generalProductIndex, setGeneralProductIndex] = useState(null);

//   const loadProducts = useCallback((input, cb) => {
//     getNonOriginModifierProducts({ limit: 50, page: 1, search: input })
//       .then((res) => {
//         var products = res?.products?.map((product) => ({
//           label: product.title.ru,
//           value: product.id,
//           price: product.out_price,
//           is_divisible: product.is_divisible,
//           type: product.type,
//           has_modifier: product.has_modifier,
//         }));

//         cb(products);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleRemoveProduct = (index) => {
//     setSelectedProducts((prev) => prev.filter((elm, i) => index !== i));
//   };

//   const handleChangeQuantity = (index, val) => {
//     setSelectedProducts((prev) =>
//       prev.map((elm, i) => (index === i ? { ...elm, quantity: val } : elm)),
//     );
//   };
//   // use these to make kolichestvo divisible
//   const validateCount = (event, isDivisible) => {
//     if (!(isDivisible || /[0-9]/.test(event.key))) {
//       event.preventDefault();
//     } else if (isDivisible && !/[0-9]/.test(event.key) && event.key !== ".") {
//       event.preventDefault();
//     }
//   };

//   const descriptionHandler = (e, i) => {
//     setSelectedProducts((prev) => {
//       var clone = structuredClone(prev);
//       clone[i].description = e.target.value;
//       return clone;
//     });
//   };

//   const getModifiersById = (id) => {
//     getModifiers({ product_id: id })
//       .then((res) => {
//         setSelectedProducts((prev) =>
//           prev.map((product) => {
//             if (product.product_id === id) {
//               let selectedMods = [];
//               res?.product_modifiers.single_modifiers?.map((elm) =>
//                 selectedMods.push({
//                   modifier_id: elm.id,
//                   modifier_name: elm.name,
//                   modifier_quantity: 0,
//                   modifier_price: elm.price,
//                 }),
//               );
//               if (res?.product_modifiers?.group_modifiers) {
//                 [].concat(
//                   ...res?.product_modifiers?.group_modifiers?.map((elm) =>
//                     elm?.variants?.map((e) =>
//                       selectedMods.push({
//                         modifier_id: e.id,
//                         modifier_name: e.title?.[lang],
//                         modifier_quantity: 0,
//                         modifier_price: e.out_price,
//                         parent_id: elm.id,
//                       }),
//                     ),
//                   ),
//                 );
//               }
//               return {
//                 ...product,
//                 selectedModifiers: selectedMods,
//                 ...res,
//               };
//             } else {
//               return product;
//             }
//           }),
//         );
//       })
//       .catch((error) => error);
//   };

//   const getComboProductById = (id) => {
//     console.log("resid", id);
//     getComboProduct(id)
//       .then((res) => {
//         setSelectedProducts((elm) =>
//           elm.map((product) => {
//             if (product.product_id === id) {
//               return {
//                 ...product,
//                 comboProducts: res?.products.map((res) => ({
//                   isSelected: false,
//                   ...res,
//                 })),
//               };
//             } else {
//               return product;
//             }
//           }),
//         );
//         setComboProducts(res?.products);
//       })
//       .catch((error) => console.log(error));
//   };

//   const handleChangeRadio = (item, comboItem, index) => {
//     console.log("comboitem123", comboItem);
//     // const selectedIDX = selectedProducts[index]?.variants?.find(
//     //   (product) => product?.product_id === comboItem?.id,
//     // );
//     // if (typeof selectedIDX !== "undefined") {
//     //   setSelectedProducts((prev) =>
//     //     prev.map((el, i) => {
//     //       if (i === index) {
//     //         let splicedVariants = el.variants.filter(
//     //           (el) => el.product_id !== selectedIDX,
//     //         )
//     //         console.log("splicedVariants", splicedVariants);
//     //         return {
//     //           ...el,
//     //           variants: splicedVariants,
//     //         };
//     //       }
//     //     }),
//     //   );
//     // }
//     // console.log("selectedIDX", selectedIDX);
//     if (
//       selectedProducts[index]?.variants?.find(
//         (el) => el.product_id === comboItem.id,
//       )
//     ) {
//       const indexMyArrays = selectedProducts[index]?.variants?.findIndex(
//         (el) => el.product_id === comboItem.id,
//       );
//       // selectedProducts[index]?.variants = indexMyArrays
//     }
//     setSelectedProducts((prev) =>
//       prev.map((element, idx) => {
//         if (idx === selectId.index) {
//           return {
//             ...element,
//             variants: [
//               ...element.variants,
//               {
//                 product_id: comboItem.id,
//                 variant_id: item.id,
//                 variant_name: item?.title?.[lang],
//               },
//             ],
//           };
//         } else {
//           return element;
//         }
//       }),
//     );

//     setComboProductId(comboItem.id);
//     setRadioVariant(item);
//     setRadioValue(item.id);
//   };

//   const handleComboVariants = (id) => {
//     setSelectedProducts((el) =>
//       el.map((product) => {
//         if (product.product_id === id) {
//           let comboVariants = [];
//           comboProducts.forEach((product) => {
//             if (product.type === "combo_basic") {
//               comboVariants.push({
//                 product_id: product.id,
//                 variant_id: product.id,
//                 variant_name: product?.product?.title?.[lang],
//               });
//             }
//           });
//           console.log("comb333", comboVariants);
//           return { ...product, variants: comboVariants };
//         } else {
//           return product;
//         }
//       }),
//     );
//   };

//   useEffect(() => {
//     handleComboVariants(selectId.id);
//     var combVariant = [];
//     comboProducts.map((product) => {
//       console.log("product55", product);
//       if (product.type !== "combo_choose") {
//         combVariant.push({
//           product_id: product.id,
//           variant_id: "",
//           variant_name: "",
//         });
//       }
//     });
//   }, [comboProducts]);

//   const handleSelectChange = (val, i) => {
//     setSelectId({
//       id: val.value,
//       index: i,
//     });
//     const result = selectedProducts.map((el, index) => {
//       if (index !== i) return el;
//       return {
//         name: { label: val?.label, value: val?.value },
//         price: val?.price,
//         quantity: 1,
//         product_id: val?.value,
//         is_divisible: val?.is_divisible,
//         variants: [],
//         type: val.type,
//       };
//     });
//     console.log("result:", result);
//     setSelectedProducts([...result]); // [{}, {}]
//     if (val.has_modifier) {
//       getModifiersById(val.value);
//     } else {
//       return null;
//     }
//     if (val.type === "combo") {
//       getComboProductById(val.value);
//       setComboStatus(true);
//     } else {
//       setComboStatus(false);
//     }
//   };

//   const handleComboProductClick = (comboItem, index) => {
//     let selectedComboProduct = selectedProducts[index].comboProducts.find(
//       (elm) => elm.id === comboItem.id,
//     );

//     if (comboItem.type === "combo_choose") {
//       setComboVariantStatus(!comboVariantStatus);
//       selectedComboProduct.isSelected = !selectedComboProduct.isSelected;
//     }
//     setGeneralProductIndex(index);
//   };

//   console.log("selectedProducts==>", selectedProducts);

//   const incrementModifier = (productId, index, maxAmount) => {
//     setSelectedProducts((prev) => {
//       return prev.map((el, idx) => {
//         if (idx === index) {
//           return {
//             ...el,
//             selectedModifiers: el.selectedModifiers.map((selM) => {
//               if (selM.modifier_id === productId) {
//                 return {
//                   ...selM,
//                   modifier_quantity:
//                     selM.modifier_quantity < maxAmount
//                       ? selM.modifier_quantity + 1
//                       : selM.modifier_quantity,
//                 };
//               } else {
//                 return selM;
//               }
//             }),
//           };
//         } else return el;
//       });
//     });
//   };

//   console.log("genPrice", generalPrice);

//   const decrementModifier = (productId, index, minAmount) => {
//     setSelectedProducts((prev) => {
//       return prev.map((el, idx) => {
//         if (idx === index) {
//           return {
//             ...el,
//             selectedModifiers: el.selectedModifiers.map((selM) => {
//               if (selM.modifier_id === productId) {
//                 generalPrice -= selM.modifier_price;
//                 return {
//                   ...selM,
//                   modifier_quantity:
//                     selM.modifier_quantity > 0
//                       ? selM.modifier_quantity - 1
//                       : selM.modifier_quantity,
//                 };
//               } else {
//                 return selM;
//               }
//             }),
//           };
//         } else return el;
//       });
//     });
//   };

//   const onModifierCheck = (id) => {};

//   const handleModifiers = (element, index, parentId, actionType) => {
//     setSelectedProducts((prev) =>
//       prev.map((elm, i) =>
//         index === i
//           ? {
//               ...elm,
//             }
//           : elm,
//       ),
//     );
//   };

//   return (
//     <Card title={t("products")} headerClass="py-3">
//       {selectedProducts?.map((elm, i) => (
//         <>
//           <div key={elm.name} className="flex items-center gap-2 mb-4 ">
//             <div className="w-4/12">
//               <span className="input-label mb-1">{t("name")}</span>
//               <AsyncSelect
//                 id="name"
//                 value={elm.name}
//                 options={[]}
//                 placeholder={t("name")}
//                 onChange={(val) => {
//                   handleSelectChange(val, i);
//                 }}
//                 defaultOptions
//                 cacheOptions
//                 isSearchable
//                 isClearable
//                 loadOptions={loadProducts}
//                 styles={customStyles({
//                   control: (base, state) => ({
//                     ...base,
//                     minHeight: "2rem",
//                     height: "2rem",
//                     border: "1px solid #E5E9EB",
//                   }),
//                   indicatorSeparator: (base, state) => ({
//                     ...base,
//                     height: "1rem",
//                   }),
//                 })}
//               />
//             </div>
//             <div className="amount_wrap">
//               <span className="input-label mb-1">{t("amount")}</span>
//               <Input
//                 prefix={
//                   <button
//                     type="button"
//                     className="text-primary"
//                     onClick={() => {
//                       elm.quantity - 1 > 0 &&
//                         handleChangeQuantity(i, elm.quantity - 1);
//                     }}
//                   >
//                     -
//                   </button>
//                 }
//                 suffix={
//                   <button
//                     type="button"
//                     className="text-primary"
//                     onClick={() => {
//                       handleChangeQuantity(i, +elm.quantity + 1);
//                     }}
//                   >
//                     +
//                   </button>
//                 }
//                 min={"1"}
//                 value={elm.quantity}
//                 onChange={(e) =>
//                   e.target.value >= 0 && handleChangeQuantity(i, e.target.value)
//                 }
//                 mask="999999999"
//                 onKeyPress={(event) => validateCount(event, elm.is_divisible)}
//                 width={150}
//               />
//             </div>
//             <div>
//               <Close className="text-primary mt-7" />
//             </div>
//             <div>
//               <span className="input-label mb-1">{t("price")}</span>
//               <Input
//                 value={elm.price}
//                 suffix={t("uzb.sum")}
//                 disabled
//                 width={175}
//               />
//             </div>

//             <div>
//               <div className="text-primary mt-5 text-3xl">=</div>
//             </div>
//             <div>
//               <span className="input-label mb-1">{t("total.cost")}</span>
//               <Input
//                 type="number"
//                 value={elm.price * elm.quantity}
//                 suffix={t("uzb.sum")}
//                 disabled
//               />
//             </div>
//             <div className="w-2/12">
//               <span className="input-label mb-1">{t("description")}</span>
//               <Input
//                 type="text"
//                 placeholder={t("description")}
//                 onChange={(e) => descriptionHandler(e, i)}
//               />
//             </div>
//             <Tag
//               color="red"
//               size="large"
//               shape="subtle"
//               className="cursor-pointer self-end"
//             >
//               <DeleteIcon onClick={() => handleRemoveProduct(i)} />
//             </Tag>
//           </div>

//           {elm?.comboProducts?.length > 0 &&
//             elm?.comboProducts?.map((comboItem) => (
//               <div className="w-4/12">
//                 <div
//                   className="rounded-lg border border-lightgray-1 px-4 py-1 mb-2 w-2/3 flex justify-between"
//                   key={comboItem.product.id}
//                   onClick={() => {
//                     handleComboProductClick(comboItem, i);
//                   }}
//                 >
//                   <p>{comboItem.product.title.ru}</p>
//                   {comboItem.type !== "combo_basic" &&
//                     (comboItem.isSelected ? (
//                       <ExpandLessIcon style={{ color: "#4094F7" }} />
//                     ) : (
//                       <ExpandMoreIcon style={{ color: "#4094F7" }} />
//                     ))}
//                 </div>
//                 {comboItem.isSelected &&
//                   comboItem?.variants?.map((item, index) => (
//                     <div className="flex items-center mb-2">
//                       <div
//                         style={{
//                           backgroundColor: "#023997",
//                           color: "white",
//                           width: "18px",
//                           height: "18px",
//                           borderRadius: "50%",
//                           fontSize: "12px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {index + 1}
//                       </div>
//                       <div
//                         className="rounded-lg border border-lightgray-1 w-2/3 ml-1 text-center"
//                         key={item.id}
//                       >
//                         <FormControl component="fieldset">
//                           <RadioGroup
//                             aria-label="gender"
//                             value={
//                               elm?.variants?.find(
//                                 (el) => el.variant_id === item.id,
//                               )?.variant_id
//                             }
//                             onChange={() => {
//                               handleChangeRadio(item, comboItem, i);
//                             }}
//                           >
//                             <FormControlLabel
//                               value={item.id}
//                               control={<Radio color="primary" size="medium" />}
//                               label={
//                                 <Typography
//                                   style={{
//                                     fontSize: "12px",
//                                   }}
//                                 >
//                                   {item.title.ru}
//                                 </Typography>
//                               }
//                             />
//                           </RadioGroup>
//                         </FormControl>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             ))}

//           {elm?.product_modifiers && (
//             <div className="flex border-t pt-4 mt-4">
//               <div
//                 className="w-1/4"
//                 style={{ borderRight: "2px solid #e0e0e0" }}
//               >
//                 <h2 className="input-label" style={{ paddingBottom: "18px" }}>
//                   {t("empty.modifiers")}
//                 </h2>
//                 {elm?.product_modifiers?.single_modifiers?.map(
//                   (singleProduct) => (
//                     <div key={singleProduct.id}>
//                       <div className="flex items-center">
//                         <div className="amount_wrap">
//                           {singleProduct.is_checkbox ? (
//                             <CustomCheckbox
//                               color="primary"
//                               id={`singleProduct${singleProduct.id}`}
//                               checked={
//                                 elm.selectedModifiers.find(
//                                   (el) => el.modifier_id === singleProduct.id,
//                                 )?.modifier_quantity === 1
//                               }
//                               onChange={(e) => {
//                                 if (e.target.checked) {
//                                   incrementModifier(singleProduct.id, i);
//                                 } else {
//                                   e.target.value >= 0 &&
//                                     decrementModifier(singleProduct.id, i);
//                                 }
//                               }}
//                             />
//                           ) : (
//                             <Input
//                               className="mr-2 p-2"
//                               min={singleProduct.min_amount}
//                               max={singleProduct.max_amount}
//                               prefix={
//                                 <button
//                                   type="button"
//                                   className="text-primary"
//                                   onClick={(e) => {
//                                     e.target.value >= 0 &&
//                                       decrementModifier(
//                                         singleProduct.id,
//                                         i,
//                                         singleProduct.min_amount,
//                                       );
//                                   }}
//                                 >
//                                   -
//                                 </button>
//                               }
//                               suffix={
//                                 <button
//                                   type="button"
//                                   className="text-primary"
//                                   onClick={() => {
//                                     incrementModifier(
//                                       singleProduct.id,
//                                       i,
//                                       singleProduct.max_amount,
//                                     );
//                                   }}
//                                 >
//                                   +
//                                 </button>
//                               }
//                               value={
//                                 elm.selectedModifiers.find(
//                                   (el) => el.modifier_id === singleProduct.id,
//                                 ).modifier_quantity
//                               }
//                               // onChange={(e) =>
//                               //   e.target.value >= 0 && handleChangeQuantity(i, e.target.value)
//                               // }
//                               mask="999999999"
//                               // onKeyPress={(event) => validateCount(event, elm.is_divisible)}
//                               width={120}
//                             />
//                           )}
//                         </div>
//                         <label for={`singleProduct${singleProduct.id}`}>
//                           {singleProduct.name}
//                         </label>
//                         <span className="ml-2 bg-primary border rounded-lg text-white p-1 text-xs">
//                           {singleProduct?.price}
//                         </span>
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>

//               <div className="w-3/4 pl-4">
//                 <h2 className="input-label" style={{ paddingBottom: "18px" }}>
//                   {t("group.modifiers")}
//                 </h2>

//                 {elm?.product_modifiers?.group_modifiers?.map((element) => (
//                   <>
//                     <div
//                       className="border border-lightgray-1 py-2 px-4 flex justify-between"
//                       style={{ borderRadius: "8px 8px 0 0" }}
//                     >
//                       <h2>{element.name}</h2>
//                       <ExpandMoreIcon style={{ color: "#4094F7" }} />
//                     </div>

//                     <div
//                       key={element.id}
//                       className="border border-lightgray-1 mb-6 py-2 px-2 grid grid-cols-3"
//                       style={{
//                         borderRadius: "0 0 8px 8px",
//                         borderTop: "0px ",
//                       }}
//                     >
//                       {element?.variants?.map((variants) => (
//                         <div key={variants?.id}>
//                           <div className="flex items-center">
//                             <div className="amount_wrap">
//                               {element.is_checkbox ? (
//                                 <CustomCheckbox
//                                   color="primary"
//                                   id={`variantProduct${variants.id}`}
//                                 />
//                               ) : (
//                                 <Input
//                                   className="mr-2 p-2"
//                                   prefix={
//                                     <button
//                                       type="button"
//                                       className="text-primary"
//                                       onClick={(e) => {
//                                         e.target.value >= 0 &&
//                                           decrementModifier(
//                                             variants.id,
//                                             i,
//                                             element.min_amount,
//                                           );
//                                       }}
//                                     >
//                                       -
//                                     </button>
//                                   }
//                                   suffix={
//                                     <button
//                                       type="button"
//                                       className="text-primary"
//                                       onClick={() => {
//                                         incrementModifier(
//                                           variants.id,
//                                           i,
//                                           element.max_amount,
//                                         );
//                                       }}
//                                     >
//                                       +
//                                     </button>
//                                   }
//                                   min={"0"}
//                                   value={
//                                     elm.selectedModifiers.find(
//                                       (el) => el.modifier_id === variants.id,
//                                     )?.modifier_quantity
//                                   }
//                                   // onChange={(e) =>
//                                   //   e.target.value >= 0 && handleChangeQuantity(i, e.target.value)
//                                   // }
//                                   mask="999999999"
//                                   // onKeyPress={(event) => validateCount(event, elm.is_divisible)}
//                                   width={120}
//                                 />
//                               )}
//                             </div>
//                             <label for={`variantProduct${variants.id}`}>
//                               {variants?.title?.[lang]}
//                             </label>
//                             <span className="ml-2 bg-primary border rounded-lg text-white p-1 text-xs">
//                               {variants?.out_price}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ))}
//       <Button
//         icon={Add}
//         onClick={() => {
//           setSelectedProducts((prev) => {
//             return prev.concat({
//               name: "",
//               price: "",
//               quantity: 1,
//               variants: [],
//             });
//           });
//         }}
//       >
//         {t("add.product")}
//       </Button>
//     </Card>
//   );
// }
