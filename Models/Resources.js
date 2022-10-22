import {Path} from "./Path.js";

export class Resources {
    _lists = {};

    constructor() {
        this._lists = {}
    }

    get listArr() {
        const list = [];
        Object.keys(this._lists).forEach(key => list.push(this._lists[key]))
        return list;
    }

    loadDirectoriesFromArray(paths = []) {
        paths.forEach(path => {
            this._lists[path.id] = path
        });
    }

    createPath(name = null, path, type) {
        const urlPath = new Path(name, path, type);
        this._lists[urlPath.id] = urlPath
    }
}