import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/customer/Home";
import Account from "../pages/customer/Account";
import Cart from "../pages/customer/Cart";
import OrderSuccess from "../pages/customer/Order";
import Checkout from "../pages/customer/Checkout";
import Search from "../pages/customer/Search";
import Error from "../pages/error";
import PaymentResult from "../pages/customer/Payment";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ProductDetail from "../pages/customer/ProductDetail";
import PrivateRoute from "../components/PrivateRoutes";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ProductManager from "../pages/admin/Product";
import OrderManager from "../pages/admin/Order";
import OrderDetail from "../pages/admin/Order/OrderDetail";
import ShipmentManager from "../pages/admin/Shipment";
import PromotionManager from "../pages/admin/Promotion";
import PromotionForm from "../pages/admin/Promotion/PromotionForm";
import PromotionDetail from "../pages/admin/Promotion/PromotionDetail";
import PromotionAnalytics from "../pages/admin/Promotion/PromotionAnalytics";
import CouponGenerator from "../pages/admin/Promotion/CouponGenerator";
import MarketingIntegration from "../pages/admin/Promotion/MarketingIntegration";
import CustomerManager from "../pages/admin/Customer";
import CustomerDetail from "../pages/admin/Customer/CustomerDetails";
export const routes = [
  {
    path: "/",
    element: <CustomerLayout />,
    breadcrumb: "Home",
    children: [
      { path: "/", element: <Home />, breadcrumb: "Home" },
      { path: "search", element: <Search />, breadcrumb: "Search" },
      { path: "product-detail/:productID", element: <ProductDetail />, breadcrumb: "ProductDetail" },
      { path: "cart", element: <Cart />, breadcrumb: "Cart" },
      { path: "payment", element: <PaymentResult />, breadcrumb: "Payment" },
      { path: "order", element: <OrderSuccess />, breadcrumb: "Order" },
      {
        path: "checkout",
        element: (
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
        ),
        breadcrumb: "Checkout",
      },
      {
        path: "account",
        element: (
            <PrivateRoute>
              <Account />
            </PrivateRoute>
        ),
        breadcrumb: "Account",
      },
    ],
  },
  { path: "*", element: <Error />, breadcrumb: "Not Found" },
  { path: "/login", element: <Login /> },
  { path: "/sign-up", element: <SignUp /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <ProductManager />,
      },
      {
        path: "orders",
        element: <OrderManager />,
        children: [
          {
            path: ":id",
            element: <OrderDetail />,
          },
        ],
      },
      {
        path: "shipment",
        element: <ShipmentManager />,
      },
      {
        path: "promotions",
        element: <PromotionManager />,
      },
      {
        path: "promotions/create",
        element: <PromotionForm />,
      },
      {
        path: "promotions/:id",
        element: <PromotionDetail />,
      },
      {
        path: "promotions/:id/edit",
        element: <PromotionForm />,
      },
      {
        path: "promotions/analytics",
        element: <PromotionAnalytics />,
      },
      {
        path: "promotions/coupons",
        element: <CouponGenerator />,
      },
      {
        path: "promotions/marketing",
        element: <MarketingIntegration />,
      },
      {
        path: "customers",
        element: <CustomerManager />,
        children: [
          {
            path: ":id",
            element: <CustomerDetail />,
          },
        ],
      },
    ],
  }
]
  





