import PropTypes from "prop-types";
import React from "react";
import { setActiveSort } from "../../helpers/product";

const OrderCategories = ({ categories, getSortParams }) => {
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Order Time </h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    getSortParams("period", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All
                </button>
              </div>
            </li>
            {categories.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      onClick={e => {
                        getSortParams("period", category.category_title);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" /> {category.category_title}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No categories found"
        )}
      </div>
    </div>
  );
};

OrderCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default OrderCategories;
