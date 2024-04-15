import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  //console.log(posts);
  const fetchPost = async () => {
    try {
      const userId = currentUser._id;
    //  console.log(typeof userId);
    //  console.log(userId);
      const response = await axios.get(`/api/posts/getPosts?userId=${userId}`);
     // console.log(response.data);
      //  console.log(response);
      if (response.statusText) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchPost();
      if (posts.length < 9) {
        setShowMore(false);
      }
    }
  }, [posts]);

  const handleDeletePost = async (id) => {
    try {
      const response = await axios.delete(`/api/posts/deletePost/${id}`);
      // console.log(response.data);
      if (response.statusText) {
        const newPosts = posts.filter((post) => {
          return post._id !== id;
        });
        setPosts(newPosts);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleShowMore = async () => {
    try {
      const userId = currentUser._id;
      const response = await axios.get(
        `/api/posts/getPosts?userId=${userId}&startIndex=${posts.length}`
      );
      // console.log(response)
      if (response.data.posts.length < 9) {
        setShowMore(false);
      }
      setPosts((prev) => [...prev, ...response.data.posts]);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      {currentUser.isAdmin === true ? (
        <div className="overflow-x-auto ml-0 mt-8 md:ml-4 md:mt-0 w-full  ">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y text-black dark:text-white">
              {posts.map((post) => {
                return (
                  <>
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={post._id}
                    >
                      <Table.Cell>
                        {new Date(post.updatedAt)
                          .toISOString()
                          .substring(0, 10)}
                      </Table.Cell>
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-10 w-28"
                        />
                      </Table.Cell>
                      <Table.Cell>{post.title}</Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <Link
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                          to={`/update-post/${post._id}`}
                        >
                          Edit
                        </Link>
                      </Table.Cell>
                      <Table.Cell
                        className="text-red-700 font-medium dark:text-red-500 cursor-pointer"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </Table.Cell>
                    </Table.Row>
                  </>
                );
              })}
            </Table.Body>
          </Table>
          <div className="flex justify-center my-6 ">
            {showMore && (
              <button
                onClick={handleShowMore}
                className="text-blue-700 hover:text-green-700"
              >
                Show More
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="ml-4  w-full text-center">
          <h1 className="my-12">You are not an Admin</h1>
        </div>
      )}
    </>
  );
};

export default DashPosts;
