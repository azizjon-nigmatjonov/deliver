import TabPanel from "components/Tab/TabPanel";
import Gallery from "components/Gallery";
import Input from "components/Input";
import Switch from "components/Switch";
import { useTranslation } from "react-i18next";

const LanguageTab = ({ image, setData, title, lang, url, active }) => {
  const { t } = useTranslation();

  return (
    // <TabPanel value={value} index={0} dir={theme.direction}>
    <div className="grid grid-cols-12 mb-14">
      <div className="col-span-3">
        <div>
          <div className="input-label mb-2 mt-6">
            <span>{t("image")}</span>
          </div>
          <Gallery
            multiple={false}
            style={{ paddingTop: "20px", marginTop: "20px" }}
            width={120}
            height={120}
            className="mt-8"
            gallery={image ? [image] : []}
            setGallery={(elm) => {
              setData((prev) => ({
                ...prev,
                image: elm[0],
              }));
            }}
            extraTitle="1248x540"
          />
        </div>
      </div>
      <div className="col-span-9">
        <div className="w-full flex justify-between items-baseline pt-4">
          <div className="w-full mr-4">
            <div className="input-label mb-2 mt-6">
              <span>{t("name")}</span>
            </div>
            <Input
              placeholder={t("Баннер")}
              value={title}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  [lang]: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="w-full flex justify-between items-baseline pt-4">
          <div className="w-full mr-4">
            <div className="input-label mb-2">
              <span>{t("Ссылка")}</span>
            </div>
            <Input
              placeholder={t("http")}
              value={url}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  url: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="w-full flex justify-between items-baseline pt-4">
          <div className="w-full mr-4">
            <div className="w-1/4 input-label">
              <span>{t("status")}</span>
            </div>
            <div className="w-3/4">
              <Switch
                id="active"
                checked={active}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    active: e,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    // </TabPanel>
  );
};

export default LanguageTab;
