import {v4 as uuidv4} from 'uuid';

export class Path {
    id = null;
    name = null;
    path = null

    constructor(name = '', path, type = '') {
        this.id = uuidv4();
        this.name = name;
        this.type = type;
        this.path = path;
    }
}