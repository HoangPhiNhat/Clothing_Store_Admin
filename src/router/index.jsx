import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import BasicLayout from "../layout/BasicLayout";
import NotFound from "../pages/NotFound/NotFound";
import Category from "../pages/Category/page";
import ProductManagePage from "../pages/Product/page";
import CreateProduct from "../pages/Product/_component/CreateProduct";

const RouterComponent = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/admin" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Category />} />
            <Route path="products" element={<ProductManagePage />} />
            <Route path="products/add" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<CreateProduct />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
