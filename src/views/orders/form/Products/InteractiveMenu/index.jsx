import { Input } from "alisa-ui";
import Modal from "components/ModalV2";
import { useMemo, useState } from "react";
import CatalogY from "./CatalogY";
import Card from "./Card";
import { Grid } from "@mui/material";
import Cart from "./Cart/index";
import {
  useCategories,
  useCategoryWithChildren,
  useNonOriginModifierProducts,
} from "services/v2";
import CatalogX from "./CatalogX";
import Origin from "./Card/Origin";
import Combo from "./Card/Combo";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "hooks/useDebounce";
import { useTranslation } from "react-i18next";

function InteractiveMenu({
  open,
  onClose,
  totalPrice,
  fullScreen,
  orderDetails,
  isOrderEditable,
  menuId,
}) {
  const [searchQ, setSearchQ] = useState("");
  const [category, setCategory] = useState("");
  const [childCategory, setChildCategory] = useState({ id: "", products: [] });
  const [searchResult, setSearchResult] = useState(null);

  const { t } = useTranslation();
  const debouncedSearch = useDebounce(searchQ, 300);
  const PARAMS = useMemo(
    () => ({
      menu_id: menuId ? menuId : "",
      order_source: orderDetails.source || "admin_panel",
      branch_id: orderDetails?.branch?.value,
      only_delivery:
        orderDetails.delivery_type === "delivery" ||
        orderDetails.delivery_type === "external",
      only_self_pickup: orderDetails.delivery_type === "self-pickup",
      client_id: orderDetails?.client_id,
      with_discounts: true,
    }),
    [
      menuId,
      orderDetails?.branch?.value,
      orderDetails?.client_id,
      orderDetails.delivery_type,
      orderDetails.source,
    ],
  );

  const { data: categories } = useCategories({
    params: {
      page: 1,
      limit: 10,
      ...PARAMS,
    },
    props: {
      enabled: isOrderEditable,
      onSuccess: (res) =>
        setCategory(categories && categories[0] ? res?.categories[0]?.id : ""),
    },
  });

  const { data: categoryData } = useCategoryWithChildren({
    category_id: category,
    params: {
      page: 1,
      limit: 10,
      ...PARAMS,
    },
    props: {
      enabled: !!category && isOrderEditable,
      keepPreviousData: true,
    },
  });

  useNonOriginModifierProducts({
    params: {
      page: 1,
      limit: 50,
      active: true,
      menu_id: menuId ? menuId : "",
      search: debouncedSearch,
    },
    props: {
      enabled: isOrderEditable,
      onSuccess: (res) => setSearchResult(res?.products),
    },
  });

  return (
    <Modal
      open={open}
      title="Список товаров"
      onClose={onClose}
      fullScreen={fullScreen}
      tools={
        <Input
          value={searchQ}
          placeholder={t("search")}
          onChange={({ target }) => setSearchQ(target.value)}
          addonBefore={
            <SearchIcon
              style={{ color: "var(--primary-color)", marginRight: "8px" }}
            />
          }
        />
      }
    >
      <div className="flex">
        <CatalogY
          categories={categories?.categories}
          active={category}
          set={(val) => {
            setCategory(val);
            setSearchQ("");
            setChildCategory({ id: "", products: [] });
          }}
        />
        <div className="flex-1 border-r border-l px-4">
          {!debouncedSearch && (
            <CatalogX
              categories={categoryData?.child_categories}
              active={childCategory?.id}
              set={setChildCategory}
            />
          )}
          <Grid container spacing={2}>
            {debouncedSearch ? (
              searchResult ? (
                searchResult?.map((product) => (
                  <Grid item key={product.id} xs="auto">
                    {product.type === "origin" ? (
                      <Origin
                        product={product}
                        menuId={menuId}
                        params={PARAMS}
                      />
                    ) : product.type === "combo" ? (
                      <Combo
                        product={product}
                        unavailable={menuId && !product.active_in_menu}
                      />
                    ) : (
                      <Card
                        product={product}
                        unavailable={menuId && !product.active_in_menu}
                      />
                    )}
                  </Grid>
                ))
              ) : (
                <p className="text-center w-full">Нет результатов</p>
              )
            ) : childCategory?.id ? (
              childCategory?.products?.map((product) => (
                <Grid item key={product.id + childCategory.id} xs="auto">
                  {product.type === "origin" ? (
                    <Origin product={product} menuId={menuId} params={PARAMS} />
                  ) : product.type === "combo" ? (
                    <Combo
                      product={product}
                      unavailable={menuId && !product.active_in_menu}
                    />
                  ) : (
                    <Card
                      product={product}
                      unavailable={menuId && !product.active_in_menu}
                    />
                  )}
                </Grid>
              ))
            ) : (
              categoryData?.products &&
              categoryData?.products?.map((product) => (
                <Grid item key={product.id + category.id} xs="auto">
                  {product.type === "origin" ? (
                    <Origin product={product} menuId={menuId} params={PARAMS} />
                  ) : product.type === "combo" ? (
                    <Combo
                      product={product}
                      unavailable={menuId && !product.active_in_menu}
                    />
                  ) : (
                    <Card
                      product={product}
                      unavailable={menuId && !product.active_in_menu}
                    />
                  )}
                </Grid>
              ))
            )}
          </Grid>
        </div>
        <Cart totalPrice={totalPrice} onSave={onClose} />
      </div>
    </Modal>
  );
}

export default InteractiveMenu;
