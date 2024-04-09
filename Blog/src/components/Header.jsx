import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import {toggleTheme} from '../../redux/theme/themeSlice.js'
import { useDispatch} from "react-redux";
import {signOutProfileSuccess} from '../../redux/user/userSlice.js'
import axios from "axios";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const {theme}=useSelector((state)=>state.theme)
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const path = useLocation().pathname;
  console.log(path)

  const handleSignOut = async () => {
    try {
      const response = await axios.get(`/api/user/signOut/${currentUser._id}`);
      console.log(response)
      if (response.data.success === false) {
        console.log("Internal Server Error");
      }
      if(response.statusText){
        await dispatch(signOutProfileSuccess());
        navigate("/sign-in");
      }
      
    
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Navbar className="border-b-2 shadow-lg ">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className=" text-white px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl ">
          Sangam
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={()=>dispatch(toggleTheme(theme))}>
         {theme==='light'?<FaMoon />:<FaSun/>} 
        </Button>  
        {currentUser ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header className="flex flex-col gap-1 font-bold">
                <span>@{currentUser.username}</span>
                <span>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>

              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Link to="/sign-in">
            <Button className="" pill gradientDuoTone="purpleToBlue">
              Sign-In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
