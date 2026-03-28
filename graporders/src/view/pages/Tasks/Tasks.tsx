import React, { useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

export default function Tasks() {
  const [active, setActive] = useState("all");

  return (
    <div>
      <SubHeader title={i18n('pages.tasks.title')} path="/profile" />
      <div className="order__list">
        <div className="list__actions">
          <div
            className={active === "all" ? `active__order` : ""}
            onClick={() => setActive("all")}
          >
            <span className="">{i18n('pages.tasks.tabs.all')}</span>
          </div>
          <div
            onClick={() => setActive("pending")}
            className={active === "pending" ? `active__order` : ""}
          >
            <span>{i18n('pages.tasks.tabs.pending')}</span>
          </div>
          <div
            onClick={() => setActive("completed")}
            className={active === "completed" ? `active__order` : ""}
          >
            <span>{i18n('pages.tasks.tabs.completed')}</span>
          </div>
          <div
            onClick={() => setActive("canceled")}
            className={active === "canceled" ? `active__order` : ""}
          >
            <span>{i18n('pages.tasks.tabs.canceled')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
