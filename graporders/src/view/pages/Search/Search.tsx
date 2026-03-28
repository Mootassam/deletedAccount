import React from "react";
import { i18n } from "../../../i18n";

function Search() {
  return (
    <div className="search__page">
      <div className="search__input">
        <input type="text" placeholder={i18n('pages.search.placeholder')} />
      </div>
    </div>
  );
}

export default Search;
