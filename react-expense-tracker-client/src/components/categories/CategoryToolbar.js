import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Toolbar, Menu, MenuItem, Divider, Fab } from '@material-ui/core'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import AddCategoryDialog from './AddCategoryDialog'
import AddSubcategoryDialog from './AddSubcategoryDialog'
import CategoryService from '../../services/category'
import SnackMsg from '../common/SnackMsg'
import ConfirmDialog from '../common/ConfirmDialog'

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

export default React.memo(function CategoryToolbar({ tableState, updateTableState, toolbarState, updateToolbarState,
    categories, getCategories }) {

    const classes = useStyles()
    const snackRef = useRef(null)

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
        updateToolbarState({ openAddSubcategoryDialog: true })
    }

    // Close the add category dialog, select this category in the table, and retrieve the category list again
    const handleCloseAddCategoryDialog = (newCategory) => {
        setOpenAddCategoryDialog(false)
        if (newCategory) {
            updateTableState({
                selectedCategory: newCategory,
                selectedSubcategory: null,
                selectedItemIds: [newCategory._id]
            })
            getCategories()
            snackRef.current.show(false, 'Category added successfully')
        }
    }

    // Close the add subcategory dialog and retrieve the category list again
    const handleCloseAddSubcategoryDialog = (newSubcategory) => {
        updateToolbarState({ openAddSubcategoryDialog: false })
        if (newSubcategory) {
            getCategories()
            if (!isExpanded(newSubcategory.parentCategoryId)) {
                updateTableState({ expandedRowIds: tableState.expandedRowIds.concat([newSubcategory.parentCategoryId]) })
            }
            snackRef.current.show(false, 'Subcategory added successfully')
        }
    }

    // Determines if the specified category is currently expanded
    const isExpanded = (categoryId) => {
        return tableState.expandedRowIds.filter(item => item._id === categoryId).length > 0
    }

    // Expand all categories in the tree
    const handleExpandAll = () => {
        handleCloseMenu()
        updateTableState({ expandedRowIds: categories.map(cat => cat._id) })
    }

    // Collapse all categories in the tree
    const handleCollapseAll = () => {
        handleCloseMenu()
        updateTableState({ expandedRowIds: [] })
    }

    // Open the confirm delete dialog
    const confirmDelete = () => {
        handleCloseMenu()
        updateToolbarState({ confirmDialogOpen: true })
    }

    // Cancel the confirm delete dialog
    const handleCancelConfirm = () => {
        updateToolbarState({ confirmDialogOpen: false })
    }
    
    // Delete the selected Category or Subcategory   
    const handleDelete = () => {
        updateToolbarState({ confirmDialogOpen: false })
        if (tableState.selectedSubcategory) {
            deleteSubcategory()
        } else {
            deleteCategory()
        }
    }
    
    // Delete the selected Category   
    const deleteCategory = () => {
        CategoryService.deleteCategory(tableState.selectedCategory._id).then(() => {
            updateTableState({ selectedCategory: null })
            getCategories()
            snackRef.current.show(false, 'Category deleted successfully')
        }).catch((error) => {
            console.error('Error deleting category:', error)
            console.error('Error deleting category2:', error.data)
            if (error && error.data && error.data === 'Category in use') {
                snackRef.current.show(true, 'Category cannot be deleted because it is already assigned to expenses')
            } else {
                snackRef.current.show(true, 'Error deleting the category')
            }
        })
    }
    
     // Delete the subcategory from the category object and then save the category    
    const deleteSubcategory = () => {
        let idx = categories.findIndex((cat) => cat.treeId === tableState.selectedSubcategory.parentTreeId)
        if (idx !== -1) {
            // Remove the subcategory from the category object
            const category = categories[idx]
            idx = category.subcategories.findIndex((subcat) => subcat.treeId === tableState.selectedSubcategory.treeId)
            if (idx !== -1) {
                category.subcategories.splice(idx, 1)
            }

            // Save the category to the db
            CategoryService.updateCategory(category).then((cat) => {               
                updateTableState({
                    selectedSubcategory: null,
                    selectedCategory: cat,
                    selectedItemIds: [cat._id]
                })
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
            <AddSubcategoryDialog open={toolbarState.openAddSubcategoryDialog} onClose={handleCloseAddSubcategoryDialog}
                category={tableState.selectedCategory} />

            <ConfirmDialog open={toolbarState.confirmDialogOpen}
                title="Confirm Delete" msg="Are you sure you want to delete the selected item?"
                onCancel={handleCancelConfirm} onConfirm={handleDelete} />

            <SnackMsg ref={snackRef} />
        </>
    )
})
