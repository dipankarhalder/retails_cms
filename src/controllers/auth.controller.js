import { commonMsg, userMsg } from "../constant/index.js";
import { User } from "../models/user.model.js";

/* user registration */
const userRegistration = async (req, res) => {
  try {
    /* get user info from request body */
    const { email, password, firstname, lastname, phone, role } = req.body;

    /* validate all fields empty or not */
    if (!email || !password || !firstname || !lastname || !phone || !role) {
      return res.status(400).json({
        status: 400,
        msg: commonMsg.blank_field,
      });
    }

    /* validate the existing user email */
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: 400,
        msg: userMsg.email_valid,
      });
    }

    /* validate the existing user phone */
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        status: 400,
        msg: userMsg.phone_valid,
      });
    }

    /* save the user to the database */
    const user = new User({
      email,
      password,
      firstname,
      lastname,
      phone,
      role,
    });
    await user.save();
    return res
      .status(200)
      .json({ status: 200, msg: userMsg.new_created })
      .end();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: commonMsg.something_wrong,
      error: error.message,
    });
  }
};

/* user login */
const userLogin = async (req, res) => {
  try {
    /* get user info from request body */
    const { email, password } = req.body;

    /* validate all fields empty or not */
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        msg: commonMsg.blank_field,
      });
    }

    /* validate the user email */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 400,
        msg: userMsg.exist_email,
      });
    }

    /* validate / compare the user password */
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        msg: userMsg.wrong_password,
      });
    }

    /* Generate JWT after successful login */
    const token = user.generateAuthToken();
    return res
      .status(200)
      .json({
        status: 200,
        token: token,
        msg: userMsg.login_successfully,
      })
      .end();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: commonMsg.something_wrong,
      error: error.message,
    });
  }
};

/* user profile */
const userProfile = async (req, res) => {
  try {
    /* get user info from request body */
    const { role, profileId } = req.params;

    /* validate the user */
    if (role !== "super_admin" && role !== "admin" && role !== "staff") {
      return res.status(400).json({
        status: 400,
        msg: userMsg.not_user_access,
      });
    }

    /* find the user and create the new obj */
    const userProfile = await User.findById(profileId);
    const profileInfo = {
      id: userProfile._id,
      role: userProfile.role,
      email: userProfile.email,
      fullname: `${userProfile.firstname} ${userProfile.lastname}`,
      firstname: userProfile.firstname,
      lastname: userProfile.lastname,
      phone: userProfile.phone,
    };

    return res
      .status(200)
      .json({
        status: 200,
        data: profileInfo,
        msg: `${userProfile.firstname} ${userProfile.lastname} logged-in as a ${userProfile.role}`,
      })
      .end();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: commonMsg.something_wrong,
      error: error.message,
    });
  }
};

/* update user profile */
const updateProfile = async (req, res) => {
  try {
    /* get user info from request body */
    const { profileId } = req.params;

    /* find and update the package */
    const updatedPackage = await User.findByIdAndUpdate(profileId, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({
        status: 200,
        data: updatedPackage,
        msg: userMsg.update_success,
      })
      .end();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: commonMsg.something_wrong,
      error: error.message,
    });
  }
};

/* update user password */
const updatePassword = async (req, res) => {
  try {
    /* get user info from request body */
    const { profileId } = req.params;
    const { oldPassword, newPassword } = req.body;

    /* validate input fields */
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        msg: commonMsg.blank_field,
      });
    }

    /* find user by email */
    const user = await User.findById(profileId);
    if (!user) {
      return res.status(400).json({
        status: 400,
        msg: userMsg.not_found_user,
      });
    }

    /* check if the old password matches */
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        msg: userMsg.wrong_password,
      });
    }

    /* update password */
    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({
        status: 200,
        msg: userMsg.update_password,
      })
      .end();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: commonMsg.something_wrong,
      error: error.message,
    });
  }
};

export const userAuthentication = {
  userRegistration,
  userLogin,
  userProfile,
  updateProfile,
  updatePassword,
};
