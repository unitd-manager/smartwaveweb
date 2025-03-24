import PropTypes from "prop-types";
import React, { useState } from "react";

const SubcategoriesTree = ({ categoryId, subcategories, subcategoryTypes,getSortParams }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleSubcategorySelection = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? null : subcategoryId);
    setSelectedType(null); 
    getSortParams("subcategory", subcategoryId);
  };

  const handleTypeSelection = (typeId) => {
    setSelectedType(typeId === selectedType ? null : typeId);
    getSortParams("subcategorytype", typeId);
  };

  return (
    <ul style={{ marginLeft: "20px", listStyle: "none" }}>
      {subcategories
        .filter(sub => sub.category_id=== categoryId) // Show only subcategories of selected category
        .map(sub => (
          <li key={sub.sub_category_id}>
            <label className="custom-checkbox">
              <input
                type="radio"
                name="subcategory"
                value={sub.sub_category_id}
                checked={selectedSubcategory === sub.sub_category_id}
                onChange={() => handleSubcategorySelection(sub.sub_category_id)}
              />
              <span className="checkmark"></span> {sub.sub_category_title}
            </label>

            {/* Show Subcategory Types if subcategory is selected */}
            {selectedSubcategory === sub.sub_category_id && (
              <ul style={{ marginLeft: "20px", listStyle: "none" }}>
                {subcategoryTypes
                  .filter(type => type.sub_category_id === sub.sub_category_id)
                  .map(type => (
                    <li key={type.sub_category_type_id}>
                      <label className="custom-checkbox">
                        <input
                          type="radio"
                          name="subcategoryType"
                          value={type.sub_category_type_id}
                          checked={selectedType === type.sub_category_type_id}
                          onChange={() => handleTypeSelection(type.sub_category_type_id)}
                        />
                        <span className="checkmark"></span> {type.type_title}
                      </label>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
    </ul>
  );
};

SubcategoriesTree.propTypes = {
  categoryId: PropTypes.string.isRequired,
  subcategories: PropTypes.array.isRequired,
  subcategoryTypes: PropTypes.array.isRequired,
};

export default SubcategoriesTree;
