import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { jwtSign } from '../utils/jwtSign';
import { AddCustomerProps } from '../common/types';
import Customer from '../models/customerModel';
import Otp from '../models/otpModel';
import Promo from '../models/promoModel';

const sizes = [
  {
    size: 'sm',
    count: 0,
  },
  {
    size: 'md',
    count: 0,
  },
  {
    size: 'lg',
    count: 0,
  },
  {
    size: 'xl',
    count: 0,
  },
  {
    size: 'xxl',
    count: 0,
  },
];

dotenv.config();

export const register = async (customer: AddCustomerProps) => {
  // TODO: add validation here

  try {
    const customerData = await Customer.findOne({ contact_number: customer.contact_number });

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (customerData) {
      return {
        success: false,
        status: 400,
        errors: [{ field: 'contact_number', message: 'Contact number already exist' }],
      };
    } else {
      const saltRounds = parseInt(process.env.SALT_ROUND!, 10) || 10;
      const hashedPassword = await bcrypt.hash(customer.password, saltRounds);
      const savedCustomer = await Customer.create({
        ...customer,
        birth_date: new Date(customer.birth_date),
        password: hashedPassword,
        province: null,
        barangay: null,
        address: null,
        registered_on: new Date(),
        is_verified: false,
        points: 0,
        car_wash_service_count: sizes,
        moto_wash_service_count: sizes.slice(0, -1),
      });

      await Otp.create({
        customer_id: savedCustomer._id,
        otp: otp,
      });

      return {
        success: true,
        user: { id: savedCustomer._id.toString(), username: customer.contact_number },
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      errors: [{ field: 'unknown', message: 'An unexpected error occurred' }],
    };
  }
};

export const login = async (username: string, password: string) => {
  try {
    const user = await Customer.findOne({ contact_number: username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        success: false,
        status: 401,
        error: {
          field: 'username or password',
          message: 'Invalid username or password',
        },
      };
    }

    if (user.is_verified) {
      const userData = {
        id: user._id.toString(),
        username: user.contact_number,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
      };

      const { accessToken, refreshToken } = jwtSign(userData);

      return {
        success: true,
        user: userData,
        accessToken,
        refreshToken,
      };
    }

    // If not verified, check for existing OTP
    if (!(await Otp.findOne({ customer_id: user._id }))) {
      await Otp.create({
        customer_id: user._id,
        otp: Math.floor(100000 + Math.random() * 900000),
      });
    }

    return { success: true, user: { id: user._id.toString(), username: user.contact_number } };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const verifyOtp = async (user: string, otp: number) => {
  try {
    const otpData = await Otp.findOne({ customer_id: new mongoose.Types.ObjectId(user) });

    if (!otpData) {
      return {
        success: false,
        status: 410,
        error: { field: 'otp', message: 'Expired OTP' },
      };
    }

    if (otp !== otpData.otp) {
      return {
        success: false,
        status: 401,
        error: { field: 'otp', message: 'Incorrect OTP' },
      };
    }

    // OTP is correct, delete it and return success response
    await Otp.deleteOne({ customer_id: otpData.customer_id });
    const updatedUser = await Customer.findByIdAndUpdate(user, { is_verified: true });

    const userData = {
      id: updatedUser?._id.toString(),
      username: updatedUser?.contact_number,
      first_name: updatedUser?.first_name,
      last_name: updatedUser?.last_name,
      gender: updatedUser?.gender,
    };

    const { accessToken, refreshToken } = jwtSign(userData);

    return {
      success: true,
      user: userData,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const sendOtp = async (user: string) => {
  try {
    const userId = new mongoose.Types.ObjectId(user);

    const userData = await Otp.findOne({ customer_id: userId });

    if (userData) {
      return {
        success: false,
        status: 400,
        error: {
          field: 'user',
          message: 'OTP has already been sent',
        },
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({
      customer_id: userId,
      otp: otp,
    });

    return {
      success: true,
      user: { id: user },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const getCustomerWashPointsById = async (customer_id: string) => {
  try {
    const document = await Customer.findById(customer_id).exec();
    const promos = await Promo.find({ is_active: true });
    const formattedPromos = promos.map((item) => ({
      id: item._id.toString(),
      percent: item.percent,
      title: item.title,
      description: item.description,
      is_free: item.is_free,
    }));

    if (document) {
      return {
        success: true,
        customer: {
          id: document._id.toString(),
          points: document.points,
          car_wash_service_count: document.car_wash_service_count,
          moto_wash_service_count: document.moto_wash_service_count,
        },
        promos: formattedPromos,
      };
    }

    return {
      success: false,
      status: 404,
      error: {
        field: 'customer_id',
        message: 'Customer does not exist',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const forgotPassword = async (username: string) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await Customer.findOne({ contact_number: username });

    if (!user) {
      return {
        success: false,
        status: 404,
        errors: [
          {
            field: 'username',
            message: 'User does not exist',
          },
        ],
      };
    }

    await Otp.create({
      customer_id: user.id,
      otp: otp,
    });

    return {
      success: true,
      user: { id: user._id.toString() },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};

export const forgotPasswordVerifyOtp = async (user: string, otp: number, password: string) => {
  try {
    const otpData = await Otp.findOne({ customer_id: new mongoose.Types.ObjectId(user) });

    if (!otpData) {
      return {
        success: false,
        status: 410,
        error: { field: 'otp', message: 'Expired OTP' },
      };
    }

    if (otp !== otpData.otp) {
      return {
        success: false,
        status: 401,
        error: { field: 'otp', message: 'Incorrect OTP' },
      };
    }

    const saltRounds = parseInt(process.env.SALT_ROUND!, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // OTP is correct, delete it and return success response
    await Otp.deleteOne({ customer_id: otpData.customer_id });
    const updatedUser = await Customer.findByIdAndUpdate(user, {
      password: hashedPassword,
      is_verified: true,
    });

    const userData = {
      id: updatedUser?._id.toString(),
      username: updatedUser?.contact_number,
      first_name: updatedUser?.first_name,
      last_name: updatedUser?.last_name,
      gender: updatedUser?.gender,
    };

    const { accessToken, refreshToken } = jwtSign(userData);

    return {
      success: true,
      user: userData,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      error: {
        field: 'unknown',
        message: 'An unexpected error occurred',
      },
    };
  }
};
