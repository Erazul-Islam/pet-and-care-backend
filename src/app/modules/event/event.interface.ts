export interface IInterested {
    id: string;
    email: string;
    username: string;
    profilePhoto: string;
}


export interface TEvent {
    userName: string,
    userId: string,
    userPhoto: string
    name: string,
    host: string
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string,
    picture: string,
    type: 'classic' | 'comedy' | 'sports' | 'fitness' | 'dance' | 'films' | 'parties'
    details: string,
    status: 'started' | 'ended',
    interested: IInterested[],
    going: IInterested[]
}