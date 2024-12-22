import { commonMsg, userMsg } from "../constant/index.js";
import { User } from "../models/user.model.js";

/* user registration */
export const adminRegistration = async (req, res) => {
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
export const adminLogin = async (req, res) => {
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
