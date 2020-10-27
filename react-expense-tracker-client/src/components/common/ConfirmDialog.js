import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'types'

const useStyles = makeStyles(theme => ({
    content: {
        padding: '16px 0px'
    }
}))

const ConfirmDialog = React.memo((props) => {
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

// Prop Types
ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    msg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
}

export default ConfirmDialog
