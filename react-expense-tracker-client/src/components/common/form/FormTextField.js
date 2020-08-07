import React from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    inputControl: {
        width: '300px'
    }
}))

export default React.memo(function FormTextField({ id, label, value, onChange, error, helperText, 
    type, focus }) {
    const classes = useStyles()
    const fieldType = type ? type : 'text'
    const fieldFocus = focus ? input => input && input.focus() : () => {}    
   
    return (
        <div className={classes.inputControl}>
            <TextField variant="outlined" type={fieldType} margin="dense" id={id} name={id} label={label}
                value={value} onChange={onChange} onBlur={onChange} fullWidth
                error={error} helperText={helperText} inputRef={fieldFocus}/>
        </div>
    )
})
