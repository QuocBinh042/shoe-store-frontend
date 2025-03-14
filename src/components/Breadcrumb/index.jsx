import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation, matchRoutes } from "react-router-dom";
import { routes } from "../../router/router";

function CustomBreadcrumb() {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routes, location.pathname) || [];

  if (location.pathname === "/") {
    return null; // Không hiển thị Breadcrumb trên trang chủ
  }

  // Chuyển đổi `matchedRoutes` thành các đường dẫn đầy đủ
  const breadcrumbItems = matchedRoutes
    .filter((route) => route.route.breadcrumb) // Chỉ xử lý các route có breadcrumb
    .map((route, index) => {
      const isLast = index === matchedRoutes.length - 1;

      // Tạo đường dẫn đầy đủ dựa trên các đoạn path trước đó
      const fullPath = matchedRoutes
        .slice(0, index + 1) // Lấy các route từ đầu tới index hiện tại
        .map((r) => r.route.path) // Lấy path từ mỗi route
        .join("/") // Nối lại thành một đường dẫn đầy đủ
        .replace(/\/+/g, "/"); // Loại bỏ các dấu '/' dư thừa

      return {
        key: route.route.path || index,
        title: isLast ? (
          <span>{route.route.breadcrumb}</span> // Nếu là phần tử cuối, không cần Link
        ) : (
          <Link to={fullPath}>{route.route.breadcrumb}</Link> // Tạo Link cho các phần tử trước đó
        ),
      };
    });


  return <Breadcrumb items={breadcrumbItems} />;
}

export default CustomBreadcrumb;
