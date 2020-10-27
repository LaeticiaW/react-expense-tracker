import React from 'react'
import { TextField, IconButton, InputAdornment } from '@material-ui/core'
import { AttachFile as AttachFileIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'types'

const useStyles = makeStyles(theme => ({
    inputControl: {
        width: '300px'
    },
    fileInput: {
        display: 'flex'
    },
    inputRoot: {
        paddingLeft: '0px'
    }
}))

const FormFileInput = React.memo(({ id, value, onChange, label, error, helperText }) => {
    const classes = useStyles()

    return (
        <div className={classes.inputContro}>
            <div className={classes.fileInput}>
                <TextField variant="outlined" margin="dense" id={id} name={id} label={label}
                    value={value ? value.name : ''} onBlur={onChange} fullWidth
                    error={error} helperText={helperText}
                    className={classes.textField}
                    InputProps={{
                        classes: { root: classes.inputRoot },
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton component="label">
                                    <AttachFileIcon />
                                    <input type="file" hidden onChange={onChange} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>
        </div>
    )
})

FormFileInput.propTypes = {
    id: PropTypes.string.isRequired, 
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), 
    onChange: PropTypes.func.isRequired, 
    label: PropTypes.string.isRequired, 
    error: PropTypes.bool.isRequired, 
    helperText: PropTypes.string
}

export default FormFileInput
