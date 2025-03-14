import React, { useState, useEffect } from 'react';
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Button } from "antd";

const ResultsHeader = ({ resultsCount, keyword, onKeywordChange, onSortChange, currentSort }) => {
  const [selectedSort, setSelectedSort] = useState(currentSort || "Sort by");

  useEffect(() => {
    setSelectedSort(currentSort || "Sort by");
  }, [currentSort]);

  const items = [
    { key: '1', label: "Featured" },
    { key: '2', label: "Newest" },
    { key: '3', label: "Price: High-Low" },
    { key: '4', label: "Price: Low-High" },
  ];

  const handleMenuClick = (info) => {
    const sortOptions = {
      '1': "Featured",
      '2': "Newest",
      '3': "Price: High-Low",
      '4': "Price: Low-High",
    };

    const sortBy = sortOptions[info.key];
    setSelectedSort(sortBy);
    onSortChange(sortBy);
  };

  const handleSearchChange = (e) => {
    onKeywordChange(e.target.value);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: '#F5F5F5',
      padding: '15px 25px',
      borderRadius: "10px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    }}>
      <div>
        <h3 style={{ margin: 0, fontSize: "18px" }}>
          Results <strong>{keyword}</strong> (<strong>{resultsCount}</strong>)
        </h3>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Input
          placeholder="Search products..."
          value={keyword}
          onChange={handleSearchChange}
          prefix={<SearchOutlined style={{ color: "#999" }} />} 
          style={{
            width: 300,
            height: 40,
            borderRadius: "8px",
            border: "1px solid #ddd",
            paddingLeft: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        />
        <Dropdown menu={{ items, onClick: handleMenuClick }}>
          <Button
            style={{
              height: 40,
              borderRadius: "8px",
              background: "#fff",
              border: "1px solid #ddd",
              padding: "0 15px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              fontWeight: "500"
            }}
          >
            {selectedSort} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default ResultsHeader;
