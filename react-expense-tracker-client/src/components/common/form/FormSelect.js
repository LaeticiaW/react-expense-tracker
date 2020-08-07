import React from 'react'
import {TextField, MenuItem} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    select: {
        minWidth: '200px'
    },
    inputControl: {
        width: '300px'
    }
}))

export default React.memo(function FormSelect({ id, value, onChange, label, selectList, error, helperText,
    valueProp, labelProp }) {

    const classes = useStyles()
    const selectValueProp = valueProp ? valueProp : 'value'
    const selectLabelProp = labelProp ? labelProp : 'value'

    return (
        <div className={classes.inputControl}>
            <TextField select fullWidth id={id} name={id} label={label}
                className={classes.select}
                SelectProps={{ value: value, onChange: onChange, onBlur: onChange }}
                variant="outlined" margin="dense" error={error} helperText={helperText}>
                {selectList.map(item => (
                    <MenuItem key={item[selectValueProp]} value={item[selectValueProp]}>
                        {item[selectLabelProp]}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    )
})
