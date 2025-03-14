import React from "react";
import product from "../../../assets/images/products/shoe3.png";
import { List } from "antd";


const FeatureProduct = () => {
  const featureDetails = [
    "Gender: Men",
    "Sports Type: LIFESTYLE",
    "Upper Material: Mesh (Air mesh)",
    "Shoe Width: Medium (B,M)",
    "Upper Height: Low",
    "Function: Stability",
    "Outsole Material: Rubber",
    "Technology: Flywire",
    "Applicable Place: Outdoor Lawn",
  ];

  return (
    <div className="feature-product">
      <div className="feature-product__container">
        <div className="feature-product__content">
          <h3 className="feature-product__content-subtitle">FEATURE PRODUCTS</h3>
          <h1 className="feature-product__content-title">LUKMALL MEN RUNNING</h1>
          <button className="feature-product__content-button">BUY NOW</button>
        </div>
        <div className="feature-product__image">
          <img
            src={product}
            alt="Lukmall Men Running Shoe"
            className="feature-product__image-file"
          />
        </div>

        <div className="feature-product__details">
          <List className="feature-product__details-list"
            dataSource={featureDetails}
            renderItem={(item) => (
              <List.Item className="feature-product__details-list-item">
                <span className="feature-product__icon">&#10003;</span>
                {item}
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureProduct;
