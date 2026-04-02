export interface Province {
    id: number;
    name: string;
    slug: string;
    type: string;
    nameWithType: string;
}

export interface Ward {
    id: number;
    name: string;
    slug: string;
    type: string;
    nameWithType: string;
    provinceId: number;
}

export interface Farm {
    id: number;
    farmName: string;
    provinceId: number;
    provinceName: string;
    wardId: number;
    wardName: string;
    area: number;
    active: boolean;
}

export interface CreateFarmRequest {
    farmName: string;
    provinceId: number;
    wardId: number;
    area: number;
    active: boolean;
}

export interface Plot {
    id: number;
    farmId: number;
    farmName: string;
    plotName: string;
    area: number;
    soilType: string;
    status: 'IN_USE' | 'IDLE' | 'AVAILABLE' | 'FALLOW' | 'MAINTENANCE'; // inclusive of backend enum
}

export interface CreatePlotRequest {
    plotName: string;
    area: number;
    soilType: string;
    status: 'IN_USE' | 'IDLE';
}



