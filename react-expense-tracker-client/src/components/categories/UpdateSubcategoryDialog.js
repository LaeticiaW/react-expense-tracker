import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fab, IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import CategoryService from '../../services/category'
import { makeStyles } from '@material-ui/core/styles'
import FormTextField from '../common/form/FormTextField'
import Util from '../../services/util'
import PropTypes, { CategoryType, SubcategoryType } from 'types'

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
    matchTextList: {
        height: '150px',
        overflow: 'auto'
    },
    addFab: {
        marginLeft: '8px',
        marginTop: '8px'
    }
}))

const UpdateSubcategoryDialog = React.memo(({ open, onClose, subcategory, parentCategory }) => {
    const classes = useStyles()

    const [state, setState] = useState({       
        dialogMsg: '',
        dialogSubcategory: { name: '', matchText: [] },
        newMatchText: '',
        focus: true,
        isSaving: false
    })
    const [errors, setErrors] = useState({ name: '', newMatchText: '' })

    // Update state
    const updateState = (newState) => {
        setState(state => ({ ...state, ...newState }))
    }

    // Initialize state when the dialog opens
    const handleOpen = () => {            
        updateState({
            dialogSubcategory: JSON.parse(JSON.stringify(subcategory)), newMatchText: '',
            dialogMsg: '', errors: { name: '', matchText: '' }, focus: true
        })
    }

    // Turn off field focus after dialog is opened
    const turnOffFocus = () => {
        updateState({focus: false})
    }

    // Update state when form values change
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        if (name === 'newMatchText') {
            updateState({ [name]: value })
        } else {
            const subcat = { ...state.dialogSubcategory, [name]: value }
            updateState({ dialogSubcategory: subcat })
        }
        validateField(name, value)
    }

    // Determines if the subcategory is unique
    const isSubcategoryUnique = () => {
        // First check that if name is unchanged from original
        if (state.dialogSubcategory.name.toLowerCase() === subcategory.name.toLowerCase()) {
            return true
        }
        // Now check to see if subcategory name is already used within the category
        const found = parentCategory.subcategories.some((subcat) => {
            return subcat.name.toLowerCase() === state.dialogSubcategory.name.toLowerCase()
        })
        return !found
    }

    // Validate form field
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
        formErrors.name = validateField('name', state.dialogSubcategory.name)
        setErrors(formErrors)

        let isValid = true
        for (const key in formErrors) {
            if (!!formErrors[key]) {
                isValid = false
            }
        }
        return isValid
    }
    
    // Update the category and close the dialog 
    const handleSave = () => {        
        const category = JSON.parse(JSON.stringify(parentCategory))

        if (isSubcategoryUnique(state.dialogSubcategory.name)) {            
            if (validateAllFields()) {               
                // Update the subcategory in the category's subcategories
                const index = category.subcategories.findIndex((subcat) => subcat.id === state.dialogSubcategory.id)
                if (index !== -1) {                    
                    category.subcategories[index] = state.dialogSubcategory
                    Util.sortArray(category.subcategories, 'name')  

                    updateState({isSaving: true})
                    CategoryService.updateCategory(category).then(() => {                      
                        onClose(true)
                    }).catch((error) => {
                        console.error('Error saving subcategory:', error)
                        updateState({dialogMessage: 'Error saving the Subcategory'})
                    }).finally(() => {
                        updateState({isSaving: false})
                    })
                }
            }
        } else {
            updateState({ dialogMsg: 'Subcategory name is not unique' })
        }
    }

    // Add the new match text to the list of match text    
    const handleAddMatchText = () => {
        if (!state.newMatchText) {
            return
        }

        const isDuplicate = state.dialogSubcategory.matchText.some(text => text.toLowerCase() === state.newMatchText.toLowerCase())
        if (isDuplicate) {
            setErrors({ ...errors, newMatchText: 'Duplicate match text' })
            return
        }

        const tempSubcategory = JSON.parse(JSON.stringify(state.dialogSubcategory))
        tempSubcategory.matchText.push(state.newMatchText)
        tempSubcategory.matchText.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase())
        })
       
        updateState({
            dialogMsg: '',
            dialogSubcategory: tempSubcategory,
            newMatchText: ''
        })
    }
    
    // Delete match text from the subcategory    
    const deleteMatchText = (text, idx) => {
        const tempSubcat = JSON.parse(JSON.stringify(state.dialogSubcategory))
        tempSubcat.matchText.splice(idx, 1)
        updateState({
            dialogMsg: null,
            dialogSubcategory: tempSubcat
        })
    }
   
    return (     
            <Dialog open={open} onEnter={handleOpen} onEntered={turnOffFocus} maxWidth="sm">
                <DialogTitle>Update Subcategory</DialogTitle>
                <Divider />
                <DialogContent>
                    <div className={classes.dialogMsg}>{state.dialogMsg}</div>
                    <form noValidate autoComplete="off">
                        <FormTextField id="name" value={state.dialogSubcategory.name} label="Category" onChange={handleChange}
                            error={Boolean(errors.name)} helperText={errors.name} />

                        <fieldset className={classes.fieldset}>
                            <legend>Match Text</legend>
                            <div className={classes.matchTextList}>
                                {state.dialogSubcategory.matchText.map((matchText, idx) => (
                                    <div className={classes.row} key={matchText}>
                                        <div>{matchText}</div>
                                        <div className={classes.action}>
                                            <IconButton size="small" onClick={() => { deleteMatchText(matchText, idx) }} className={classes.iconBtn}>
                                                <DeleteIcon className={classes.icon} title="Delete Match Text" />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <div className={classes.row}>
                            <FormTextField id="newMatchText" value={state.newMatchText} label="New Match Text" onChange={handleChange}
                                error={Boolean(errors.newMatchText)} helperText={errors.newMatchText} />
                            <Fab size="small" color="primary" onClick={handleAddMatchText} className={classes.addFab}
                                margin="dense" title="Add Match Text">
                                <AddIcon />
                            </Fab>
                        </div>
                    </form>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={() => onClose(false)} color="default">Cancel</Button>
                    <Button onClick={handleSave} color="primary" disabled={state.isSaving}>Save</Button>
                </DialogActions>
            </Dialog>        
    )
})

// Prop Types
UpdateSubcategoryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    subcategory: SubcategoryType.isRequired,
    parentCategory: CategoryType.isRequired
}

export default UpdateSubcategoryDialog

