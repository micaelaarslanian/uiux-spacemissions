export interface Mission {
    id: string;
    name: string;
    year: number;
    agency: string;
    status: string;
    missionType: string;
    crew: string[];
    description: string;
    launchDate: string; 
    cost: number;
}

export interface MissionDataFile {
    missions: Mission[];
}
