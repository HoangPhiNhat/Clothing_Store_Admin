/* eslint-disable react/prop-types */
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "../pages/Home/Home";
import BasicLayout from "../layout/BasicLayout";

import SignUp from "../pages/Auth/Signup";
import SignIn from "../pages/Auth/Signin";

import TrashCategory from "../pages/Category/_components/TrashCategory";
import Category from "../pages/Category/page";

import CreateProduct from "../pages/Product/_component/CreateProduct";
import UpdateProduct from "../pages/Product/_component/UpdateProduct";
import ProductManagePage from "../pages/Product/page";
import TrashProduct from "../pages/Product/_component/TrashProduct";
import Order from "../pages/Order/Page";
import OrderDetail from "../pages/Order/_components/OrderDetail";
import ProductAttribute from "../pages/Attribute/page";

import Page401 from "../components/base/Result/Page401";
import Page404 from "../components/base/Result/Page404";
import Page500 from "../components/base/Result/Page500";

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
          <Route path="/page500" element={<Page500/>}/>
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

            {/* Category */}
            <Route path="categories" element={<Category />} />
            <Route path="categories/trash" element={<TrashCategory />} />

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

            {/* Order */}
            <Route path="orders" element={<Order />} />
            <Route path="orders/:id" element={<OrderDetail />} />

            <Route path="*" element={<Page404 />} />
          </Route>

          {/* Auth */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
