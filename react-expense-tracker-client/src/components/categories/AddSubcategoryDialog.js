import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import CategoryService from '../../services/category'
import { makeStyles } from '@material-ui/core/styles'
import FormTextField from '../common/form/FormTextField'
import { v4 as uuidv4 } from 'uuid'
import Util from '../../services/util'

const useStyles = makeStyles(theme => ({
    dialogMsg: {
        color: 'red'
    }
}))

export default React.memo(function AddSubcategoryDialog({ open, onClose, category }) {
    const classes = useStyles()

    const [state, setState] = useState({
        subcategoryName: '',     
        errors: { subcategoryName: '' },
        dialogMsg: '',
        focus: true
    })

    // Update state
    const updateState = (newState) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Initialize state every time the dialog opens
    const handleOpen = () => {                      
        updateState({
            dialogMsg: '', subcategoryName: '', errors: { subcategoryName: '' }, focus: true
        })
    }

    // Turn off field focus after dialog is opened
    const turnOffFocus = () => {
        updateState({focus: false})
    }

    // Update state and validate the form data as the user enters values
    const handleChange = (event) => {
        const newState = { subcategoryName: event.target.value }
        validate(newState)
        updateState(newState)
    }

    // Close the dialog
    const handleCancel = () => {
        onClose(false)
    }

    // Save the category and close the dialog
    const handleSave = () => {
        if (validate()) {
            const newCategory = JSON.parse(JSON.stringify(category))
            const newSubcategory = {
                id: uuidv4(),
                name: state.subcategoryName,
                matchText: [],
                parentCategoryId: category._id
            }
            newCategory.subcategories.push(newSubcategory)

            Util.sortArray(newCategory.subcategories, 'name')

            CategoryService.updateCategory(newCategory).then(() => {
                // Close the dialog
                onClose(newSubcategory)
            }).catch((error) => {
                console.error('Error creating subcategory:', error)
                updateState({ dialogMsg: 'Error creating the Subcategory' })
            })
        }
    }

    // Validate the form data
    const validate = (newState = state) => {
        updateState({ dialogMsg: '', errors: { subcategoryName: '' } })

        if (!newState.subcategoryName) {
            updateState({ errors: { subcategoryName: "Value is required" } })
            return false
        }

        const isDuplicate = category.subcategories.some(sub => sub.name.toLowerCase() === newState.subcategoryName.toLowerCase())
        if (isDuplicate) {
            updateState({ dialogMsg: 'Duplicate subcategory name' })
            return false
        }

        return true
    }
   
    return (
        <div>
            <Dialog open={open} onEnter={handleOpen} onEntered={turnOffFocus} maxWidth="sm">
                <DialogTitle>Add Subcategory</DialogTitle>
                <Divider />
                <DialogContent>
                    <div className={classes.dialogMsg}>{state.dialogMsg}</div>
                    <form noValidate autoComplete="off">
                        <FormTextField id="category" value={state.subcategoryName} label="Subcategory"
                            onChange={handleChange} error={Boolean(state.errors.subcategoryName)}
                            helperText={state.errors.subcategoryName} focus={state.focus}/>
                    </form>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={handleCancel} color="default">Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
