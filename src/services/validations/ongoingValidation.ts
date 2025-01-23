import mongoose from 'mongoose';
import { OngoingTransactionProps, TransactionServiceProps } from '../../common/types';
import {
  SERVICE_CHARGE,
  VALID_SERVICE_CHARGES,
  VALID_VEHICLE_TYPES,
  VALID_VEHICLE_SIZES,
  VEHICLE_TYPE,
  VEHICLE_SIZE_CAR,
  VEHICLE_SIZE_MOTORCYCLE,
  CONTACT_NUMBER_REGEX,
} from '../../common/constant';

type ValidateOngoingTransactionProps =
  | {
      type: 'Transaction';
      payload: OngoingTransactionProps;
    }
  | {
      type: 'Transaction Service';
      payload: TransactionServiceProps;
    };

export const validateOngoingTransaction = ({ type, payload }: ValidateOngoingTransactionProps) => {
  const validationErrors: { field: string; message: string }[] = [];

  let fields = [
    {
      field: 'service_id',
      value: payload.service_id,
      message: 'Service id is required',
      maxLength: 24,
    },
    {
      field: 'price',
      value: payload.price,
      message: 'Price is required',
      maxLength: 10,
    },
    {
      field: 'service_charge',
      value: payload.service_charge,
      message: 'Service charge is required',
      maxLength: 10,
    },
  ];

  if (type === 'Transaction') {
    fields = [
      ...fields,
      {
        field: 'vehicle_type',
        value: payload.vehicle_type,
        message: 'Vehicle type is required',
        maxLength: 10,
      },
      {
        field: 'vehicle_size',
        value: payload.vehicle_size,
        message: 'Vehicle size is required',
        maxLength: 3,
      },
      {
        field: 'model',
        value: payload.model,
        message: 'Model is required',
        maxLength: 64,
      },
      {
        field: 'plate_number',
        value: payload.plate_number,
        message: 'Plate number is required',
        maxLength: 15,
      },
    ];
  }

  fields.forEach(({ field, value, message, maxLength }) => {
    if (value) {
      if (value.length > maxLength) {
        validationErrors.push({
          field,
          message: `${field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)} cannot exceed ${maxLength} characters`,
        });
      }
    } else {
      validationErrors.push({ field, message });
    }
  });

  switch (type) {
    case 'Transaction':
      if (payload.customer_id && !mongoose.Types.ObjectId.isValid(payload.customer_id)) {
        validationErrors.push({
          field: 'customer_id',
          message: 'Customer id must be a 24-character hexadecimal string',
        });
      }

      if (!VALID_VEHICLE_TYPES.includes(payload.vehicle_type as VEHICLE_TYPE)) {
        validationErrors.push({
          field: 'vehicle_type',
          message: `Vehicle type must be one of ${VALID_VEHICLE_TYPES.join(', ')}`,
        });
      }

      if (
        payload.vehicle_type === 'car' &&
        !VALID_VEHICLE_SIZES['car'].includes(payload.vehicle_size as VEHICLE_SIZE_CAR)
      ) {
        validationErrors.push({
          field: 'vehicle_size',
          message: `Vehicle size car must be one of ${VALID_VEHICLE_SIZES['car'].join(', ')}`,
        });
      }

      if (
        payload.vehicle_type === 'motorcycle' &&
        !VALID_VEHICLE_SIZES['motorcycle'].includes(payload.vehicle_size as VEHICLE_SIZE_MOTORCYCLE)
      ) {
        validationErrors.push({
          field: 'vehicle_size',
          message: `Vehicle size for motorcycle must be one of ${VALID_VEHICLE_SIZES['motorcycle'].join(', ')}`,
        });
      }

      if (payload.contact_number && !CONTACT_NUMBER_REGEX.test(payload.contact_number)) {
        validationErrors.push({
          field: 'contact_number',
          message: 'Contact number must be in the format 09123456789',
        });
      }
      break;
    default:
      break;
  }

  if (!mongoose.Types.ObjectId.isValid(payload.service_id)) {
    validationErrors.push({
      field: 'service_id',
      message: 'Service id must be a 24-character hexadecimal string',
    });
  }

  if (isNaN(parseInt(payload.price, 10))) {
    validationErrors.push({
      field: 'price',
      message: 'Price must be a valid number',
    });
  }

  if (!VALID_SERVICE_CHARGES.includes(payload.service_charge as SERVICE_CHARGE)) {
    validationErrors.push({
      field: 'service_charge',
      message: `Service charge must be one of ${VALID_SERVICE_CHARGES.join(', ')}`,
    });
  }

  return validationErrors;
};
