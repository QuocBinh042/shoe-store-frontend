import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Spin } from 'antd';
import Filters from './Filters';
import ProductGrid from './ProductGrid';
import ResultsHeader from './ResultHeader';
import { fetchAllProducts, fetchFilteredProducts } from '../../../services/searchService';
import { debounce } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import './Search.scss';

const { Sider, Content } = Layout;

const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: null,
    sortBy: null,
    keyword: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filtersRef = useRef(filters);

  useEffect(() => {
    if (Object.values(filtersRef.current).some(filter => filter)) {
      handleFilterChange(filtersRef.current, currentPage);
    } else {
      loadAllProducts(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const loadAllProducts = async (page) => {
    setLoading(true);
    try {
      const { products, total } = await fetchAllProducts(page);
      setProducts(products || []);
      setTotalProducts(total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    setSearchParams({ page });

    if (Object.values(filtersRef.current).some(filter => filter)) {
      await handleFilterChange(filtersRef.current, page);
    } else {
      await loadAllProducts(page);
    }
  };

  const handleFilterChange = useCallback(
    async (newFilters, page = currentPage) => {
      setLoading(true);
      const updatedFilters = {
        ...filtersRef.current,
        ...newFilters,
        sortBy: newFilters.sortBy ?? filtersRef.current.sortBy,
        keyword: newFilters.keyword ?? filtersRef.current.keyword,
      };

      filtersRef.current = updatedFilters;
      setFilters(updatedFilters);

      if (Object.values(updatedFilters).every(value => !value || (Array.isArray(value) && value.length === 0))) {
        await loadAllProducts(page);
        return;
      }

      const params = {
        categories: updatedFilters.categories,
        brands: updatedFilters.brands,
        colors: updatedFilters.colors,
        sizes: updatedFilters.sizes,
        minPrice: updatedFilters.priceRange ? JSON.parse(updatedFilters.priceRange).minPrice : null,
        maxPrice: updatedFilters.priceRange ? JSON.parse(updatedFilters.priceRange).maxPrice : null,
        sortBy: updatedFilters.sortBy || null,
        keyword: updatedFilters.keyword || null,
      };

      try {
        const { products, total } = await fetchFilteredProducts(params, page);
        setProducts(products || []);
        setTotalProducts(total || 0);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  const debouncedHandleKeywordChange = useCallback(
    debounce((keyword) => {
      handleFilterChange({ keyword });
    }, 500),
    []
  );

  const handleKeywordChange = (keyword) => {
    setSearchTerm(keyword);
    debouncedHandleKeywordChange(keyword);
  };

  const handleSortChange = (sortBy) => {
    filtersRef.current.sortBy = sortBy;
    setFilters((prev) => ({ ...prev, sortBy }));
    handleFilterChange({ sortBy });
  };

  return (
    <Layout className="search-layout">
      <Layout className="main-layout">
        <div className="header-wrapper">
          <ResultsHeader
            resultsCount={totalProducts}
            keyword={searchTerm}
            onKeywordChange={handleKeywordChange}
            onSortChange={handleSortChange}
            currentSort={filters.sortBy}
          />
        </div>
        <Layout className="content-layout">
          <Sider width={280} className="sider">
            <Filters onFilterChange={handleFilterChange} />
          </Sider>
          <Content className="content">
            {loading ? (
              <div className="loading-spinner">
                <Spin size="large" />
              </div>
            ) : (
              <ProductGrid
                products={products}
                totalProducts={totalProducts}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Search;