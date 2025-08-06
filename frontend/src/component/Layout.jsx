import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
