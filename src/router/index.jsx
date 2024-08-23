import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BasicLayout from "../layout/BasicLayout";
import ProductAttribute from "../pages/Attribute/page";
import Signin from "../pages/Auth/Signin";
import Signup from "../pages/Auth/Signup";
import TrashCategory from "../pages/Category/_components/TrashCategory";
import Category from "../pages/Category/page";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import CreateProduct from "../pages/Product/_component/CreateProduct";
import UpdateProduct from "../pages/Product/_component/UpdateProduct";
import ProductManagePage from "../pages/Product/page";

const RouterComponent = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<NotFound />} />
          <Route path="/admin" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Category />} />
            <Route path="categories/trash" element={<TrashCategory />} />
            <Route path="products" element={<ProductManagePage />} />
            <Route
              path="products/:id/attributes"
              element={<ProductAttribute />}
            />
            <Route path="products/add" element={<CreateProduct />} />

            <Route path="products/:id/edit" element={<UpdateProduct />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
