import bcrypt from "bcrypt";
import User from "../models/User.js";
import AsyncWrapper from "../utils/asyncWrapper.js";
import ErrorHandler from "../utils/errorHandler.js";
import SuccessMessage from "../utils/SuccessMessage.js";
import { USER_ROLES, USER_STATUS } from "../config/Constants.js";
import { generateTokens, storeTokens } from "../services/JwtService.js";
import { userDTO } from "../services/Dtos.js";






export const addUser = AsyncWrapper(async (req, res, next) => {
  try {
    const { full_name, password, phone, email } = req.body;

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    return SuccessMessage(res, "user created successfully.", newUser);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});


export const registerAdmin = AsyncWrapper(async (req, res, next) => {
  const adminAccount = await User.findOne({
    where: { role: USER_ROLES.admin },
  });
  if (adminAccount) {
    return next(new ErrorHandler("Account cannot be created", 400));
  }

  const password = await bcrypt.hash("Khan@1234", 10);
  const user = await User.create({
    full_name: "Admin Khan",
    email: "admin@gmail.com",
    status: USER_STATUS.active,
    phone: "+923045760623",
    password,
    role: USER_ROLES.admin,
  });

  return SuccessMessage(res, "Account created successfully", user);
});

export const login = AsyncWrapper(async (req, res, next) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ where: { phone } });
  if (!user) {
    return next(new ErrorHandler("Incorrect phone or password", 403));
  }
  if (user.lockUntil && user.lockUntil > new Date()) {
    const unlockTime = user.lockUntil.toLocaleString();
    return next(
      new ErrorHandler(`Account is locked. Try again after: ${unlockTime}`, 400)
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.passwordRetries += 1;

    // Lock account if tries reach 5
    if (user.passwordRetries >= envVariables.maxPasswordAttempts) {
      user.lockUntil = new Date(Date.now() + 10 * 60 * 60 * 1000);
    }

    user.save();
    return next(new ErrorHandler("Incorrect email or password", 422));
  }

  user.passwordRetries = 0;
  user.lockUntil = null;
  await user.save();
  if (user.status === USER_STATUS.blocked) {
    return next(
      new ErrorHandler("Your account has been blocked by admin", 403)
    );
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: user.userId,
    role: user.role,
  });

  await storeTokens(accessToken, refreshToken, user.userId);

  const userData = userDTO(user);
  return SuccessMessage(res, "Logged in successfully", {
    userData,
    accessToken,
    refreshToken,
  });
});

export const socialLogin = AsyncWrapper(async (req, res, next) => {
  const { provider, token, full_name, profile_image } = req.body;

  if (!provider || !token) {
    return next(new ErrorHandler('Provider and token are required', 400));
  }

  let socialUserData;

  // Verify token and get user data from provider
  if (provider === 'google') {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    

    const data = await response.json();
    
    if (!data || !data.email) {
       
  
      return next(new ErrorHandler('Invalid Google token', 400));
    }

    

    socialUserData = {
      email: data.email,
      full_name: data.name,
      profile_image: data.picture,
    };
  } else if (provider === 'apple') {
    const appleUser = await verifyAppleToken(token);
    if (!appleUser) {
      return next(new ErrorHandler('Invalid Apple token', 400));
    }
    socialUserData = {
      email: appleUser.email,
      full_name: appleUser.name || full_name,
      profile_image: profile_image || null,
    };
 
  } else {
   
    return next(new ErrorHandler('Unsupported provider', 400));
  }

  // Find user by email
  let user = await User.findOne({ where: { email: socialUserData.email } });

  // If user doesn't exist, create new user
  if (!user) {
    const saltRounds = 12;
    const randomPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    user = await User.create({
      full_name: socialUserData.full_name,
      email: socialUserData.email,
      phone: null, // Phone is optional for social login users
      password: hashedPassword,
      profile_image: socialUserData.profile_image,
   
      login_provider: provider, // 'google' or 'apple'
      passwordRetries: 0,
      lockUntil: null,
      status: USER_STATUS.active,
      role: USER_ROLES.user,
    });

    // Generate tokens for new user
    const { accessToken, refreshToken } = generateTokens({
      userId: user.userId,
      role: user.role,
    });

    await storeTokens(accessToken, refreshToken, user.userId);

    const userData = userDTO(user);

    return SuccessMessage(res, "Logged in successfully", {
      userData,
      accessToken,
      refreshToken,
    });
  }

  // User exists - check lock status
  if (user.lockUntil && user.lockUntil > new Date()) {
    const unlockTime = user.lockUntil.toLocaleString();
    return next(
      new ErrorHandler(`Account is locked. Try again after: ${unlockTime}`, 400)
    );
  }

  // Reset retries and lock for successful social login
  user.passwordRetries = 0;
  user.lockUntil = null;
  
  // Update profile image if it has changed
  if (socialUserData.profile_image && socialUserData.profile_image !== user.profile_image) {
    user.profile_image = socialUserData.profile_image;
  }
  
  // Update email verification status if not already verified
  if (!user.is_verified_email) {
    user.is_verified_email = true;
  }

  await user.save();

  // Check if user is blocked
  if (user.status === USER_STATUS.blocked) {
    return next(
      new ErrorHandler("Your account has been blocked by admin", 403)
    );
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({
    userId: user.userId,
    role: user.role,
  });

  await storeTokens(accessToken, refreshToken, user.userId);

  const userData = userDTO(user);

  return SuccessMessage(res, "Logged in successfully", {
    userData,
    accessToken,
    refreshToken,
  });
}); 

export const changePassword = AsyncWrapper(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Fetch the currently logged-in user
  const user = await User.findByPk(req.user.userId); // req.user.userId comes from auth middleware
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Verify the current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Incorrect current password", 422));
  }

  // Hash and save the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return SuccessMessage(res, "Password changed successfully");
});


export const getAllUsers = AsyncWrapper(async (req, res, next) => {
  try {
    const users = await User.findAll();
    return SuccessMessage(res, "Users retrieved successfully.", users);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  } 
});

export const getUserById = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    return SuccessMessage(res, "User retrieved successfully.", user);
    } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updateUser = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email } = req.body;  
    const user = await User.findByPk(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    await user.save();
    return SuccessMessage(res, "User updated successfully.", user);
    } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

export const deleteUser = AsyncWrapper(async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await user.destroy();
    return SuccessMessage(res, "User deleted successfully.", null);
  } catch (error) {
    console.error("Error occurred:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});