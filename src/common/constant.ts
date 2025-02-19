export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum SERVICE_CHARGE {
  FREE = 'free',
  NOT_FREE = 'not free',
}

export enum EMPLOYEE_STATUS {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
}

export enum VEHICLE_TYPE {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
}

export enum VEHICLE_SIZE_CAR {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export enum VEHICLE_SIZE_MOTORCYCLE {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

export const VALID_SERVICE_CHARGES: SERVICE_CHARGE[] = [
  SERVICE_CHARGE.FREE,
  SERVICE_CHARGE.NOT_FREE,
];

export const VALID_GENDERS: GENDER[] = [GENDER.MALE, GENDER.FEMALE];

export const VALID_VEHICLE_TYPES: VEHICLE_TYPE[] = [VEHICLE_TYPE.CAR, VEHICLE_TYPE.MOTORCYCLE];

export const VALID_VEHICLE_SIZES = {
  [VEHICLE_TYPE.CAR]: [
    VEHICLE_SIZE_CAR.SM,
    VEHICLE_SIZE_CAR.MD,
    VEHICLE_SIZE_CAR.LG,
    VEHICLE_SIZE_CAR.XL,
    VEHICLE_SIZE_CAR.XXL,
  ],
  [VEHICLE_TYPE.MOTORCYCLE]: [
    VEHICLE_SIZE_MOTORCYCLE.SM,
    VEHICLE_SIZE_MOTORCYCLE.MD,
    VEHICLE_SIZE_MOTORCYCLE.LG,
    VEHICLE_SIZE_MOTORCYCLE.XL,
  ],
};

export const VALID_EMPLOYEE_STATUSES: EMPLOYEE_STATUS[] = [
  EMPLOYEE_STATUS.ACTIVE,
  EMPLOYEE_STATUS.TERMINATED,
];

export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const CONTACT_NUMBER_REGEX = /^09\d{9}$/;
