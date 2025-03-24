import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Spin } from 'antd';
import Filters from './Filters';
import ProductGrid from './ProductGrid';
import "./Search.scss";
import { Header } from 'antd/es/layout/layout';
import ResultsHeader from './ResultHeader';
import { fetchAllProducts, fetchFilteredProducts } from '../../../services/searchService';
import { debounce } from 'lodash';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filtersRef = useRef(filters);

  useEffect(() => {
    loadAllProducts(currentPage);
  }, [currentPage]);

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
        keyword: newFilters.keyword ?? filtersRef.current.keyword
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
    <Layout>
      <Layout style={{ padding: '20px 100px' }}>
        <Header style={{ padding: 0, marginBottom: 10 }}>
          <ResultsHeader
            resultsCount={totalProducts}
            keyword={searchTerm} 
            onKeywordChange={handleKeywordChange}
            onSortChange={handleSortChange}
            currentSort={filters.sortBy}
          />
        </Header>
        <Layout>
          <Sider width={280} className='sider'>
            <Filters onFilterChange={handleFilterChange} />
          </Sider>
          <Content style={{ padding: 0, marginTop: 10 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
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
