import fs from 'node:fs';
const archive = './db/data_base.json';

export const writeDB = (data) => {
    fs.writeFileSync(archive, JSON.stringify(data))
}

export const readDB = () => {
    if (!fs.existsSync(archive)) {
        return null
    }

    const file = fs.readFileSync(archive, { encoding: 'utf-8' });
    return JSON.parse(file);
}
