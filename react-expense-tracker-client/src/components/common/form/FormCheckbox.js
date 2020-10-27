import React from 'react'
import { Checkbox, FormControlLabel} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'types'

const useStyles = makeStyles(theme => ({
    inputControl: {
        width: '300px'
    }
}))

const FormCheckbox = React.memo(({ id, label, value, onChange }) => {
    const classes = useStyles()

    return (
        <div className={classes.inputControl}>
            <FormControlLabel label={label}
                control={
                    <Checkbox checked={value} onChange={onChange}
                        id={id} name={id} color="primary" />
                }
            />
        </div>
    )
})

FormCheckbox.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
}

export default FormCheckbox
