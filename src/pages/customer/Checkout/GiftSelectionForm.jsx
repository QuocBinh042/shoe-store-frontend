import React, { useState, useEffect } from "react";
import { Row, Col, Button, message, Typography, Divider } from "antd";

const { Title } = Typography;

const GiftSelectionForm = ({ variants, onSelect, productName, variantsData }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [productImage, setProductImage] = useState(null);

  const availableColors = Array.isArray(variants)
    ? [...new Set(variants.map((v) => v.color).filter(Boolean))]
    : [];

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor && variants && variants.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor, variants]);

  useEffect(() => {
    if (selectedColor && variantsData && variantsData.length > 0) {
      const firstVariant = variantsData.find(v => v.color === selectedColor);
      setProductImage(firstVariant?.image ? `${process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL}${firstVariant.image}` : null);

      const sizesForColor = variants
        .filter((variant) => variant.color === selectedColor && variant.stockQuantity > 0)
        .map((variant) => variant.size);
      const uniqueSizes = [...new Set(sizesForColor)];
      setFilteredSizes(uniqueSizes);
      if (uniqueSizes.length > 0 && !selectedSize) {
        setSelectedSize(uniqueSizes[0]);
      }
    } else {
      setFilteredSizes([]);
      setSelectedSize(null);
      setProductImage(null);
    }
  }, [selectedColor, variants, selectedSize, variantsData]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null)
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleConfirm = () => {
    if (selectedColor && selectedSize) {
      onSelect(selectedColor, selectedSize);
    } else {
      message.error("Please select color and size for gift product");
    }
  };

  return (
    <div>
      <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <img
            src={productImage}
            alt={productName}
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          />
        </Col>
        <Col>
          <Title level={5} style={{ margin: 0 }}>
            {productName}
          </Title>
        </Col>
      </Row>

      <Divider />

      <h4>Color</h4>
      <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
        {availableColors.map((color, index) => (
          <Col key={index}>
            <Button
              onClick={() => handleColorSelect(color)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: selectedColor === color ? "2px solid #1677ff" : "1px solid #ddd",
                borderRadius: "6px",
                padding: "6px 14px",
                backgroundColor: selectedColor === color ? "#e6f4ff" : "#fff",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: color.toLowerCase(),
                  borderRadius: "20%",
                  border: "1px solid #ddd",
                }}
              />
              {color}
            </Button>
          </Col>
        ))}
      </Row>

      <h4>Size</h4>
      {selectedColor ? (
        filteredSizes.length > 0 ? (
          <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
            {filteredSizes.map((size, index) => {
              const stock = variants.find(
                (variant) => variant.color === selectedColor && variant.size === size
              )?.stockQuantity;

              return (
                <Col key={index}>
                  <Button
                    onClick={() => handleSizeSelect(size)}
                    disabled={stock === 0}
                    style={{
                      border: selectedSize === size ? "2px solid #1677ff" : "1px solid #ddd",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      backgroundColor: selectedSize === size ? "#e6f4ff" : "#fff",
                    }}
                  >
                    {size.replace("SIZE_", "")}
                  </Button>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p>No sizes available for this color.</p>
        )
      ) : (
        <p>Please select a color first.</p>
      )}

      <Button
        type="primary"
        size="middle"
        onClick={handleConfirm}
        style={{ marginTop: 12, borderRadius: 6 }}
      >
        Select
      </Button>
    </div>
  );
};

export default GiftSelectionForm;