import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import imageBase from "../../constants/imageBase";

const BlogPostsNoSidebar = ({ products }) => {
  return (
    <Fragment>
      {products &&
        products.map((data) => (
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="blog-wrap-2 mb-30">
              <div className="blog-img-2">
                <Link
                  to={process.env.PUBLIC_URL + `/blog-details/${data.blog_id}/${data.title}`}
                  state={{ data: data }}
                >
                  <img
                    src={`${imageBase}${data.file_name}`}
                    className="irounded-sm img-fluid w-100 mb-5"
                    alt="post-thumb"
                    style={{ height: "250px", width: "250px" }}
                  />
                </Link>
              </div>
              <div className="blog-content-2">
                <div className="blog-meta-2">
                  <ul>
                    <li>
                      <span>{data.date}</span>
                    </li>
                  </ul>
                </div>
                <h4>
                <Link
                  to={process.env.PUBLIC_URL + `/blog-details/${data.blog_id}/${data.title}`}
                  state={{ data: data }}
                >
                    <span>{data.title}</span>
                  </Link>
                </h4>

                <div className="blog-share-comment">
                  <div className="blog-btn-2">
                   <Link
                  to={process.env.PUBLIC_URL + `/blog-details/${data.blog_id}/${data.title}`}
                  state={{ data: data }}
                >
                      read more
                    </Link>
                  </div>
                  <div className="blog-share">
                    <span>share :</span>
                    <div className="share-social">
                      <ul>
                        <li>
                          <a className="facebook" href="//facebook.com">
                            <i className="fa fa-facebook" />
                          </a>
                        </li>
                        <li>
                          <a className="twitter" href="//twitter.com">
                            <i className="fa fa-twitter" />
                          </a>
                        </li>
                        <li>
                          <a className="instagram" href="//instagram.com">
                            <i className="fa fa-instagram" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </Fragment>
  );
};

export default BlogPostsNoSidebar;
