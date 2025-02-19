import DataGridComponent, { renderRequiredHeader } from './DataGridComponent';
import { DiagnosisList, DiagnosisTypeList } from '../values/DiagnosisList';
import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';



export default function DiagnosisItem(props) {

    const [chosenVal, setChosenVal] = React.useState('');
    const [columnVal, setColumnVal] = React.useState('');
    const [currentRow, setCurrentRow] = React.useState("");

    const handleChange = (event) => {
        setChosenVal(event.target.value);
    };

    const handleChangeType = (callType) => {
        setColumnVal(callType);
    };

    const updateParentEdit = () => {
        var ob = {};
        var num = currentRow;
        ob[num] = {};
        ob[num][columnVal] = {}
        ob[num][columnVal]["value"] = chosenVal;
        props.edit(ob);
    };

    //watch for change happening on both columnVal and chosenVal
    React.useEffect(updateParentEdit, [columnVal]);
    React.useEffect(updateParentEdit, [chosenVal]);

    const updateProductServiceRow = (params) => {
        //sets in focus the item that you are editing
        if (params.hasFocus == true) {
            setCurrentRow(params.id);
        }
    }

    //generates options shown in menu
    function makeMenuItem(listOfOptions) {
        return listOfOptions.map(el => {
            return <MenuItem value={el}>{el}</MenuItem>
        })
    }


    const ourColumns = [
        {
            field: 'diagnosis', headerName: 'Diagnosis',
            editable: true, type: 'singleSelect',
            valueOptions: DiagnosisList.map(code => `${code.diagnosisCodeableConcept.coding[0].code} ${code.diagnosisCodeableConcept.coding[0].display}`), minWidth: 185,
            renderHeader: renderRequiredHeader,
            required: true,
            renderCell: (params) => {
                return (
                    <FormControl fullWidth>
                        < Select
                            labelId="diagnosis-select"
                            id="diagnosis-select"
                            label="diagnosis"
                            value={params.formattedValue}
                            onChange={event => { updateProductServiceRow(params); handleChange(event); handleChangeType("diagnosis") }}
                        >
                            {makeMenuItem(params.colDef.valueOptions)}
                        </Select>
                    </FormControl>
                );
            }
        },
        {
            field: 'type', headerName: 'Type', editable: true, type: 'singleSelect',
            valueOptions: DiagnosisTypeList.map(type => `${type.display}`), minWidth: 185,
            renderHeader: renderRequiredHeader,
            required: true,
            renderCell: (params) => {
                return (
                    <FormControl fullWidth>
                        < Select
                            labelId="type-select"
                            id="type-select"
                            label="type"
                            value={params.formattedValue}
                            onChange={event => { updateProductServiceRow(params); handleChange(event); handleChangeType("type") }}
                        >
                            {makeMenuItem(params.colDef.valueOptions)}
                        </Select>
                    </FormControl>
                );
            }
        }
    ];

    return (
        <div>
            <DataGridComponent rows={props.rows} columns={ourColumns} add={props.addOne} edit={props.edit} delete={props.deleteOne} />
        </div >
    );
}