import Post from "../models/post.model.js";

export const test = (req, res) => {
  res.send("This is for testing of the Post Routes");
};

export const getPostById=async(req,res)=>{
  try {
    const {id}=req.params;
    const postData=await Post.findById(id);
    //console.log(post)
    if(!postData){
      return res.send({success:false,message:"Post not Found"});
    }
      res.status(200).send({success:true,post:postData})
  } catch (error) {
    res.status(500).send({success:false,message:error.message})
  }
}

export const createPost = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send({ success: false, message: "You are not allowed to create Post" });
  }

  if (!req.body.title || !req.body.content) {
    return res
      .status(500)
      .send({ success: false, message: "Please Provide all required fields" });
  }

  const userId = req.user.id;
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  const newPost = new Post({
    ...req.body,
    userId,
    slug,
  });
  await newPost.save();
  res.status(201).send({
    success: true,
    post: newPost,
  });
};

export const getPosts = async (req, res) => {
  console.log(req.query.userId)
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    console.log(req.query.userId)
    const searchCriteria = {};
    if (req.query.userId) searchCriteria.userId =req.query.userId;
    console.log(typeof req.query.userId);
    if (req.query.category) searchCriteria.category = req.query.category;
    if (req.query.slug) searchCriteria.slug = req.query.slug;
    if (req.query.searchTerm) {
      searchCriteria.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }

    // Fetching posts from the database
    const posts = await Post.find(searchCriteria)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Counting total posts and posts from the last month
    const totalPosts = await Post.countDocuments();
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // Sending the response
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};




// update post
export const updatePosts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .send({
          success: false,
          message: "Please give an id for the post you want to update",
        });
    }
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "This post not found" });
    }
    const newPostData = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!newPostData) {
      return res
        .status(500)
        .send({ success: false, message: "error in the update this post" });
    }
    res
      .status(200)
      .send({
        success: false,
        message: "Post updated successfully",
        post: newPostData,
      });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(404)
        .send({ success: false, message: "id is not found" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "This post is not found" });
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res
        .status(500)
        .send({ success: false, message: "Failed to delete this post" });
    }
    res
      .status(200)
      .send({ success: true, message: "Post is deleted successfully" });
  } catch (error) {
    console.log("error", error.message);
  }
};
