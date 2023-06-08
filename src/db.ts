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

class ImageData {
    constructor(
        public mirror: 'left' | 'right' | 'rear',
        public lane: number,
        public distance: number,
        public count: number,
    ) { }
}

const imageData = [
    new ImageData( 'left', 1, 5, 3 ),
    new ImageData( 'left', 0, 15, 3 ),
    new ImageData( 'left', 1, 15, 3 ),
    new ImageData( 'rear', 0, 15, 3 ),
    new ImageData( 'rear', 1, 15, 3 ),
    new ImageData( 'left', 0, 20, 3 ),
    new ImageData( 'left', 1, 20, 3 ),
    new ImageData( 'rear', 0, 20, 3 ),
    new ImageData( 'rear', 1, 20, 3 ),
    new ImageData( 'left', 0, 25, 3 ),
    new ImageData( 'left', 1, 25, 3 ),
    new ImageData( 'rear', 0, 25, 3 ),
    new ImageData( 'rear', 1, 25, 3 ),
    new ImageData( 'left', 0, 40, 3 ),
    new ImageData( 'left', 1, 40, 3 ),
    new ImageData( 'rear', 0, 40, 3 ),
    new ImageData( 'rear', 1, 40, 3 ),
];

function shuffle(array: Array<any>) {
    let currentIndex = array.length,
        randomIndex;
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [ array[currentIndex], array[randomIndex] ] = [ array[randomIndex], array[currentIndex] ];
    }
  
    return array;
}

export const DB = shuffle( imageData.flatMap( data => {
    const result: IRecord[] = [];
    for (let i = 0; i < data.count; i++ ) {
        result.push({
            mirror: data.mirror,
            lane: data.lane,
            distance: data.distance,
            id: i + 1,
        } as IRecord);
    }
    return result;
} ) );
