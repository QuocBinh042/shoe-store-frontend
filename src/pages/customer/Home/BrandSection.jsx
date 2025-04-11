import React from "react";
const CLOUDINARY_BRAND_BASE_URL = process.env.REACT_APP_CLOUDINARY_BRAND_IMAGE_BASE_URL
const brands = [
  { src: `${CLOUDINARY_BRAND_BASE_URL}nike/nike.png`, alt: "Nike" },
  { src: `${CLOUDINARY_BRAND_BASE_URL}adidas/adidas.png`, alt: "Adidas" },
  { src: `${CLOUDINARY_BRAND_BASE_URL}puma/puma.png`, alt: "Puma" },
  { src: `${CLOUDINARY_BRAND_BASE_URL}reebok/reebok.png`, alt: "Reebok" },
  { src: `${CLOUDINARY_BRAND_BASE_URL}under_armor/under_armour.png`, alt: "Under Armour" },
];

const BrandAndProductSection = () => {
  return (
    <div className="brand-product-section">
      <div className="brand-section">
        <div className="brand-section__divider">
          <h2 className="brand-section__title">Our Trusted Brands</h2>
          <p className="brand-section__description">
            We partner with the most reliable brands to bring you the best
            products and services.
          </p>
        </div>
        <div className="brand-section__container">
          {brands.map((brand, index) => (
            <div key={index} className="brand-section__item">
              <img
                src={brand.src}
                alt={brand.alt}
                className="brand-section__image"
                width={150}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandAndProductSection;
