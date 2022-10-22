import path from "path";
import {
    pause,
    selectOption,
    showDirectory,
    showFiles,
    showMenu,
    showTable,
    showTableSelect
} from './Helpers/inquirer.js'
import {Resources} from "./Models/Resources.js";
import {buildingSheet, buildingSheetDuplicated, getBody, getHeader} from "./Services/SheetJS.js";
import {readDB, writeDB} from "./Helpers/saveFile.js";

const main = async () => {
    let opt;
    const resources = new Resources();
    const resourceDB = readDB();

    if (resourceDB) {
        resources.loadDirectoriesFromArray(resourceDB)
    }

    do {
        opt = await showMenu();
        switch (opt) {
            case 1:
                let directoryPath;
                let formatPath;
                let table;

                if (resources.listArr.length > 0) {
                    resources.listArr.map(element => {
                        if (element.type === 'Directory') {
                            directoryPath = element.path;
                        }

                        if (element.type === 'Format') {
                            formatPath = element.path
                        }
                    });
                }

                const file = await showFiles(directoryPath ?? '..', 'Seleccione un Archivo de Excel')
                if (file.length === 0) {
                    console.log(`No seleccionaste ningun archivo presiona ${'espacio'.red} para seleccionar y luego ${'ENTER'.green} para continuar`);
                    break;
                }

                const format = await showFiles(formatPath ?? '..', 'Seleccione el Formato');
                if (format.length === 0) {
                    console.log(`No seleccionaste ningun archivo presiona ${'espacio'.red} para seleccionar y luego ${'ENTER'.green} para continuar`);
                    break;
                }

                const formatHeader = await getHeader(format[0])
                const fileHeader = await getHeader(file[0])

                const choices = [{
                    value: 1, name: 'Repetir n veces: recomendado (Lista de Precios)'
                }, {
                    value: 2, name: 'Organizar data: recomendado (Lista de Productos)'
                }];

                const id = await selectOption(choices, '¿Selecciona la funcionalidad de tu archivo?')

                if (id === 1) {

                    // Manual
                    const manual = {};
                    manual.excel = new Format('o');
                    console.log('Instruccion de la Tabla'.green)
                    console.table(manual)

                    // N duplicate
                    table = await showTableSelect(fileHeader, formatHeader)
                    const dataBody = await getBody(file[0])
                    await buildingSheetDuplicated(dataBody, formatHeader, table);

                } else if (id === 2) {

                    // Manual
                    const manual = {};
                    manual.formato = new File('o');
                    console.log('Instruccion de la Tabla'.green)
                    console.table(manual)

                    // Organize
                    table = await showTable(formatHeader, fileHeader)
                    const dataBody = await getBody(file[0])
                    await buildingSheet(dataBody, formatHeader, table);

                } else {
                    console.log(`No seleccionaste ninguna opción presiona ${'espacio'.red} para seleccionar y luego ${'ENTER'.green} para continuar`);
                    break;
                }
                break;

            case 2:
                const pathDirectory = await showDirectory()
                if (pathDirectory.length === 0) {
                    console.log(`No seleccionaste ninguna Carpeta presiona ${'espacio'.red} para seleccionar y luego ${'ENTER'.green} para continuar`);
                    break;
                }
                const nameDirectory = pathDirectory[0].split(path.sep).pop();
                resources.createPath(nameDirectory, pathDirectory[0], 'Directory')
                break;

            case 3:
                const pathFormat = await showDirectory()
                if (pathFormat.length === 0) {
                    console.log(`No seleccionaste ninguna Carpeta presiona ${'espacio'.red} para seleccionar y luego ${'ENTER'.green} para continuar`);
                    break;
                }
                const nameFormat = pathFormat[0].split(path.sep).pop();
                resources.createPath(nameFormat, pathFormat[0], 'Format')
                break;

            case 0:
                console.log(`${'Adios!!'.green} ${':)'.yellow}`);
                break;
        }
        writeDB(resources.listArr)

        if (opt !== 0) await pause();

    } while (opt !== 0)
}

main()

// Instructions
function Format(option) {
    this.formato = option;
}

function File(option) {
    this.excel = option;
}