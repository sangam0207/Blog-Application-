import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import UpdatePost from "./pages/UpdatePost.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        {/* Protected Route For Dashboard  Start*/}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* Protected Route For Dashboard End*/}
        {/* Protected Route For Admin Start*/}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost/>}/>
        </Route>
        {/* Protected Route For Admin End*/}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};
export default App;
