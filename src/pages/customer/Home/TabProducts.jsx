import React, { useState, useEffect } from "react";
import { fetchNewArrivals, fetchBestSeller } from "../../../services/productService";
import { useNavigate } from "react-router-dom";
import { Card, Image, Badge, Tooltip, Button,Carousel,Tabs } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_PRODUCT_IMAGE_BASE_URL;
const trendingData = [
  {
    id: 4,
    image: "../images/product4.jpg",
    name: "Trending Shoes",
    category: "Shoes",
    price: "$50.00",
    oldPrice: "$75.00",
    discount: "-33%",
  },
];

const mapProductData = (product) => {
  return {
    id: product.productID,
    image: product.imageURL,
    name: product.productName,
    price: product.price,
  };
};

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();
  const imageUrl = `${CLOUDINARY_BASE_URL}${product.image}`;

  const goToDetail = () => {
    navigate(`/product-detail/${product.id}`);
  };

  return (
    <Card
      className="tab-products__card"
      hoverable
      style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        textAlign: "center",
        cursor: "pointer",
        background: "#fff",
        border: "1px solid #f0f0f0",
        marginTop:"10px"
      }}
      onClick={goToDetail}
      bodyStyle={{ padding: 0 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.borderColor = "#1890ff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
        e.currentTarget.style.borderColor = "#f0f0f0";
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
        }}
      >
        <Badge.Ribbon
          text={product.discount}
          color="#ff4d4f"
          style={{ display: product.discount ? "block" : "none" }}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            preview={false}
            loading="lazy"
            width="100%"
            height={200}
            style={{
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-shoe.jpg";
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Badge.Ribbon>

        
      </div>

      {/* Thông tin sản phẩm */}
      <div style={{ padding: "16px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            margin: 0,
            color: "#333",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#fff",
              background: "linear-gradient(90deg, #ff4d4f, #ff7875)",
              padding: "4px 12px",
              borderRadius: 20,
              boxShadow: "0 2px 6px rgba(255, 77, 79, 0.3)",
              marginTop:"10px"
            }}
          >
            {product.price.toLocaleString()} đ
          </span>
        </div>
      </div>
    </Card>
  );
});



// Component TabProducts
const TabProducts = () => {
  const [activeTab, setActiveTab] = useState("bestsellers");
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bestSellerData = await fetchBestSeller();
        const mappedBestSellers = bestSellerData.map(mapProductData);
        setBestsellers(mappedBestSellers);

        const newArrivalsData = await fetchNewArrivals();
        console.log(newArrivalsData)
        const mappedNewArrivals = newArrivalsData.map(mapProductData);
        setNewArrivals(mappedNewArrivals);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabContent = (tabKey) => {
    let products = [];
    if (tabKey === "bestsellers") {
      products = bestsellers;
    } else if (tabKey === "new-arrivals") {
      products = newArrivals;
    } else if (tabKey === "trending") {
      products = trendingData;
    }

    return (
      <Carousel arrows slidesToShow={4} dots={false} style={{ width: "80%", margin: "auto" }} autoplay={false}>
        {products.map((product, index) => (
          <div key={product.id || `fallback-${index}`}>
            <ProductCard product={product} />
          </div>
        ))}

      </Carousel>
    );
  };

  return (
    <Tabs
      defaultActiveKey={activeTab}
      onChange={setActiveTab}
      centered
      className="tab-products__menu"
      destroyInactiveTabPane
      items={[
        { key: "bestsellers", label: "Best Sellers", children: tabContent("bestsellers") },
        { key: "new-arrivals", label: "New Arrivals", children: tabContent("new-arrivals") },
        { key: "trending", label: "Trending", children: tabContent("trending") },
      ]}
    />
  );
};

export default TabProducts;