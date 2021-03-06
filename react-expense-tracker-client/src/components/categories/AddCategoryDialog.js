import React, { useState, useRef, useContext } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import CategoryService from '../../services/category'
import { makeStyles } from '@material-ui/core/styles'
import FormTextField from '../common/form/FormTextField'
import PropTypes from 'types'
import { CategoryContext } from './CategoryContext'

const useStyles = makeStyles(theme => ({
    dialogMsg: {
        color: 'red'
    }
}))

const AddCategoryDialog = React.memo(({ open, onClose }) => {
    const classes = useStyles()
    const formRef = useRef(null)
    const { categoryState } = useContext(CategoryContext)

    const [state, setState] = useState({
        categoryName: '',       
        errors: { categoryName: '' },
        dialogMsg: '',
        focus: true,
        isSaving: false
    })

    // Update the state
    const updateState = (newState) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Initialize state every time the dialog opens
    const handleOpen = () => {
        updateState({ dialogMsg: '', categoryName: '', errors: { categoryName: '' }, focus: true })
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
            updateState({isSaving: true})
            CategoryService.createCategory(category).then((cat) => {
                // Close the dialog
                onClose(cat)
            }).catch((error) => {
                if (error && error.data && error.data.errmsg && error.data.errmsg.indexOf('duplicate') !== -1) {
                    updateState({ dialogMsg: 'Category name is not unique' })
                } else {
                    console.error('Error creating category:', error)
                    updateState({ dialogMsg: 'Error creating the Category' })
                }
            }).finally(() => {
                updateState({isSaving: false})
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
        // Verify that the category name is not already in the category list.  Note that this check
        // also occurs on the server
        const dupCategories = categoryState.categories.filter(cat => {
            return cat.name.toLowerCase() === newState.categoryName.toLowerCase()
        })        
        if (dupCategories.length) {
            updateState( {errors: {categoryName: "Category Name is not unique"}})
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
                    <Button onClick={handleSave} color="primary" disabled={state.isSaving}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})

// Prop Types
AddCategoryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired   
}

export default AddCategoryDialog
