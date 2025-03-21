import PropTypes from "prop-types";
import React, { useState } from "react";
import { setActiveSort } from "../../helpers/product";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SubcategoriesTree from "./ShopSubCategories";

const ShopCategories = ({ 
  categories,
  selectedCategories,setSelectedCategories,getSortParams,
  setSelectedCategory
  ,selectedCategory
   }) => {
  // const [selectedCategories, setSelectedCategories] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState(null);
console.log('selectedCategories',selectedCategories);
const history=useHistory();
// const categories = [
//   { category_id: "1", category_title: "Electronics" },
//   { category_id: "2", category_title: "Clothing" },
// ];

// const subcategories = [
//   { subcategory_id: "101", subcategory_title: "Mobile Phones", parent_id: "1" },
//   { subcategory_id: "102", subcategory_title: "Laptops", parent_id: "1" },
//   { subcategory_id: "201", subcategory_title: "Men's Wear", parent_id: "2" },
//   { subcategory_id: "202", subcategory_title: "Women's Wear", parent_id: "2" },
// ];

// const subcategoryTypes = [
//   { type_id: "1001", type_title: "Android Phones", subcategory_id: "101" },
//   { type_id: "1002", type_title: "iPhones", subcategory_id: "101" },
//   { type_id: "2001", type_title: "Gaming Laptops", subcategory_id: "102" },
//   { type_id: "2002", type_title: "Ultrabooks", subcategory_id: "102" },
//   { type_id: "3001", type_title: "Casual Wear", subcategory_id: "201" },
//   { type_id: "3002", type_title: "Formal Wear", subcategory_id: "201" },
// ];


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

    // setSelectedCategory(categoryId);
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
                    history.push('/shop')
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
      {/* {selectedCategories.length > 0 && (
  <SubcategoriesTree
    categories={categories.filter(cat => selectedCategories.includes(cat.category_id))}
    subcategories={subcategories}
    subcategoryTypes={subcategoryTypes}
  />
)} */}

    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopCategories;
