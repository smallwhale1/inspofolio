import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Props = {};

const Layout = (props: Props) => {
  return (
    <div>
      <Topbar />
      <Sidebar />
    </div>
  );
};

export default Layout;
