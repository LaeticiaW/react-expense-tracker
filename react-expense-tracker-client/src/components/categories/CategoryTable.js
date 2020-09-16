import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TreeDataState, CustomTreeData, SelectionState } from '@devexpress/dx-react-grid'
import { Grid, Table, TableTreeColumn, TableSelection } from '@devexpress/dx-react-grid-material-ui'
import { IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import ActionCell from '../common/ActionCell'
import * as CategoryActions from './actions/categoryActions'

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

export default React.memo(function CategoryTable({ dispatch, state }) {
    const classes = useStyles()
    const prevSelectedItemId = null

    // When the category list is first retrieved, set the selected category.  Every time the category list
    // changes, reset the selected category and subcategory to the current data.
    useEffect(() => {
        if (state.categories.length && !state.selectedCategory && !state.selectedSubcategory) {
            dispatch(CategoryActions.initialSelectCategory(state.categories[0]))           
        } else {
            // Reset the selected category and subcategory so that the reference matches the categories list
            if (state.selectedCategory) {
                dispatch(CategoryActions.resetSelectedCategory())                               
            }
            if (state.selectedSubcategory) {
                dispatch(CategoryActions.resetSelectedSubcategory())                
            }
        }
    }, [dispatch, state.categories, state.selectedCategory, state.selectedSubcategory])

    
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

        const selectedItem = state.categoryMap[selectedItemId] || state.subcategoryMap[selectedItemId]

        if (selectedItem) {
            if (isSubcategory(selectedItem)) {
                dispatch(CategoryActions.selectSubcategory(selectedItem))                
            } else {
                dispatch(CategoryActions.selectCategory(selectedItem))                
            }
        }
    }

    // Maintain the expanded row ids when the user expands or collapses a category.  If the current selected item
    // is a subcategory, but the user is collapsing the parent category, change the selection to the parent category 
    const handleExpandedRowsChange = (expandedRowIds) => {
        if (state.selectedSubcategory) {
            if (!expandedRowIds.includes(state.selectedSubcategory.parentCategoryId)) {
                dispatch(CategoryActions.collapseCategoryWithSelectedSubcategory())                
            }
        }
        setExpandedRowIds(expandedRowIds)
    }

    // Show the add subcategory dialog
    const showAddSubcategoryDialog = () => {
        dispatch(CategoryActions.showAddSubcategoryDialog())        
    }

    // Set the expanded row ids
    const setExpandedRowIds = (expandedRowIds) => {
        dispatch(CategoryActions.expandCategoryRows(expandedRowIds))        
    }

    // Open the Confirm Delete dialog
    const confirmDelete = () => {
        dispatch(CategoryActions.confirmDelete())       
    }

    // Cell component with custom Actions cell
    const Cell = (props) => {
        const columnName = props.column.name
        const item = props.row
        const isCategory = !!item._id

        let isSelectedItem = false
        if (isCategory) {
            isSelectedItem = state.selectedCategory && item._id === state.selectedCategory._id
        } else {
            isSelectedItem = state.selectedSubcategory && item.id === state.selectedSubcategory.id
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
        <Grid rows={state.categories} columns={columns} getRowId={getRowId}>
            <SelectionState selection={state.selectedItemIds} onSelectionChange={handleItemSelected} />
            <TreeDataState expandedRowIds={state.expandedRowIds} onExpandedRowIdsChange={handleExpandedRowsChange} />
            <CustomTreeData getChildRows={getChildRows} />
            <Table columnExtensions={columnExtensions} cellComponent={Cell} />
            <TableSelection selectByRowClick highlightRow showSelectionColumn={false} />
            <TableTreeColumn for="name" />
        </Grid>
    )
})
