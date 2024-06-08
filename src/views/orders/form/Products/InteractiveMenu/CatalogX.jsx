import styles from "./styles.module.scss";
import { Chip } from "@mui/material";

function CatalogX({ categories, active, set }) {
  return (
    <div className={styles.catalog_x}>
      {categories?.map((item) => (
        <Chip
          variant="contained"
          color={item.id === active ? "primary" : undefined}
          key={item.id}
          label={item?.title?.ru}
          onClick={() =>
            set((prev) =>
              prev?.id !== item.id
                ? { id: item.id, products: item.products }
                : { id: "", products: [] },
            )
          }
        />
      ))}
    </div>
  );
}

export default CatalogX;
