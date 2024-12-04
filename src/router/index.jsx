/* eslint-disable react/prop-types */
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import BasicLayout from "../layout/BasicLayout";
import Home from "../pages/Home/Home";

import SignIn from "../pages/Auth/Signin";
import SignUp from "../pages/Auth/Signup";

import Statistical from "../pages/Statistical/page";

import TrashCategory from "../pages/Category/_components/TrashCategory";
import Category from "../pages/Category/page";

// import Classification from "../pages/Classification/page";

import ProductAttribute from "../pages/Attribute/page";
import CreateProduct from "../pages/Product/_component/CreateProduct";
import TrashProduct from "../pages/Product/_component/TrashProduct";
import UpdateProduct from "../pages/Product/_component/UpdateProduct";
import ProductManagePage from "../pages/Product/page";

import Variant from "../pages/Variant/page";

import OrderDetail from "../pages/Order/_components/OrderDetail";
import Order from "../pages/Order/page";

import Page401 from "../components/base/Result/Page401";
import Page403 from "../components/base/Result/Page403";
import Page404 from "../components/base/Result/Page404";
import Page500 from "../components/base/Result/Page500";

import CourierProfile from "../pages/Courier/_components/CourierProfile";
import Courier from "../pages/Courier/page";

import AddProductToDiscount from "../pages/Discount/_components/AddProductToDiscount";
import DiscountDetail from "../pages/Discount/_components/DiscountDetail";
import Discounts from "../pages/Discount/page";

import ShipperLayout from "../layout/ShipperLayout";
import ShipperOrderDelivery from "../pages/Shipper/ShipperOrderDelivery";
import ShipperOrderHistory from "../pages/Shipper/ShipperOrderHistory";
import ShipperOrderPending from "../pages/Shipper/ShipperOrderPending";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("access") !== null;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

const RouterComponent = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Page401 />} />
          <Route path="/page500" element={<Page500 />} />
          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <BasicLayout />
              </PrivateRoute>
            }
          >
            {/* Index */}
            <Route index element={<Home />} />

            {/* Statistical */}
            <Route path="statistical" element={<Statistical />} />

            {/* Category */}
            <Route path="categories" element={<Category />} />
            <Route path="categories/trash" element={<TrashCategory />} />
            {/* Classification */}
            {/* <Route path="categories/:id" element={<Classification />} /> */}
            {/* Product */}
            <Route path="products" element={<ProductManagePage />} />
            <Route path="products/add" element={<CreateProduct />} />
            <Route path="products/trash" element={<TrashProduct />} />
            <Route path="products/:id/edit" element={<UpdateProduct />} />
            {/* Product att */}
            <Route
              path="products/:id/attributes"
              element={<ProductAttribute />}
            />
            {/* Product variant */}
            <Route path="products/variant" element={<Variant />} />
            {/* Order */}
            <Route path="orders" element={<Order />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            {/* Page error */}
            <Route path="*" element={<Page404 />} />
            <Route path="page403" element={<Page403 />} />
            <Route path="page500" element={<Page500 />} />
            {/* Courier */}
            <Route path="couriers" element={<Courier />} />
            <Route path="couriers/:id" element={<CourierProfile />} />

            {/* Discount */}
            <Route path="discounts" element={<Discounts />} />
            <Route path="discounts/:id" element={<DiscountDetail />} />
            <Route
              path="discounts/:id/addProduct"
              element={<AddProductToDiscount />}
            />
          </Route>

          {/* Shipper */}
          <Route
            path="/shipper"
            element={
              <PrivateRoute>
                <ShipperLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="shipping" element={<ShipperOrderDelivery />} />
            <Route path="shippending" element={<ShipperOrderPending />} />
            <Route path="history" element={<ShipperOrderHistory />} />
          </Route>

          {/* Auth */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Page error */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
