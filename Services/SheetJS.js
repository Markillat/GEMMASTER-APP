import xlxs from 'xlsx';
import cliProgress from "cli-progress";
import colors from "ansi-colors";

export let nameFile;
let payload = [];

export const getHeader = async (path) => {
    const wb = xlxs.readFile(path);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlxs.utils.sheet_to_json(ws, {
        raw: true,
        header: "A"
    });
    const header = data.shift();
    return Object.entries(header).map(([key, value]) => ({
        name: value,
        value: key
    }))
}

export const getBody = async (path) => {
    const wb = xlxs.readFile(path);
    // one sheet
    if (wb.SheetNames.length === 1) {
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = xlxs.utils.sheet_to_json(ws, {
            raw: true,
            header: "A"
        });
        return data.splice(1);
    } else {
        // many sheet
        return await getBodyMany(path)
    }
}

export const getBodyMany = async (path) => {
    const wb = xlxs.readFile(path);
    for (let i = 0; i < wb.SheetNames.length; i++) {
        const ws = wb.Sheets[wb.SheetNames[i]]
        await processSheet(ws)
    }
    return payload;
}

export const processSheet = async (SheetName) => {
    const data = xlxs.utils.sheet_to_json(SheetName, {
        raw: true,
        header: "A"
    });
    const dataSheet = data.splice(1);
    payload.push(...dataSheet);
}

//Transformation format excel

export const buildingSheet = async (payload = [], rows = [], itemsSelected) => {
    const records = [];
    let obj = {};
    payload.map((record, i) => {
        rows.map((row, x) => {
            const idx = x + 1;
            obj[row['name']] = record[itemsSelected[x].value]
            if (idx === rows.length) {
                records.push(obj)
                obj = {}
            }
        })
    })
    return await output(records)
}

export const buildingSheetDuplicated = async (payload = [], columns = [], itemsSelected) => {

    const repeat = itemsSelected.map(a => a.length).indexOf(Math.max(...itemsSelected.map(a => a.length)));
    const elementBig = itemsSelected[repeat].length
    const records = [];
    let obj = {};

    itemsSelected.forEach((n, i) => {
        if (n.length !== elementBig) {
            const result = elementBig - n.length
            const newArray = Array.from({length: result}).map(() => n[n.length - 1])
            itemsSelected[i] = n.concat(newArray);
        }
    }, itemsSelected)

    const arrayColumn = (arr, n) => arr.map(x => x[n]);

    payload.map((record, i) => { // Documentos
        for (let i = 0; i < itemsSelected[repeat].length; i++) { // repetir n veces
            const transformData = arrayColumn(itemsSelected, i)
            columns.map((colum, i) => { // Path
                const idx = i + 1;
                obj[colum['name']] = record[transformData[i]]
                if (idx === columns.length) {
                    records.push(obj)
                    obj = {}
                }
            })
        }
    })
    return await output(records)
}

export const output = async (newData) => {
    const newWB = xlxs.utils.book_new();
    const newWS = xlxs.utils.json_to_sheet(newData);
    xlxs.utils.book_append_sheet(newWB, newWS, "New Data");
    xlxs.writeFile(newWB, `${nameFile ?? 'nuevo'}.xlsx`);
    loading(() => console.log('\nLa exportación ha sido finalizada!'));
}

export const loading = (onComplete) => {

    // create new progress bar using default values
    const b2 = new cliProgress.SingleBar({
        format: 'Exportación en proceso |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
    b2.start(100, 0);

    // 50ms update rate
    const timer = setInterval(function () {
        // increment value
        b2.increment();

        // set limit
        if (b2.value >= b2.getTotal()) {
            // stop timer
            clearInterval(timer);

            b2.stop();

            // run complete callback
            onComplete.apply(this);
        }
    }, 20);
}