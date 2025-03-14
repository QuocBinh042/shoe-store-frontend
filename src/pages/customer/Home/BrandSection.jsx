import React from "react";

const brands = [
  { src: "/ImageBrand/Shoe/Shoe_Nike.png", alt: "Nike" },
  { src: "/ImageBrand/Shoe/Shoe_Adidas.png", alt: "Adidas" },
  { src: "/ImageBrand/Shoe/Shoe_Puma.png", alt: "Puma" },
  { src: "/ImageBrand/Shoe/Shoe_Reebok.png", alt: "Reebok" },
  { src: "/ImageBrand/Shoe/Shoe_UnderArmour.png", alt: "Under Armour" },
  { src: "/ImageBrand/Shoe/Shoe_Converse.png", alt: "Converse" },
];

const products = [
  { src: "../images/shoe1.png", alt: "Product 1" },
  { src: "../images/shoe2.png", alt: "Product 2" },
  { src: "../images/shoe2.png", alt: "Product 3" },
  { src: "../images/shoe2.png", alt: "Product 4" },
  { src: "../images/shoe1.png", alt: "Product 5" },
  { src: "../images/shoe1.png", alt: "Product 6" },
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
              />
            </div>
          ))}
        </div>
      </div>

      <div className="product-section">
        {products.map((product, index) => (
          <div key={index} className="product-section__card">
            <img
              src={product.src}
              alt={product.alt}
              className="product-section__image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandAndProductSection;
