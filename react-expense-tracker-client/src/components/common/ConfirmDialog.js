import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    content: {
        padding: '16px 0px'
    }
}))

export default React.memo(function ConfirmDialog (props) {
    const { open, title, msg, onConfirm, onCancel } = props
    const classes = useStyles()

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
            <Divider />
            <DialogContent>
                <div className={classes.content}>{msg}</div>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={onCancel} color="default">Cancel</Button>
                <Button onClick={onConfirm} color="primary">OK</Button>
            </DialogActions>
        </Dialog>
    )
})
