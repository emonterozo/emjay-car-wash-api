import axios from 'axios';
import dotenv from 'dotenv';
import { SMS_TYPE } from '../common/constant';

dotenv.config();
export const sendSMS = async (contact_number: string, type: SMS_TYPE, otp: number) => {
  const apiToken = process.env.INFO_BIP_API_TOKEN;
  const message =
    type === SMS_TYPE.VERIFICATION
      ? 'Thank you for registering! Your EmJay AutoSpa & Detailing verification code is:'
      : 'Your password reset verification code is:';

  const raw = JSON.stringify({
    messages: [
      {
        destinations: [{ to: `63${contact_number.substring(1)}` }],
        from: '447491163443',
        text: `${message} ${otp}`,
      },
    ],
  });

  try {
    const response = await axios.post('https://8ky6rd.api.infobip.com/sms/2/text/advanced', raw, {
      headers: {
        Authorization: `App ${apiToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('response', response.data);
    return { success: true };
  } catch (error) {
    console.log('error', error);
    return { success: false };
  }
};
