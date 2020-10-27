import React from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'types'

const useStyles = makeStyles(theme => ({
    inputControl: {
        width: '300px'
    }
}))

const FormTextField = React.memo(({ id, label, value, onChange, error, helperText, type, focus }) => {
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

FormTextField.propTypes = {
    id: PropTypes.string.isRequired, 
    label: PropTypes.string.isRequired, 
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
    onChange: PropTypes.func.isRequired, 
    error: PropTypes.bool, 
    helperText: PropTypes.string, 
    type: PropTypes.string, 
    focus: PropTypes.bool
}

export default FormTextField
