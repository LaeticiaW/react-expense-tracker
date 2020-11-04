import React, { useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TreeDataState, CustomTreeData, SelectionState } from '@devexpress/dx-react-grid'
import { Grid, Table, TableTreeColumn, TableSelection } from '@devexpress/dx-react-grid-material-ui'
import { IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import ActionCell from '../common/ActionCell'
import * as CategoryActions from './actions/categoryActions'
import { CategoryContext } from './CategoryContext'

const useStyles = makeStyles(theme => ({
    icon: {
        fontSize: '16px !important'
    }
}))

const getChildRows = (row, rootRows) => (row ? row.subcategories : rootRows)
const getRowId = row => row.parentTreeId ? row.id : row._id

const columns = [
    { name: 'name' },
    { name: 'actions' }
]

const columnExtensions = [
    { columnName: 'name', width: 250 },
    { columnName: 'actions', width: 50 }
]

const CategoryTable = React.memo(() => {
    const classes = useStyles()
    const prevSelectedItemId = null
    const { categoryState, categoryDispatch } = useContext(CategoryContext)

    // When the category list is first retrieved, set the selected category.  Every time the category list
    // changes, reset the selected category and subcategory to the current data.
    useEffect(() => {
        if (categoryState.categories.length && !categoryState.selectedCategory && !categoryState.selectedSubcategory) {
            categoryDispatch(CategoryActions.initialSelectCategory(categoryState.categories[0]))           
        } else {
            // Reset the selected category and subcategory so that the reference matches the categories list
            if (categoryState.selectedCategory) {
                categoryDispatch(CategoryActions.resetSelectedCategory())                               
            }
            if (categoryState.selectedSubcategory) {
                categoryDispatch(CategoryActions.resetSelectedSubcategory())                
            }
        }
    }, [categoryDispatch, categoryState.categories, categoryState.selectedCategory, categoryState.selectedSubcategory])

    
    // Determine if the specified item is a category or a subcategory     
    const isSubcategory = (item) => {
        if (item.parentTreeId !== undefined) {
            return true
        }
        return false
    }

    // When an item is selected in the category tree, set the selected category or subcategory
    const handleItemSelected = (selectedItemIds) => {
        let selectedItemId = prevSelectedItemId
        if (selectedItemIds.length) {
            selectedItemId = selectedItemIds[selectedItemIds.length - 1]
        }

        const selectedItem = categoryState.categoryMap[selectedItemId] || categoryState.subcategoryMap[selectedItemId]

        if (selectedItem) {
            if (isSubcategory(selectedItem)) {
                categoryDispatch(CategoryActions.selectSubcategory(selectedItem))                
            } else {
                categoryDispatch(CategoryActions.selectCategory(selectedItem))                
            }
        }
    }

    // Maintain the expanded row ids when the user expands or collapses a category.  If the current selected item
    // is a subcategory, but the user is collapsing the parent category, change the selection to the parent category 
    const handleExpandedRowsChange = (expandedRowIds) => {
        if (categoryState.selectedSubcategory) {
            if (!expandedRowIds.includes(categoryState.selectedSubcategory.parentCategoryId)) {
                categoryDispatch(CategoryActions.collapseCategoryWithSelectedSubcategory())                
            }
        }
        setExpandedRowIds(expandedRowIds)
    }

    // Show the add subcategory dialog
    const showAddSubcategoryDialog = () => {
        categoryDispatch(CategoryActions.showAddSubcategoryDialog())        
    }

    // Set the expanded row ids
    const setExpandedRowIds = (expandedRowIds) => {
        categoryDispatch(CategoryActions.expandCategoryRows(expandedRowIds))        
    }

    // Open the Confirm Delete dialog
    const confirmDelete = () => {
        categoryDispatch(CategoryActions.confirmDelete())       
    }

    // Cell component with custom Actions cell
    const Cell = (props) => {
        const columnName = props.column.name
        const item = props.row
        const isCategory = !!item._id

        let isSelectedItem = false
        if (isCategory) {
            isSelectedItem = categoryState.selectedCategory && item._id === categoryState.selectedCategory._id
        } else {
            isSelectedItem = categoryState.selectedSubcategory && item.id === categoryState.selectedSubcategory.id
        }

        if (columnName === 'actions') {
            return (
                <ActionCell>
                    {isSelectedItem && isCategory &&
                        <IconButton size="small" onClick={showAddSubcategoryDialog}
                            className={classes.iconBtn}>
                            <AddIcon color="primary" className={classes.icon} />
                        </IconButton>
                    }
                    {isSelectedItem &&
                        <IconButton size="small" onClick={confirmDelete} className={classes.iconBtn}>
                            <DeleteIcon className={classes.icon} />
                        </IconButton>
                    }

                </ActionCell >
            )
        }
        return <Table.Cell {...props} />
    }
    
    return (
        <Grid rows={categoryState.categories} columns={columns} getRowId={getRowId}>
            <SelectionState selection={categoryState.selectedItemIds} onSelectionChange={handleItemSelected} />
            <TreeDataState expandedRowIds={categoryState.expandedRowIds} onExpandedRowIdsChange={handleExpandedRowsChange} />
            <CustomTreeData getChildRows={getChildRows} />
            <Table columnExtensions={columnExtensions} cellComponent={Cell} />
            <TableSelection selectByRowClick highlightRow showSelectionColumn={false} />
            <TableTreeColumn for="name" />
        </Grid>
    )
})

export default CategoryTable
