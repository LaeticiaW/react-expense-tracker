import React, { useState, useRef } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import CategoryService from '../../services/category'
import { makeStyles } from '@material-ui/core/styles'
import FormTextField from '../common/form/FormTextField'
import { TurnedInOutlined } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    dialogMsg: {
        color: 'red'
    }
}))

export default React.memo(function AddCategoryDialog({ open, onClose }) {
    const classes = useStyles()
    const formRef = useRef(null)

    const [state, setState] = useState({
        categoryName: '',
        isCategoryUnique: true,
        errors: { categoryName: '' },
        dialogMsg: '',
        focus: true
    })

    // Update the state
    const updateState = (newState) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Initialize state every time the dialog opens
    const handleOpen = () => {
        updateState({ dialogMsg: '', categoryName: '', errors: { categoryName: '' }, isCategoryUnique: true, focus: TurnedInOutlined })
    }

    // Turn off field focus after dialog is opened
    const turnOffFocus = () => {
        updateState({focus: false})
    }

    // Update the state as the user inputs form values
    const handleChange = (event) => {        
        const newState = { ...state, [event.target.name]: event.target.value }              
        updateState(newState)
        validate(newState)
    }

    // Save the category and close the dialog
    const handleSave = () => {
        const category = {
            name: state.categoryName,
            subcategories: []
        }

        if (validate()) {
            CategoryService.createCategory(category).then((cat) => {
                // Close the dialog
                onClose(cat)
            }).catch((error) => {
                if (error && error.data && error.data.errmsg && error.data.errmsg.indexOf('duplicate') !== -1) {
                    updateState({ isCategoryUnique: false })
                } else {
                    console.error('Error creating category:', error)
                    updateState({ dialogMsg: 'Error creating the Category' })
                }
            })
        }
    }

    // Validate the form data
    const validate = (newState = state) => {
        updateState({ dialogMsg: '', errors: {...state.errors, categoryName: '' }})          
        if (!newState.categoryName) {                  
            updateState({ errors: { categoryName: "Value is required" } })
            return false
        }
        return true
    }
   
    return (
        <div>
            <Dialog open={open} onEnter={handleOpen} onEntered={turnOffFocus} maxWidth="sm">
                <DialogTitle>Add Category</DialogTitle>
                <Divider />
                <DialogContent>
                    <div className={classes.dialogMsg}>{state.dialogMsg}</div>
                    <form ref={formRef} noValidate autoComplete="off">
                        <FormTextField id="categoryName" value={state.categoryName} label="Category" onChange={handleChange}
                            error={Boolean(state.errors.categoryName)} helperText={state.errors.categoryName} focus={state.focus} />
                    </form>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={() => onClose(false)} color="default">Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
