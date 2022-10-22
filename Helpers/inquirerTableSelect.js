import TablePrompt from "inquirer-table-prompt";

export class TableSelect extends TablePrompt {

    getCurrentValue() {
        const currentValue = [];
        this.rows.forEach((row, rowIndex) => {
            currentValue.push({value: this.values[rowIndex], key: row.value});
        });

        const result = currentValue.reduce((r, a) => {
            r[a.value] = r[a.value] || [];
            r[a.value].push(a.key);
            return r;
        }, Object.create(null));

        delete result['undefined']

        let data = [];
        let valor;
        this.columns.forEach((entry, i) => {
            const exists = Object.keys(result).find(y => {
                if (y === entry.value) {
                    valor = result[y]
                    return true
                }
            })
            if (!exists) {
                data.push([])
            } else {
                data.push(valor)
            }
        })
        return data
    }
}