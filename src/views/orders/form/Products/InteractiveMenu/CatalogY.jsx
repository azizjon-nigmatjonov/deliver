import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import classNames from "classnames";

function CatalogY({ categories, active, set }) {
  const { t } = useTranslation();

  return (
    <div className={styles.catalog_y}>
      <h5>{t("categories")}</h5>
      {categories?.map((item) => (
        <Category
          active={item.id === active}
          key={item.id}
          img={item?.image}
          title={item?.title?.ru}
          onClick={() => set(item.id)}
        />
      ))}
    </div>
  );
}

function Category({ title, img, active, ...props }) {
  return (
    <div
      className={classNames(styles.category, { [styles.active]: active })}
      {...props}
    >
      {img && (
        <img src={`${process.env.REACT_APP_MINIO_URL}/${img}`} alt={title} />
      )}
      <p>{title}</p>
    </div>
  );
}

export default CatalogY;
