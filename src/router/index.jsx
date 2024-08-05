import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BasicLayout from "../layout/BasicLayout";
import Category from "../pages/Category/page";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import CreateProduct from "../pages/Product/_component/CreateProduct";
import ProductManagePage from "../pages/Product/page";
import TrashCategory from "../pages/Category/_components/TrashCategory";
import Page404 from "../components/base/Result/Page404";

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
            <Route path="products/add" element={<CreateProduct />} />
            <Route path="products/:id/edit" element={<CreateProduct />} />
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
