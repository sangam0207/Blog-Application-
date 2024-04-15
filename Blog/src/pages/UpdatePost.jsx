import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import { useState,useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import axios from "axios";

const UpdatePost = () => {
  const [formData, setFormData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadTracValue, setUploadTracValue] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [currentPost,setCurrentPost]=useState(null);
  const upLoadImage = async () => {
    console.log("Uploading Image.............");
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
   
useEffect(()=>{
const fetchPreviousPost=async()=>{
try {
  const response=await axios.get(`api/posts/${}`)
} catch (error) {
  console.log(error.message)
  alert(error.message)
}
}
fetchPreviousPost();
},[])



    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadTracValue(Math.round(progress));
      },
      (error) => {
        console.error("File upload error:", error);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => setImageFileUrl(downloadURL))
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      }
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formData, image: imageFileUrl });
    try {
      const res = await axios.post("/api/posts/create", {
        ...formData,
        image: imageFileUrl,
      });
      console.log(res.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={upLoadImage}
          >
            Upload Image
          </Button>
        </div>
        {uploadTracValue && uploadTracValue > 0 && uploadTracValue < 100 ? (
          <p className="text-center text-blue-500">
            {" "}
            Uploading.......{uploadTracValue}%{" "}
          </p>
        ) : uploadTracValue === 100 ? (
          <p className="text-center text-green-600">
            {" "}
            Image uploaded Successfully{" "}
          </p>
        ) : null}
        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt="Uploaded Image "
            className="h-96 object-contain object-center "
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
