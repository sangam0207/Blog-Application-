import React from "react";
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { useLocation } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutProfileSuccess } from "../../redux/user/userSlice.js";
import axios from "axios";
const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  //console.log(location);
  useEffect(() => {
    //console.log(location.search);

    const urlParams = new URLSearchParams(location.search);
    //console.log(urlParams)
    const tabFromUrl = urlParams.get("tab");
    //console.log(tabFromUrl)
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  //console.log(tab)
  const handleSignOut = async () => {
    try {
      const response = await axios.get(`/api/user/signOut/${currentUser._id}`);
      if (response.data.success === false) {
        console.log("Internal Server Error");
      }
      await dispatch(signOutProfileSuccess());
      navigate("/sign-in");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div>
      <Sidebar className="w-full md:w-60 md:h-screen border">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                label={currentUser.isAdmin?"Admin":"User"}
                labelColor="dark"
                icon={HiUser}
                className="cursor-pointer"
              >
                Profile
              </Sidebar.Item>
            </Link>

            <Sidebar.Item
              active={tab === "signout"}
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </Sidebar.Item>
            {currentUser.isAdmin && 
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
               
                labelColor="dark"
                icon={HiTable}
                className="cursor-pointer"
              >
                Posts
              </Sidebar.Item>
            </Link>}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default DashSidebar;
