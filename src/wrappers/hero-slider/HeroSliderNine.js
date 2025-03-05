import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import HeroSliderNineSingle from "../../components/hero-slider/HeroSliderSingle.js";

const HeroSliderNine = ({ spaceLeftClass, spaceRightClass, sliderData }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <button className="slick-next">→</button>,
    prevArrow: <button className="slick-prev">←</button>,
  };

  return (
    <div
      className={`slider-area ${spaceLeftClass || ""} ${
        spaceRightClass || ""
      }`}
    >
      <div className="slider-active nav-style-1">
        <Slider {...settings}>
          {sliderData &&
            sliderData.map((single, key) => (
             
                <HeroSliderNineSingle data={single} key={key} sliderClass="slick-slide" />
             
            ))}
        </Slider>
      </div>
    </div>
  );
};

HeroSliderNine.propTypes = {
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
  sliderData: PropTypes.array.isRequired,
};

export default HeroSliderNine;
