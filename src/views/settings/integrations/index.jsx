import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import iiko from "assets/Integrations/iiko.png";
import rkeeper from "assets/Integrations/r_keeper.png";
import jowi from "assets/Integrations/jowi.png";
import payme from "assets/Integrations/payme.png";
import click from "assets/Integrations/click.png";
import uzum from "assets/Integrations/uzum.png";
import poster from "assets/Integrations/poster.png";
import eskiz from "assets/Integrations/eskiz.png";
import play_mobile from "assets/Integrations/play_mobile.png";
import styles from "./styles.module.scss";

export default function Integrations() {
  const { t } = useTranslation();
  const history = useHistory();
  const integrations = useMemo(
    () => ({
      payment: [
        {
          img: click,
          id: "click",
          name: "click",
          link: "/home/settings/integrations/click",
        },
        {
          img: payme,
          id: "payme",
          name: "payme",
          link: "/home/settings/integrations/payme",
        },
        {
          img: uzum,
          id: "uzum",
          name: "uzum",
          link: "/home/settings/integrations/apelsin",
        },
      ],
      sms: [
        {
          img: eskiz,
          id: "eskiz",
          name: "eskiz",
          link: "/home/settings/integrations/sms",
        },
        {
          img: play_mobile,
          id: "play_mobile",
          name: "play_mobile",
          link: "/home/settings/integrations/sms",
        },
      ],
      pos: [
        {
          img: iiko,
          id: "iiko",
          name: "iiko",
          link: "/home/settings/integrations/iiko",
        },
        {
          img: jowi,
          id: "jowi",
          name: "jowi",
          link: "/home/settings/integrations/jowi",
        },
        {
          img: poster,
          id: "poster",
          name: "poster",
          link: "/home/settings/integrations/poster",
        },
        {
          img: rkeeper,
          id: "r_keeper",
          name: "r_keeper",
          link: "/home/settings/integrations/rkeeper",
        },
      ],
    }),
    [],
  );
  return (
    <>
      <Header title={t("integrations")} />
      <div className={styles.integrations}>
        <h3 className={styles.header}>POS</h3>
        <div className="flex flex-wrap gap-4 pl-4 mb-8">
          {integrations.pos.map((system) => (
            <div
              key={system.id}
              onClick={() => history.push(system.link)}
              className={styles.card}
            >
              <img src={system.img} alt={system.name} />
            </div>
          ))}
        </div>
        <h3 className={styles.header}>Платежные системы</h3>
        <div className="flex flex-wrap gap-4 pl-4 mb-8">
          {integrations.payment.map((system) => (
            <div
              key={system.id}
              onClick={() => history.push(system.link)}
              className={styles.card}
            >
              <img src={system.img} alt={system.name} />
            </div>
          ))}
        </div>
        <h3 className={styles.header}>SMS-провайдеры</h3>
        <div className="flex flex-wrap gap-4 pl-4 mb-8">
          {integrations.sms.map((system) => (
            <div
              key={system.id}
              onClick={() => history.push(system.link)}
              className={styles.card}
            >
              <img src={system.img} alt={system.name} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
