const DELIM = '\t';

export interface IRecord {
    mirror: 'left' | 'right' | 'rear';
    lane: number;
    distance: number;
    id: number;
    answer: number;
}

export class Record {
    static makeImageName(record: IRecord) {
        return `${record.mirror}-${record.lane}-${record.distance}-${record.id}`;
    }
    static toString(record: IRecord) {
        return `${record.mirror}${DELIM}${record.lane}${DELIM}${record.distance}${DELIM}${record.id}${DELIM}${record.answer}`        
    }
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
