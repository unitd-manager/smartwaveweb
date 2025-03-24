import PropTypes from "prop-types";
import React, { useState } from "react";
import { setActiveSort } from "../../helpers/product";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SubcategoriesTree from "./ShopSubCategories";

const ShopCategories = ({ 
  categories,
  selectedCategories,setSelectedCategories,getSortParams,
  setSelectedCategory
  ,selectedCategory,
  subcategories,subcategoryTypes
   }) => {
  // const [selectedCategories, setSelectedCategories] = useState([]);

console.log('selectedCategories',selectedCategories);
const history=useHistory();


  

const handleCategorySelection = (categoryId) => {
  if (selectedCategories === categoryId) {
    // If the same category is clicked, unselect it
    //setSelectedCategory('');
    setSelectedCategories("");
    getSortParams("category", "");
  } else {
    // Select only the new category
    setSelectedCategories(categoryId);
    //setSelectedCategory(categoryId);
    getSortParams("category", categoryId);
  }
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
                    history.push('/shop')
                  }}
                
                >
                 Clear All
                </button>
              </div>
            </li>
          
{categories.map((category) => (
  <div key={category.category_id}>
  <label key={category.category_id} className="custom-checkbox">
    <input
      type="checkbox"
      value={category.category_id}
      checked={selectedCategories === String(category.category_id)}
      onChange={() => handleCategorySelection(String(category.category_id))}
    />
    <span className="checkmark"></span> {category.category_title}
  </label>
       {selectedCategories ===  String(category.category_id) && (
        <SubcategoriesTree
          categoryId={category.category_id}
          subcategories={subcategories}
          subcategoryTypes={subcategoryTypes}
          getSortParams={getSortParams}
        />
      )}
      </div>
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
