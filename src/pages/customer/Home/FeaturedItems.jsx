import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, List} from "antd";
import React from "react";
const featuredItems = [
  {
    id: 1,
    image: "../images/shoe1.png",
    alt: "Running Shoes",
    category: "Men - On | Swiss Performance",
    name: "Running Shoes",
    oldPrice: "$90.00",
    discountPrice: "$65.00",
  },
  {
    id: 2,
    image: "../images/shoe2.png",
    alt: "Tennis Shoes",
    category: "Asics Gel-Resolution",
    name: "Tennis Shoes",
    oldPrice: "$130.00",
    discountPrice: "$95.00",
  },
  {
    id: 3,
    image: "../images/shoe3.png",
    alt: "Running Shoes",
    category: "Men - On | Swiss Performance",
    name: "Running Shoes",
    oldPrice: "$70.00",
    discountPrice: "$56.00",
  },
];

const FeaturedItems = () => {
  return (
    <List
      style={{ padding: '30px 100px' }}
      grid={{ gutter: 50, column: 3, }}
      dataSource={featuredItems}
      renderItem={(item) => (
        <List.Item >
          <Card className="featured-items__item">
              <img
                src={item.image} alt={item.alt}
                className="featured-items__image"
              />
              <h5 className="featured-items__category">{item.category}</h5>
              <h3 className="featured-items__name">{item.name}</h3>
              <p className="featured-items__price">
                <s>{item.oldPrice}</s>
                <span className={`featured-items__price--discount`}> {item.discountPrice}</span>
              </p>
              <Button className="featured-items__link" href="#">
                Shop Now <ArrowRightOutlined />
              </Button>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default FeaturedItems;
