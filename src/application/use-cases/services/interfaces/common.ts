export type ServiceId = string;

export type VechicleType = 'car' | 'motorcycle'

export interface ServiceDetails {
    title: string;
    description: string;
    type: VechicleType;
    price_list: Pricing[];
    reviews: number;
    rating: Rating;
    image_url: string;
}


export interface Rating {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}

export interface Pricing {
    size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    price: number;
}

export interface ServiceObject extends ServiceDetails {
    id: ServiceId;
}