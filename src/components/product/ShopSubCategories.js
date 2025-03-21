import PropTypes from "prop-types";
import React, { useState } from "react";

const SubcategoriesTree = ({ categories, subcategories, subcategoryTypes }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Category Tree</h4>
      <div className="sidebar-widget-list mt-30">
        {categories?.map((category) => (
          <div key={category.category_id}>
            <div className="category-item">
              <button onClick={() => toggleExpand(category.category_id)}>
                {expanded[category.category_id] ? "▼" : "▶"} {category.category_title}
              </button>
            </div>

            {expanded[category.category_id] && (
              <ul className="subcategory-list">
                {subcategories
                  .filter((sub) => sub.parent_id === category.category_id)
                  .map((subcategory) => (
                    <li key={subcategory.subcategory_id}>
                      <div className="subcategory-item">
                        <button onClick={() => toggleExpand(subcategory.subcategory_id)}>
                          {expanded[subcategory.subcategory_id] ? "▼" : "▶"} {subcategory.subcategory_title}
                        </button>
                      </div>

                      {expanded[subcategory.subcategory_id] && (
                        <ul className="subcategory-type-list">
                          {subcategoryTypes
                            .filter((type) => type.subcategory_id === subcategory.subcategory_id)
                            .map((type) => (
                              <li key={type.type_id} className="subcategory-type-item">
                                {type.type_title}
                              </li>
                            ))}
                        </ul>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

SubcategoriesTree.propTypes = {
  categories: PropTypes.array.isRequired,
  subcategories: PropTypes.array.isRequired,
  subcategoryTypes: PropTypes.array.isRequired,
};

export default SubcategoriesTree;
