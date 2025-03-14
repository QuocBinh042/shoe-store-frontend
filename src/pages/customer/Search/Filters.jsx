import { Collapse, Checkbox, Radio, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { fetchFilters } from "../../../services/searchService";

const Filters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: null,
  });

  useEffect(() => {
    const loadFilters = async () => {
      const data = await fetchFilters();
      if (data.data) {
        setCategories(data.data.categories || []);
        setBrands(data.data.brands || []);
      }
    };

    loadFilters();
  }, []);

  const priceRanges = [
    { label: "Under 1.000.000", value: JSON.stringify({ minPrice: null, maxPrice: 1000000 }) },
    { label: "1.000.000 to 2.000.000", value: JSON.stringify({ minPrice: 1000000, maxPrice: 2000000 }) },
    { label: "2.000.000 to 3.000.000", value: JSON.stringify({ minPrice: 2000000, maxPrice: 3000000 }) },
    { label: "3.000.000 to 5.000.000", value: JSON.stringify({ minPrice: 3000000, maxPrice: 5000000 }) },
    { label: "Over 5.000.000", value: JSON.stringify({ minPrice: 5000000, maxPrice: null }) },
  ];

  const colors = ["RED", "BLUE", "GREEN", "YELLOW", "BLACK", "PURPRE", "ORANGE", "PINK"];
  const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44];
  const formattedSizes = sizes.map((size) => `SIZE_${size}`);

  const updateFilters = (key, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev, [key]: value }; 
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const items = [
    {
      key: "1",
      label: "Categories",
      children: (
        <Checkbox.Group
          className="filters__categories"
          onChange={(values) => updateFilters("categories", values)}
        >
          {categories.map((category) => (
            <div className="filters__categories-item" key={category.categoryID}>
              <Checkbox
                className="filters__categories-item-checkbox"
                value={category.categoryID}
              >
                {category.name}
              </Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      ),
    },
    {
      key: "2",
      label: "Price",
      children: (
        <Radio.Group
          className="filters__prices"
          value={selectedFilters.priceRange}
          onChange={(e) => updateFilters("priceRange", e.target.value)}
        >
          {priceRanges.map((item) => (
            <Radio value={item.value} key={item.label}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      ),
    },
    {
      key: "3",
      label: "Brand",
      children: (
        <Checkbox.Group
          className="filters__brands"
          onChange={(values) => updateFilters("brands", values)}
        >
          {brands.map((brand) => (
            <Checkbox value={brand.brandID} key={brand.brandID}>
              {brand.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
      ),
    },
    {
      key: "4",
      label: "Color",
      children: (
        <Row gutter={[8, 8]}>
          {colors.map((color) => (
            <Button
              key={color}
              className={`filters__colors-item ${selectedFilters.colors.includes(color) ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => {
                const newColors = selectedFilters.colors.includes(color)
                  ? selectedFilters.colors.filter((c) => c !== color)
                  : [...selectedFilters.colors, color];
                updateFilters("colors", newColors);
              }}
            />
          ))}
        </Row>
      ),
    },
    {
      key: "5",
      label: "Size",
      children: (
        <Row gutter={[8, 8]}>
          {formattedSizes.map((size) => (
            <Button
              className={`filters__sizes-item ${selectedFilters.sizes.includes(size) ? "selected" : ""}`}
              key={size}
              onClick={() => {
                const newSizes = selectedFilters.sizes.includes(size)
                  ? selectedFilters.sizes.filter((s) => s !== size)
                  : [...selectedFilters.sizes, size];
                updateFilters("sizes", newSizes);
              }}
            >
              {size.replace("SIZE_", "")}
            </Button>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <Collapse
      defaultActiveKey={["1", "2", "3", "4", "5"]}
      className="custom-collapse"
      bordered={false}
      expandIconPosition="end"
      expandIcon={<DownOutlined />}
      items={items}
      
    />
  );
};

export default Filters;
