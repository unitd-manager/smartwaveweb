import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import MetaTags from "react-meta-tags";
import Paginator from "react-hooks-paginator";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { getSortedCategories } from "../../helpers/product";
import LayoutOne from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import api from "../../constants/api";
import BlogPosts from "../../wrappers/blog/BlogPosts";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";

const BlogStandard = ({}) => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const location = useLocation();
  const history = useHistory();

  console.log("search", searchQuery);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const query = urlSearchParams.get("search");
    if (query) {
      setSearchQuery(query);
      api
        .post(`blog/getBlogBySearch`, { keyword: query })
        .then((res) => {
          setProducts(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .get("/blog/getBlogImage")
        .then((res) => {
          setProducts(res.data.data);
        })
        .catch(() => {
          console.log("error");
        });
    }
    console.log("searchquery", query);
  }, [location]);

  const pageLimit = 15;
  const { pathname } = location;

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };

  useEffect(() => {
    const filter = async () => {
      let sortedProducts = await getSortedCategories(
        products,
        sortType,
        sortValue
      );
      console.log("sortedProducts", sortedProducts);
      const filterSortedProducts = getSortedCategories(
        sortedProducts,
        filterSortType,
        filterSortValue
      );
      sortedProducts = filterSortedProducts;
      console.log("sorted", sortedProducts);
      setSortedProducts(sortedProducts);
      setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    };
    filter();
  }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    history.push(`?search=${searchQuery}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Pearl | Blog Page</title>
        <meta
          name="description"
          content="Shop page of Pearl Food eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Blog
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                {/* shop sidebar */}
                <BlogSidebar
                  products={products}
                  getSortParams={getSortParams}
                  handleSearchSubmit={handleSearchSubmit}
                  handleSearchChange={handleSearchChange}
                  sideSpaceClass="mr-30"
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                {/* shop page content default */}
                <div className="row">
                  <BlogPosts layout={layout} products={currentData} />
                </div>
                {/* shop product pagination */}
                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={sortedProducts.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

BlogStandard.propTypes = {
  location: PropTypes.object,
  products: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    products: state.productData.products,
  };
};

export default connect(mapStateToProps)(BlogStandard);
