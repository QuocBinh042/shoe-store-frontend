import React, { useState, useEffect } from 'react';
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Button } from "antd";
import './ResultsHeader.scss';

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
    <div className="results-header">
      <div className="results-info">
        <h3 className="results-count">
          Results (<strong>{resultsCount}</strong>)
        </h3>
      </div>
      <div className="header-actions">
        <Input
          placeholder="Search products..."
          value={keyword}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          className="search-input"
        />
        <Dropdown menu={{ items, onClick: handleMenuClick }}>
          <Button className="sort-button">
            {selectedSort} <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default ResultsHeader;