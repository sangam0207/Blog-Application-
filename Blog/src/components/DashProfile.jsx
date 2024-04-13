import { Alert, Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase.js";
import axios from "axios";
import {
  updateSuccess,
  deleteProfileSuccess,
  signOutProfileSuccess,
} from "../../redux/user/userSlice.js";
import { useNavigate,Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadTracValue, setUploadTracValue] = useState(0);
  const [formData, setFormData] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const[updateProfileSuccess,setUpdateProfileSuccess]=useState(false)
  const [showMore,setShowMore]=useState(true);
  const fileOpenRef = useRef();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const upLoadImage = async () => {
    console.log("Uploading Image.............");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadTracValue(Math.round(progress));
      },
      (error) => {
        console.error("File upload error:", error);
        setImageUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => setImageFileUrl(downloadURL))
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setImageUploadError(error.message);
          });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      upLoadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //console.log(formData);
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    let updatesData;

    if (imageFile) {
      updatesData = { ...formData, profilePicture: imageFileUrl };
    } else {
      updatesData = formData;
    }
    if (updatesData) {
      try {
        const res = await axios.put(
          `/api/user/updateProfile/${currentUser._id}`,
          updatesData
        );
        // console.log(res)
        if(res.data.success===false){
          console.log('Internal server error ')
        }

        if(res.statusText){
          await dispatch(updateSuccess(res.data.user));
 
          setUpdateProfileSuccess(true);
        }
      
       

      } catch (error) {
        console.log("error :", error.message);
      }
    }
    console.log("All user Updates fields Result are here", updatesData);
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(
        `/api/user/deleteProfile/${currentUser._id}`
      );
      //console.log(response);
      const data = response.data;
      if (data.success === false) {
        console.log("Internal server Error");
      }
      await dispatch(deleteProfileSuccess());
      navigate("/sign-in");
    } catch (error) {
      console.log("Error", error);
    }
  };
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
    <div className="p-3 max-w-lg mx-auto w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        <input
          hidden
          ref={fileOpenRef}
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => fileOpenRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        {uploadTracValue === 0 ? null : uploadTracValue > 0 &&
          uploadTracValue < 100 ? (
          <p className="text-blue-500 text-center">
            Uploaded {uploadTracValue}%
          </p>
        ) : (
          <Alert className="mt-2 text-center" color="success">
            Uploaded Successfully
          </Alert>
        )}

        {imageUploadError && (
          <Alert className="mt-5" color="failure">
            {imageUploadError}
          </Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        {updateProfileSuccess &&   <Alert className="mt-2 text-center" color="success">
           Profile Uploaded Successfully
          </Alert>}
       
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          UPDATE
        </Button>
        
      </form>
      <div className=" flex justify-between text-red-500 mt-5 ">
        <span className="cursor-pointer" onClick={handleDeleteProfile}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
        
      </div>
      <div className="flex justify-center">
        <Link to="/create-post">
        <div>
        {currentUser.isAdmin && <Button type="button" className="mt-1" gradientDuoTone="purpleToBlue"  >Create a Post</Button>}
        </div>
        </Link>
        
   
      </div>
     
    </div>
  );
};

export default DashProfile;
