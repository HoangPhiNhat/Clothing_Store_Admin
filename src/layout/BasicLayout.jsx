import Header from "../components/common/Header/Header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer/Footer.jsx";
const BasicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default BasicLayout;
