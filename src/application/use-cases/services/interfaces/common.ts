export type ServiceId = string;

export type VechicleType = 'car' | 'motorcycle'

export interface ServiceDetails {
    title: string;
    description: string;
    type: VechicleType;
    price_list: Pricing[];
    image_url: string;
    review: number;
    reviews_count: number;
    last_review: string;
}


export interface Pricing {
    size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    price: number;
}

export interface ServiceObject extends ServiceDetails {
    id: ServiceId;
}