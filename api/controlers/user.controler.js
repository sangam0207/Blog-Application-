import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "This is for thesting Purpose" });
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Please Provide an id to Update the User Profile",
      });
  }
  if (req.user.id !== id) {
    return res
      .status(400)
      .send({ success: false, message: "You Can Update Only Your Profile" });
  }
  try {
    const CurrentUser = User.findById(id);
    if (!CurrentUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not Found" });
    }
    const data = await User.findByIdAndUpdate(id, req.body, { new: true });
    res
      .status(200)
      .send({
        success: true,
        message: "User Updated Successfully",
        user: data,
      });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Please Provide an id to delete The User Account",
      });
  }
  if (req.user.id !== id) {
    return res
      .status(400)
      .send({ success: false, message: "You Can Delete Only Your Profile" });
  }
  try {
    const currentUser = User.findById(id);
    if (!currentUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not Found" });
    }

    await User.findByIdAndDelete(id);
    res
      .status(200)
      .clearCookie("access_token")
      .send({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};

export const SignOut = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .send({
        success: false,
        message: "Please Provide an id to delete The User Account",
      });
  }
  if (req.user.id !== id) {
    return res
      .status(400)
      .send({ success: false, message: "You Can SignOut Only Your Profile" });
  }

  res
    .status(200)
    .clearCookie("access_token")
    .send({ success: true, message: "SignOut Successfully" });
};

// Add later ForgetPassword Functionality // 
// export const forgetPassword=(req,res)=>{

// }
