import React, { useContext, useState } from "react";
import { Context } from "../main";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserMd } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const SideBar = () => {
  const [show, setShow] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    // http://localhost:3000/api/v1/user/adminLogout

    await axios
      .post(
        `${baseURL}/api/v1/user/adminLogout`,
        {},
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error("Error logging out", err);
      });
    // window.location.reload();
  };

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const gotoHome = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDocPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoMessages = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoaddNewDoc = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoaddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };

  return (
    <>
      <nav
        className={show ? "show sidebar" : "sidebar"}
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
      >
        <div className="links">
          <TiHome onClick={gotoHome} />
          <FaUserMd onClick={gotoDocPage} />
          <MdAddModerator onClick={gotoaddNewAdmin} />
          <IoPersonAddSharp onClick={gotoaddNewDoc} />
          <AiFillMessage onClick={gotoMessages} />
          <RiLogoutBoxFill onClick={handleLogout} />
        </div>
      </nav>
      <div
        style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        className="wrapper"
      >
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default SideBar;
