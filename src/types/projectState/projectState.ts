export interface Project{
    title:string,
    description:string,
    peopleNum:number,
    type:ProjectType
}

export enum ProjectType {
    ACTIVE,
    FINISHED,
}

export type Listener<T> = (items:T[])=>void