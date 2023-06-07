export interface IRecord {
    mirror: 'left' | 'right' | 'rear';
    lane: number;
    distance: number;
    id: number;
}

export const DB = [
    {
        mirror: 'left',
        lane: 1,
        distance: 5,
        id: 1,
    },
    {
        mirror: 'left',
        lane: 1,
        distance: 5,
        id: 2,
    },
] as IRecord[];

export function makeImageName(record: IRecord) {
    return `${record.mirror}-${record.lane}-${record.distance}-${record.id}`;
}