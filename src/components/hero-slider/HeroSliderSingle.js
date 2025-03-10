import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import imageBase from "../../constants/imageBase";
import "./HeroSliderSingle.css"; // Import CSS file

const HeroSliderSingle = ({ data, sliderClass }) => {
  return (
    <div
      className={`single-slider-2 slider-height-1 ${sliderClass ? sliderClass : ""}`}
      style={{ backgroundImage: `url(${imageBase}${data.file_name})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-7 ml-auto">
            <div className="slider-content-2 slider-animated-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSliderSingle.propTypes = {
  data: PropTypes.object,
  sliderClass: PropTypes.string,
};

export default HeroSliderSingle;
