import React, { useState, useRef, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Toolbar, Menu, MenuItem, Divider, Fab } from '@material-ui/core'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import AddCategoryDialog from './AddCategoryDialog'
import AddSubcategoryDialog from './AddSubcategoryDialog'
import CategoryService from '../../services/category'
import SnackMsg from '../common/SnackMsg'
import ConfirmDialog from '../common/ConfirmDialog'
import * as CategoryActions from './actions/categoryActions'
import { CategoryContext } from './CategoryContext'

const useStyles = makeStyles(theme => ({
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: '#d8ebf7',
        borderRadius: '5px',
        marginBottom: '16px',
        fontSize: '0.875rem'
    }
}))

const CategoryToolbar = React.memo(() => {
    const classes = useStyles()
    const snackRef = useRef(null)
    const { categoryState, categoryDispatch, getCategories } = useContext(CategoryContext)
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false)

    // Open the toolbar menu
    const handleClickMenu = (event) => {
        setMenuAnchorEl(event.currentTarget)
    }

    // Close the toolbar menu
    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    }

    // Show the add category dialog
    const showAddCategoryDialog = () => {
        handleCloseMenu()
        setOpenAddCategoryDialog(true)
    }

    // Show the add subcategory dialog
    const showAddSubcategoryDialog = () => {
        handleCloseMenu()        
        categoryDispatch(CategoryActions.showAddSubcategoryDialog())
    }

    // Close the add category dialog, select this category in the table, and retrieve the category list again
    const handleCloseAddCategoryDialog = (newCategory) => {
        setOpenAddCategoryDialog(false)
        if (newCategory) { 
            categoryDispatch(CategoryActions.addCategory(newCategory))           
            getCategories()
            snackRef.current.show(false, 'Category added successfully')
        }
    }

    // Close the add subcategory dialog and retrieve the category list again
    const handleCloseAddSubcategoryDialog = (newSubcategory) => {
        categoryDispatch(CategoryActions.closeAddSubcategoryDialog())       
        if (newSubcategory) {
            getCategories()
            if (!isExpanded(newSubcategory.parentCategoryId)) {
                categoryDispatch(CategoryActions.resetExpandedCategoryRows(newSubcategory.parentCategoryId))                
            }
            snackRef.current.show(false, 'Subcategory added successfully')
        }
    }

    // Determines if the specified category is currently expanded
    const isExpanded = (categoryId) => {        
        return categoryState.expandedRowIds.filter(itemId => itemId === categoryId).length > 0
    }

    // Expand all categories in the tree
    const handleExpandAll = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActions.expandAllCategories())        
    }

    // Collapse all categories in the tree
    const handleCollapseAll = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActions.collapseAllCategories())        
    }

    // Open the confirm delete dialog
    const confirmDelete = () => {
        handleCloseMenu()
        categoryDispatch(CategoryActions.confirmDelete())        
    }

    // Cancel the confirm delete dialog
    const handleCancelConfirm = () => {
        categoryDispatch(CategoryActions.cancelConfirmDelete())        
    }
    
    // Delete the selected Category or Subcategory   
    const handleDelete = () => {
        handleCancelConfirm()        
        if (categoryState.selectedSubcategory) {
            deleteSubcategory()
        } else {
            deleteCategory()
        }
    }
    
    // Delete the selected Category   
    const deleteCategory = () => {
        CategoryService.deleteCategory(categoryState.selectedCategory._id).then(() => {
            categoryDispatch(CategoryActions.deleteCategory())            
            getCategories()
            snackRef.current.show(false, 'Category deleted successfully')
        }).catch((error) => {
            console.error('Error deleting category:', error)            
            if (error && error.data && error.data === 'Category in use') {
                snackRef.current.show(true, 'Category cannot be deleted because it is already assigned to expenses')
            } else {
                snackRef.current.show(true, 'Error deleting the category')
            }
        })
    }
    
     // Delete the subcategory from the category object and then save the category    
    const deleteSubcategory = () => {
        let idx = categoryState.categories.findIndex((cat) => cat.treeId === categoryState.selectedSubcategory.parentTreeId)
        if (idx !== -1) {
            // Remove the subcategory from the category object
            const category = categoryState.categories[idx]
            idx = category.subcategories.findIndex((subcat) => subcat.treeId === categoryState.selectedSubcategory.treeId)
            if (idx !== -1) {
                category.subcategories.splice(idx, 1)
            }

            // Save the category to the db
            CategoryService.updateCategory(category).then((cat) => {  
                categoryDispatch(CategoryActions.deleteSubcategory(cat))                           
                getCategories()
                snackRef.current.show(false, "Subcategory deleted successfully")
            }).catch((error) => {
                console.error('Error deleting subcategory:', error)
                snackRef.current.show(true, 'Error deleting the subcategory')
            })
        }
    }
    
    return (
        <>
            <Toolbar className={classes.toolbar}>
                <Fab size="small" color="primary" onClick={handleClickMenu} className={classes.menuButton}
                    margin="dense" title="Menu">
                    <MoreVertIcon />
                </Fab>              
                <Menu id="category-menu" anchorEl={menuAnchorEl} keepMounted
                    open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <MenuItem key="1" onClick={showAddCategoryDialog}>Add Category</MenuItem>
                    <MenuItem key="2" onClick={showAddSubcategoryDialog}>Add Subcategory</MenuItem>
                    <MenuItem key="3" onClick={confirmDelete}>Delete</MenuItem>
                    <Divider />
                    <MenuItem key="4" onClick={handleExpandAll}>Expand All Categories</MenuItem>
                    <MenuItem key="5" onClick={handleCollapseAll}>Collapse All Categories</MenuItem>
                </Menu>
            </Toolbar>

            <AddCategoryDialog open={openAddCategoryDialog} onClose={handleCloseAddCategoryDialog} />
            
            <AddSubcategoryDialog open={categoryState.openAddSubcategoryDialog} onClose={handleCloseAddSubcategoryDialog}
                category={categoryState.selectedCategory} />

            <ConfirmDialog open={categoryState.openConfirmDeleteDialog}
                title="Confirm Delete" msg="Are you sure you want to delete the selected item?"
                onCancel={handleCancelConfirm} onConfirm={handleDelete} />

            <SnackMsg ref={snackRef} />
        </>
    )
})

export default CategoryToolbar
