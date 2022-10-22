const xlxs = require('xlsx');

const wb = xlxs.readFile("PACKING HUANCAYO.xlsx");
let ws = wb.Sheets["PACKING JULIO"];
// ws['!ref'] = 'A1:J8';
const data = xlxs.utils.sheet_to_json(ws, {
    raw: true,
//   header: ['ID', 'PR', 'DES', 'COD', 'STO', 'PF', 'PL', 'PM', 'PU']
    header: "A"
});
/**
 * Que precios va utilizar
 *
 * @type {unknown[]}
 */

const newData = data.splice(1);
const newRecord = [];
const columns = ["PF", "PM"];

// newData.map((record) => {
//     const precios = [record.PF, record.PM]
//     columns.map((cod, i) => {
//         const columns = {
//             codigo_interno: record.D,
//             descripcion: cod,
//             codigo_iipode_unidad: 'NIU',
//             factor: 1,
//             precio_1: precios[i],
//             precio_2: 0,
//             precio_3: 0,
//             precio_por_defecto: 1
//         }
//         newRecord.push(columns)
//     })
// });


// const newWB = xlxs.utils.book_new();
// const newWS = xlxs.utils.json_to_sheet(newRecord);
// xlxs.utils.book_append_sheet(newWB, newWS, "New Data");
// xlxs.writeFile(newWB, "items.xlsx");
