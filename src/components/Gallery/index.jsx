import "./style.scss";
import { useState, useRef, useMemo } from "react";
import ReactDom from "react-dom";
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
  isVideo = false,
  isGif = false,
  accept = "",
  extraTitle = "",
  className = "",
  maxSize = 1,
  bottomText = true,
}) => {
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isShow = useMemo(
    () => multiple || !gallery.length,
    [gallery, multiple],
  );
  const imageLinks = useMemo(() => {
    if (isGif) {
      return gallery?.map(
        (image) => `${process.env.REACT_APP_MINIO_GIF_URL}/${image}`,
      );
    } else {
      return gallery?.map(
        (image) => `${process.env.REACT_APP_MINIO_URL}/${image}`,
      );
    }
  }, [gallery, isGif]);
  const [loading, setLoading] = useState(false);

  const addNewImage = (image) => {
    imageLinks.length ? setGallery([image]) : setGallery([...gallery, image]);
  };

  const imageClickHandler = (index) => {
    setSelectedImageIndex(index);
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    // const SIZE_4_MB = 4194304;
    const SIZE_1_MB = 1194304;
    const SIZE_10_MB = 5194304 * 2;
    setLoading(true);
    var input = e.target;
    const file = input.files[0];
    if (!file) return setLoading(false);

    if (file.size > SIZE_1_MB && !(isVideo || isGif)) {
      dispatch(showAlert(t("File size must be less than 1MB"), "warning"));
      setLoading(false);
      return;
    } else if (file.size > SIZE_10_MB) {
      dispatch(showAlert(t("File size must be less than 5MB"), "warning"));
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);

    const response = isVideo
      ? axios.post("/upload-video", data, {
          headers: {
            "Content-Type": "mulpipart/form-data",
          },
        })
      : isGif
      ? axios.post("/upload-gif", data, {
          headers: {
            "Content-Type": "mulpipart/form-data",
          },
        })
      : axios.post("/upload", data, {
          headers: {
            "Content-Type": "mulpipart/form-data",
          },
        });

    response
      .then((res) => {
        addNewImage(res?.filename);
      })
      .catch((err) => console.log("error here: ", err))
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
    <div className={`Gallery ${className}`}>
      {imageLinks?.map((link, index) => (
        <div
          className="block mr-2 valuable"
          style={
            aspectRatio
              ? { width, aspectRatio, borderRadius: rounded ? "50%" : 8 }
              : { width, height, borderRadius: rounded ? "50%" : 8 }
          }
          onClick={() => imageClickHandler(index)}
          key={link}
        >
          {!notEditable && (
            <button
              type="button"
              className={`close-btn ${rounded ? "rounded-block" : ""}`}
              onClick={(e) => closeButtonHandler(e, link)}
            >
              <CancelIcon />
            </button>
          )}
          <img
            src={link}
            alt=""
            style={{ borderRadius: rounded ? "50%" : "inherit" }}
          />
        </div>
      ))}

      <div
        className="add-block block"
        style={
          aspectRatio
            ? {
                width,
                aspectRatio,
                borderRadius: rounded ? "50%" : 8,
                display: !notEditable && isShow ? "flex" : "none",
              }
            : {
                width,
                height,
                borderRadius: rounded ? "50%" : 8,
                display: !notEditable && isShow ? "flex" : "none",
              }
        }
        onClick={() => inputRef.current.click()}
      >
        <div className="add-icon">
          {!loading ? (
            <>
              <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
              {maxSize && (
                <p className="text-sm text-center px-3">
                  {t("max.size." + maxSize + "mb")}
                </p>
              )}
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

      {previewVisible &&
        ReactDom.createPortal(
          <ImageViewer
            style={{ zIndex: 100000, width, height }}
            src={imageLinks}
            currentIndex={selectedImageIndex}
            disableScroll={true}
            onClose={() => setPreviewVisible(false)}
          />,
          document.querySelector("#portal-root"),
        )}
      {bottomText && (
        <p
          className="mt-2 text-primary text-base text-center"
          onClick={() => inputRef.current.click()}
          style={{ cursor: "pointer" }}
        >
          {imageLinks.length ? t("change.photo") : t("add.photo")}
        </p>
      )}
    </div>
  );
};

export default Gallery;
