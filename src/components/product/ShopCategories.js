import PropTypes from "prop-types";
import React, { useState } from "react";
import { setActiveSort } from "../../helpers/product";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const ShopCategories = ({ categories, selectedCategories,setSelectedCategories,getSortParams }) => {
  // const [selectedCategories, setSelectedCategories] = useState([]);
console.log('selectedCategories',selectedCategories);
  const handleCategorySelection = (categoryId) => {
    let updatedCategories = [...selectedCategories];

    if (categoryId === "") {
      // If "All Categories" is clicked, reset selection
      updatedCategories = [];
    } else {
      if (updatedCategories.includes(categoryId)) {
        // Remove category if already selected
        updatedCategories = updatedCategories.filter(id => id !== categoryId);
      } else {
        // Add category to selection
        updatedCategories.push(categoryId);
      }
    }

    setSelectedCategories(updatedCategories);
    getSortParams("category", updatedCategories,updatedCategories); // Pass selected categories array
  };
  // const handleCategorySelection = (categoryId) => {
  //   let updatedCategories = [...selectedCategories];
  
  //   if (categoryId === "") {
  //     // If "All Categories" is clicked, reset selection
  //     updatedCategories = [];
  //   } else {
  //     updatedCategories = updatedCategories.includes(categoryId)
  //       ? updatedCategories.filter(id => id !== categoryId) // Remove category
  //       : [...updatedCategories, categoryId]; // Add category
  //   }
  
  //   setSelectedCategories(updatedCategories);
  //   getSortParams("category", updatedCategories,updatedCategories); // Pass only the updated category array
  // };

  
console.log('selectedCategories',selectedCategories);
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categories</h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    handleCategorySelection("");
                    setActiveSort(e);
                  }}
                  className={selectedCategories.length === 0 ? "active" : ""}
                >
                 Clear All
                </button>
              </div>
            </li>
            
            {/* {categories.map((category) => {
  const isSelected = selectedCategories.includes(category.category_id); // Ensure selection is checked
  return (
    <li key={category.category_id}>
      <div className="sidebar-widget-list-left">
        <button
          onClick={e => {
            handleCategorySelection(category.category_id);
            setActiveSort(e);
          }}
           className={isSelected ? "active" : ""}
        
        >
          <span className="checkmark" /> {category.category_title}
        </button>
      </div>
    </li>
  );
})} */}
{categories.map((category) => (
  <label key={category.category_id} className="custom-checkbox">
    <input
      type="checkbox"
      value={category.category_id}
      checked={selectedCategories.includes(String(category.category_id))}
     // checked={selectedCategories.includes(category.category_id)}
      onChange={() => handleCategorySelection(String(category.category_id))}
    />
    <span className="checkmark"></span> {category.category_title}
  </label>
))}


          </ul>
        ) : (
          "No categories found"
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopCategories;
