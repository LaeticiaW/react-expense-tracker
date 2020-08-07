import React from 'react'
import { Checkbox, FormControlLabel} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    inputControl: {
        width: '300px'
    }
}))

export default React.memo(function FormCheckbox({ id, label, value, onChange }) {
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
