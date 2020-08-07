import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TreeDataState, CustomTreeData, SelectionState } from '@devexpress/dx-react-grid'
import { Grid, Table, TableTreeColumn, TableSelection } from '@devexpress/dx-react-grid-material-ui'
import { IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'
import ActionCell from '../common/ActionCell'

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

export default React.memo(function CategoryTable({ tableState, updateTableState, updateToolbarState,
    categories, categoryMap, subcategoryMap }) {

    const classes = useStyles()
    const prevSelectedItemId = null

    // When the category list is first retrieved, set the selected category.  Every time the category list
    // changes, reset the selected category and subcategory to the current data.

    useEffect(() => {
        if (categories.length && !tableState.selectedCategory && !tableState.selectedSubcategory) {
            updateTableState({
                selectedCategory: categories[0],
                selectedItemIds: [categories[0]._id]
            })
        } else {
            // Reset the selected category and subcategory so that the reference matches the categories list
            if (tableState.selectedCategory) {
                updateTableState({
                    selectedCategory: categoryMap[tableState.selectedCategory._id]
                })
            }
            if (tableState.selectedSubcategory) {
                updateTableState({
                    selectedSubcategory: subcategoryMap[tableState.selectedSubcategory.id]
                })
            }
        }
    }, [categories, categoryMap, subcategoryMap, updateTableState])

    
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

        const selectedItem = categoryMap[selectedItemId] || subcategoryMap[selectedItemId]

        if (selectedItem) {
            if (isSubcategory(selectedItem)) {
                updateTableState({
                    selectedCategory: null,
                    selectedSubcategory: selectedItem,
                    selectedItemIds: [selectedItem.id]
                })
            } else {
                updateTableState({
                    selectedCategory: selectedItem,
                    selectedSubcategory: null,
                    selectedItemIds: [selectedItem._id]
                })
            }
        }
    }

    // Maintain the expanded row ids when the user expands or collapses a category.  If the current selected item
    // is a subcategory, but the user is collapsing the parent category, change the selection to the parent category 
    const handleExpandedRowsChange = (expandedRowIds) => {
        if (tableState.selectedSubcategory) {
            if (!expandedRowIds.includes(tableState.selectedSubcategory.parentCategoryId)) {
                updateTableState({
                    selectedSubcategory: null,
                    selectedCategory: categoryMap[tableState.selectedSubcategory.parentCategoryId],
                    selectedItemIds: [tableState.selectedSubcategory.parentCategoryId]
                })
            }
        }

        setExpandedRowIds(expandedRowIds)
    }

    // Show the add subcategory dialog
    const showAddSubcategoryDialog = () => {
        updateToolbarState({ openAddSubcategoryDialog: true })
    }

    // Set the expanded row ids
    const setExpandedRowIds = (expandedRowIds) => {
        updateTableState({ expandedRowIds: expandedRowIds })
    }

    // Open the Confirm Delete dialog
    const confirmDelete = () => {
        updateToolbarState({ confirmDialogOpen: true })
    }

    // Cell component with custom Actions cell
    const Cell = (props) => {
        const columnName = props.column.name
        const item = props.row
        const isCategory = !!item._id

        let isSelectedItem = false
        if (isCategory) {
            isSelectedItem = tableState.selectedCategory && item._id === tableState.selectedCategory._id
        } else {
            isSelectedItem = tableState.selectedSubcategory && item.id === tableState.selectedSubcategory.id
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
        <Grid rows={categories} columns={columns} getRowId={getRowId}>
            <SelectionState selection={tableState.selectedItemIds} onSelectionChange={handleItemSelected} />
            <TreeDataState expandedRowIds={tableState.expandedRowIds} onExpandedRowIdsChange={handleExpandedRowsChange} />
            <CustomTreeData getChildRows={getChildRows} />
            <Table columnExtensions={columnExtensions} cellComponent={Cell} />
            <TableSelection selectByRowClick highlightRow showSelectionColumn={false} />
            <TableTreeColumn for="name" />
        </Grid>
    )
}, (prevProps, nextProps) => {
    return prevProps.categories === nextProps.categories && prevProps.tableState === nextProps.tableState
})
