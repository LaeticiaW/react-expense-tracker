import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import CategoryService from '../../services/category'
import { makeStyles } from '@material-ui/core/styles'
import FormTextField from '../common/form/FormTextField'
import Util from '../../services/util'
import Fab from '@material-ui/core/Fab'
import { v4 as uuidv4 } from 'uuid'
import PropTypes, { CategoryType } from 'types'

const useStyles = makeStyles(theme => ({
    inputControl: {
        width: '200px'
    },
    dialogMsg: {
        color: 'red'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    fieldset: {
        border: 'solid 1px #cdcdcd',
        borderRadius: '5px'
    },
    subcategoryList: {
        height: '150px',
        overflow: 'auto'
    },
    addFab: {
        marginLeft: '8px',
        marginTop: '8px'
    }
}))

const UpdateCategoryDialog = React.memo(({ open, onClose, category }) => {
    const classes = useStyles()

    const [state, setState] = useState({
        dialogMsg: '',
        dialogCategory: { name: '', subcategories: [] },
        newSubcategory: '',
        focus: true,
        isSaving: false
    })
    const [errors, setErrors] = useState({})    

    // Update state
    const updateState = (newState) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Initialize state when dialog opens
    const handleOpen = () => {
        updateState({
            dialogCategory: JSON.parse(JSON.stringify(category)), dialogMsg: '', newSubcategory: '', focus: true
        })
        setErrors({})       
    }

    // Turn off field focus after dialog is opened
    const turnOffFocus = () => {
        updateState({focus: false})
    }

    // Add the new subcategory to the list of subcategories     
    const handleAddSubcategory = () => {
        if (!state.newSubcategory) {
            return
        }    

        const subcat = {
            id: uuidv4(),
            name: state.newSubcategory,
            parentTreeId: state.dialogCategory._id,
            matchText: []
        }

        const isDuplicate = state.dialogCategory.subcategories.some(sub => sub.name.toLowerCase() === state.newSubcategory.toLowerCase())
        if (isDuplicate) {
            setErrors({ ...errors, newSubcategory: 'Duplicate subcategory name' })
            return
        }

        const tempCategory = JSON.parse(JSON.stringify(state.dialogCategory))
        tempCategory.subcategories.push(subcat)
        Util.sortArray(tempCategory.subcategories, 'name')

        updateState({
            dialogMsg: '',
            dialogCategory: tempCategory,
            newSubcategory: ''            
        })
    }

    // Delete the subcategory from the list     
    const deleteSubcategory = (subcat, idx) => {
        let tempCategory = { ...state.dialogCategory }
        tempCategory.subcategories.splice(idx, 1)

        updateState({
            dialogCategory: tempCategory,
            dialogMsg: ''
        })
    }

    // Validate a form field
    const validateField = (name, value) => {
        let error = ''
        if (name === 'name' && value === '') {
            error = 'Value is required'
        }
        setErrors({ ...errors, [name]: error })
        return error
    }

    // Validate all form fields
    const validateAllFields = () => {
        let formErrors = {}
        formErrors.name = validateField('name', state.dialogCategory.name)
        setErrors(formErrors)

        let isValid = true
        for (const key in formErrors) {
            if (!!formErrors[key]) {
                isValid = false
            }
        }
        return isValid
    }

    // Save the updated category and close the dialog 
    const handleSave = () => {
        if (validateAllFields()) {
            updateState({isSaving: true})
            CategoryService.updateCategory(state.dialogCategory).then(() => {               
                onClose(true)
            }).catch((error) => {
                if (error && error.data && error.data.errmsg && error.data.errmsg.indexOf('duplicate') !== -1) {
                    console.error('Error updating category, name is not unique')
                    updateState({ dialogMsg: 'Category Name is not unique' })
                } else {
                    console.error('Error creating category:', error)
                    updateState({ dialogMsg: 'Error creating the Category' })
                }
            }).finally(() => {
                updateState({isSaving: false})
            })
        }
    }

    // Cancel the dialog
    const handleCancel = () => {       
        onClose(false)
    }

    // Update state when field values change
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        if (name === 'newSubcategory') {
            updateState({ ...state, newSubcategory: value })
        } else {
            const cat = { ...state.dialogCategory, [name]: value }
            const newState = { ...state, dialogCategory: cat }             
            updateState(newState)           
        }
        validateField(name, value)
    }
    
    return (
        <div>
            <Dialog open={open} onEnter={handleOpen} onEntered={turnOffFocus} maxWidth="sm">
                <DialogTitle>Update Category</DialogTitle>
                <Divider />
                <DialogContent>
                    <div className={classes.dialogMsg}>{state.dialogMsg}</div>
                    <form noValidate autoComplete="off">
                        <FormTextField id="name" value={state.dialogCategory.name} label="Category" onChange={handleChange}
                            error={Boolean(errors.name)} helperText={errors.name} focus={state.focus}/>

                        <fieldset className={classes.fieldset}>
                            <legend>Subcategories</legend>
                            <div className={classes.subcategoryList}>
                                {state.dialogCategory.subcategories.map((subcat, idx) => (
                                    <div className={classes.row} key={subcat.name}>
                                        <div className={classes.subcategory} key={subcat.id}>{subcat.name}</div>
                                        <div className={classes.action}>
                                            <IconButton size="small" onClick={() => { deleteSubcategory(subcat, idx) }} className={classes.iconBtn}>
                                                <DeleteIcon className={classes.icon} title="Delete Subcategory" />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <div className={classes.row}>
                            <FormTextField id="newSubcategory" value={state.newSubcategory} label="New Subcategory" onChange={handleChange}
                                error={Boolean(errors.newSubcategory)} helperText={errors.newSubcategory} />
                            <Fab size="small" color="primary" onClick={handleAddSubcategory} className={classes.addFab}
                                margin="dense" title="Add Subcategory">
                                <AddIcon />
                            </Fab>
                        </div>
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

// Prop Types
UpdateCategoryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    category: CategoryType.isRequired
}

export default UpdateCategoryDialog
