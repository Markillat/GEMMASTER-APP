import inquirer from "inquirer";
import colors from 'colors';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'
import {TableSelect} from './inquirerTableSelect.js'

import path from 'path';
import chalk from 'chalk';
import inquirerIndex from 'inquirer-table-prompt'
import clear from "clear";
import figlet from "figlet"

export const showMenu = async () => {
    const question = [
        {
            type: 'list',
            name: 'option',
            message: '¿Que desea realizar?',
            choices: [
                {
                    value: 1,
                    name: `${'1.'.green} Mostrar Archivos`
                },
                {
                    value: 2,
                    name: `${'2.'.green} Configurar ruta de Archivos`
                },
                {
                    value: 3,
                    name: `${'3.'.green} Configurar ruta de Formatos`
                },
                {
                    value: 0,
                    name: `${'0.'.green} Salir`
                }
            ]
        }

    ];

    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('GEMMaster', {horizontalLayout: 'full'})
        )
    );

    const {option} = await inquirer.prompt(question);
    return option;
}
export const pause = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];
    console.log(`\n`)
    return await inquirer.prompt(question);
}

export const showDirectory = async () => {
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)
    const {directory} = await inquirer.prompt([
        {
            root: '..',
            type: 'file-tree-selection',
            name: 'directory',
            message: 'Seleccione un directorio',
            multiple: true,
            onlyShowDir: true,
            validate: (input) => {
                const name = input.split(path.sep).pop();
                if (name[0] !== ".") {
                    return true;
                }
                return "por favor seleccione un directorio"
            },
            transformer: (input) => {
                const name = input.split(path.sep).pop();
                if (name[0] === ".") {
                    return chalk.grey(name);
                }
                return name;
            }
        }
    ]);
    return directory;
}

export const showFiles = async (directory, message) => {
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)
    const {files} = await inquirer.prompt([
        {
            root: directory,
            type: 'file-tree-selection',
            name: 'files',
            message,
            multiple: true,
            validate: (input) => {
                const name = input.split(path.sep).pop();
                if (name[0] !== "." && name.split('.').pop() === "xlsx") {
                    return true;
                }
                return "por favor seleccione otro archivo"
            },
            transformer: (input) => {
                const name = input.split(path.sep).pop();
                if (name[0] === ".") {
                    return chalk.grey(name);
                }
                return name;
            }
        }
    ]);
    return files;
}

export const selectOption = async (files, message = '') => {
    const choices = files.map((file, i) => {
        const index = i + 1;
        return {
            value: index,
            name: `${index} ${file.name}`.yellow
        };
    });

    const question = [
        {
            type: 'checkbox',
            name: 'id',
            message,
            choices
        }
    ]

    const {id} = await inquirer.prompt(question);
    return id[0];
}

export const showTable = async (rows, columns) => {
    inquirer.registerPrompt("table", inquirerIndex);
    return inquirer.prompt([
        {
            type: "table",
            name: "tableFormat",
            message: "Elige las celdas y relaciona con el formato seleccionado",
            columns,
            rows
        }
    ]).then(({tableFormat}) => {
        return tableFormat.map((column, i) => ({
            id: i,
            value: column,
        }))
    });
}

export const showTableSelect = async (rows, columns) => {
    inquirer.registerPrompt('table-select', TableSelect)
    return inquirer.prompt([
        {
            type: 'table-select',
            name: 'tableFormat',
            message: 'Elige las celdas y relaciona con el formato seleccionado',
            columns,
            rows
        },
    ]).then(({tableFormat}) => {
        return tableFormat;
    })
}