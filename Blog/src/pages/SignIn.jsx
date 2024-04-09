import { useState } from "react";
import { Alert, Button, Label, TextInput, Spinner } from "flowbite-react";
import { Link,useNavigate } from "react-router-dom";
import {signInFailed,signInStart,signInSuccess} from '../../redux/user/userSlice.js'
import { useDispatch, useSelector } from "react-redux";
import OAuth from '../components/Oauth.jsx'
//import axios from "axios";
const SignIn = () => {

  const dispatch=useDispatch()
  const navigate=useNavigate();

  const{loading,error:errorMessage}=useSelector(state=>state.user);

  const [formData, setFormData] = useState({});
  
  // const [loading, setLoading] = useState(false);
  // const [errorMesage, setErrorMessage] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
 // console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !formData.email || !formData.password) {
      return dispatch(signInFailed('All Fields Are Required !!'))
    }
    try {
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart)
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
     // const res = await axios.post('/api/auth/signin', formData);
      console.log(res)
       //const data = res.data;
       const data = await res.json();
      if (data.success === false) { 
        //return setErrorMessage(data.message);
        dispatch(signInFailed(data.message))
      }
     // setLoading(false);
      if(res.ok) {
        console.log(data);
      dispatch(signInSuccess(data));

      navigate('/')
      }
    } catch (error) {
      // setErrorMessage(error.message);
      // setLoading(false);
      dispatch(signInFailed(error.message))
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Sangam
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />

                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "SignIn"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>new User?</span>
            <Link to="/sign-up" className="text-blue-500">
             Register
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
