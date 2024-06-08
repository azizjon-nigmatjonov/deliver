import "./style.scss";
import { useState, useRef, useMemo } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImageViewer from "react-simple-image-viewer";
import axios from "utils/axios";
import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch } from "react-redux";
import { showAlert } from "redux/actions/alertActions";
import { useTranslation } from "react-i18next";

const Gallery = ({
  gallery = [],
  setGallery,
  notEditable,
  multiple = true,
  width = 140,
  height = 90,
  aspectRatio,
  rounded = false,
  style,
  accept = "",
  maxSizeText = "max.size.4mb",
  extraTitle = "",
  bottomText = true,
}) => {
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isShow = useMemo(
    () => multiple || !gallery.length,
    [gallery, multiple],
  );
  const imageLinks = useMemo(() => {
    return gallery?.map(
      (image) => `${process.env.REACT_APP_MINIO_URL}/${image}`,
    );
  }, [gallery]);

  const addNewImage = (image) => {
    setGallery([...gallery, image]);
  };

  const imageClickHandler = (index) => {
    setSelectedImageIndex(index);
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    // const SIZE_4_MB = 4194304;
    const SIZE_1_MB = 1194304;
    setLoading(true);
    var input = e.target;
    const file = input.files[0];
    if (!file) return setLoading(false);

    if (file.size > SIZE_1_MB) {
      dispatch(showAlert(t("File size must be less than 1MB"), "warning"));
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })
      .catch((err) => console.log("error here: ", err))
      .then((res) => {
        addNewImage(res?.filename);
      })
      .finally(() => setLoading(false));
  };

  const deleteImage = (id) => {
    setGallery(gallery.filter((galleryImageId) => galleryImageId !== id));
  };

  const closeButtonHandler = (e, link) => {
    e.stopPropagation();
    deleteImage(link.replace(`${process.env.REACT_APP_MINIO_URL}/`, ""));
  };

  return (
    <div className={`Gallery`} style={style}>
      {!notEditable && isShow && (
        <div>
          <div
            className="add-block block"
            style={
              aspectRatio
                ? { width, aspectRatio, borderRadius: rounded ? "50%" : 8 }
                : { width, height, borderRadius: rounded ? "50%" : 8 }
            }
            onClick={() => inputRef.current.click()}
          >
            <div className="add-icon">
              {!loading ? (
                <>
                  <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                  <p className="text-sm text-center px-3">{t(maxSizeText)}</p>
                  <p className="text-sm text-center px-3">{extraTitle}</p>
                </>
              ) : (
                <CircularProgress />
              )}
            </div>

            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={inputChangeHandler}
              accept={accept}
              // multiple={multiple}
            />
          </div>

          {bottomText && (
            <p
              className="mt-2 text-primary text-xs text-center"
              onClick={() => inputRef.current.click()}
              style={{ cursor: "pointer" }}
            >
              {t("add.photo")}
            </p>
          )}
        </div>
      )}

      {imageLinks?.map((link, index) => (
        <div
          className="block valuable"
          style={{ width, height, borderRadius: rounded ? "50%" : "6px" }}
          onClick={() => imageClickHandler(index)}
          key={link}
        >
          {!notEditable && (
            <button
              type="button"
              className="close-btn"
              onClick={(e) => closeButtonHandler(e, link)}
            >
              <CancelIcon fontSize="inherit" />
            </button>
          )}
          <img
            src={link}
            alt=""
            style={{ borderRadius: rounded ? "50%" : "6px" }}
          />
        </div>
      ))}

      {previewVisible && (
        <ImageViewer
          style={{ zIndex: 100000, width, height }}
          src={imageLinks}
          currentIndex={selectedImageIndex}
          disableScroll={true}
          onClose={() => setPreviewVisible(false)}
          zIndex={2}
        />
      )}
    </div>
  );
};

export default Gallery;
