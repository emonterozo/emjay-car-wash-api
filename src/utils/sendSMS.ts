import axios from 'axios';
import dotenv from 'dotenv';
import { SMS_TYPE } from '../common/constant';
import { logWithContext } from '../logs/logger';

dotenv.config();
export const sendSMS = async (contact_number: string, type: SMS_TYPE, otp: number) => {
  const message =
    type === SMS_TYPE.VERIFICATION
      ? 'Thank you for registering! Your EmJay AutoSpa & Detailing verification code is:'
      : 'Your EmJay AutoSpa & Detailing password reset verification code is:';

  try {
    const response = await axios.post(
      process.env.SMS_GATEWAY_URL!,
      {
        message: `${message} ${otp}`,
        phoneNumbers: [`+63${contact_number.substring(1)}`],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.SMS_GATEWAY_USERNAME!,
          password: process.env.SMS_GATEWAY_PASSWORD!,
        },
      },
    );

    logWithContext({
      level: 'info',
      message: 'Send SMS success',
      file: 'sendSMS',
      data: response.data,
      errors: null,
    });

    return { success: true };
  } catch (error) {
    logWithContext({
      level: 'info',
      message: 'Send SMS failure',
      file: 'sendSMS',
      data: { contact_number, type, otp },
      errors: error,
    });
    return { success: false };
  }
};
