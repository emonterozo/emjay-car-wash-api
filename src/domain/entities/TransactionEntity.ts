interface TransactionService {
    id: string;
    is_free: boolean;
}

interface EntityParams {
    id?: string;
    services: TransactionService[];
    customer_id?: string;
    vehicle_type: string;
    vehicle_size: string;
    model: string;
    plate_number: string;
}

export class TransactionEntity {
    private id?: string;
    private services: TransactionService[];
    private customer_id?: string;
    private vehicle_type: string;
    private vehicle_size: string;
    private model: string;
    private plate_number: string;

    private constructor(params: EntityParams) {
        this.id = params.id;
        this.services = params.services;
        this.customer_id = params.customer_id;
        this.vehicle_type = params.vehicle_type;
        this.vehicle_size = params.vehicle_size;
        this.model = params.model;
        this.plate_number = params.plate_number;
    }

    public static create(params: EntityParams) {
        return new TransactionEntity(params);
    }

    public validateVehicleType() {
        if (!['car', 'motorcycle'].includes(this.vehicle_type))
            return `Unknown vehicle type: ${this.vehicle_type}`;

        return ''
    }

    public validationVehicleSize() {
        if (!['sm', 'md', 'lg', 'xl', 'xxl'].includes(this.vehicle_size))
            return `Unknown vehicle size: ${this.vehicle_size}`;

        return ''
    }

    public validateModel() {
        if (!this.model)
            return 'Model is required.';

        return '';
    }

    public validatePlateNumber() {
        if (!this.plate_number)
            return 'Plate number is required';

        if (this.plate_number.length < 6)
            return 'Plate number must be 6 characters long';

        return '';
    }

    public validateServices() {
        if (this.services.length === 0)
            return 'Services is required';

        return '';
    }

    getModel() {
        return this.model;
    }

    getServicesId() {
        return this.services;
    }

    getCustomerId() {
        return this.customer_id;
    }

    getVehicleType() {
        return this.vehicle_type;
    }

    getVehicleSize() {
        return this.vehicle_size;
    }

    getPlateNumber() {
        return this.plate_number;
    }

}