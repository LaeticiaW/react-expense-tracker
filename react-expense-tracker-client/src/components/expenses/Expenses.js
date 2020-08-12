import React, { useState, useEffect, useRef, useCallback } from 'react'
import PageHeader from '../common/PageHeader'
import TableFilter from '../common/TableFilter'
import ExpensesTable from './ExpensesTable'
import ExpenseDialog from './ExpenseDialog'
import { Fab } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import CategoryService from '../../services/category'
import ExpenseService from '../../services/expense'
import DateRangeInput from '../common/DateRangeInput'
import CategorySelect from '../common/CategorySelect'
import SnackMsg from '../common/SnackMsg'
import moment from 'moment'

export default React.memo(function Expenses() {
    const snackRef = useRef(null)

    const [state, setState] = useState({
        expenses: [],
        selectCategories: [],
        categoryMap: {},
        dialogOpen: false,
        dialogExpense: null
    })
    const [filter, setFilter] = useState({
        categoryIds: [],
        startDate: moment().startOf('year').format('YYYY-MM-DD'),
        startDateMs: moment().startOf('year').valueOf(),
        endDate: moment().endOf('day').format('YYYY-MM-DD'),
        endDateMs: moment().endOf('day').valueOf()
    })

    // Update state
    const updateState = (newState) => {        
        setState(state => ({ ...state, ...newState }))        
    }

    // Update the filter state
    const updateFilter = (newFilter) => {        
        setFilter(filter => ({ ...filter, ...newFilter }))       
    }

    // Retrieve the categories for the select
    const getCategorySelect = useCallback(() => {
        return CategoryService.getCategorySelect().then((selectCategories) => {
            const categoryMap = selectCategories.reduce((map, cat) => {
                map[cat.value] = cat.label
                return map
            }, {})
            updateState({ selectCategories: selectCategories, categoryMap: categoryMap })
        }).catch((error) => {
            console.error('Error retrieving select categories:', error)
            snackRef.current.show(true, 'Error retrieving category select data')
        })
    }, [])

    // Retrieve the expenses whenever the filter changes
    const getExpenses = useCallback(() => {
        return ExpenseService.getExpenses(filter, state.categoryMap).then((expenses) => {
            updateState({ expenses: expenses })
        }).catch((error) => {
            console.error('Error retrieving expenses:', error)
            snackRef.current.show(true, 'Error retrieving expenses')
        })
    }, [filter])

    // Retrieve category and expense data on mount and whenever the user changes the filter criteria
    useEffect(() => {        
        getCategorySelect()        
        getExpenses()
    }, [filter, getCategorySelect, getExpenses])

    // Open the create expense dialog
    const handleOpenDialog = () => {
        updateState({ dialogExpense: null, dialogOpen: true })
    }

    // Close the create expense dialog
    const handleCloseDialog = useCallback((refresh) => {
        updateState({ dialogOpen: false })
        if (refresh) {
            snackRef.current.show(false, 'Expense added successfully')
            getExpenses()
        }
    }, [getExpenses])

    // Update filter state when a date changes
    const handleDateChange = useCallback((startDate, startDateMs, endDate, endDateMs) => {
        updateFilter({
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        })
    }, [])

    // Update filter state when the category changes
    const handleCategoryChange = useCallback((categoryIds) => {
        updateFilter({ categoryIds: categoryIds })
    }, [])

    // Close the expense dialog after an expense is updated, and retrieve the expenses list again
    const handleUpdate = useCallback(() => {
        updateState({ dialogOpen: false })
        snackRef.current.show(false, 'Expense updated successfully')
        getExpenses()
    }, [getExpenses])

    // Delete an expense
    const handleDelete = useCallback((expense) => {
        ExpenseService.deleteExpense(expense._id).then(() => {
            getExpenses()
            snackRef.current.show(false, 'Expense deleted successfully')
        }).catch((error) => {
            console.error('Error deleting expense:', error)
            snackRef.current.show(true, 'Error deleting the expense')
        })
    }, [getExpenses])

    // Render function for the filter inputs
    const renderFilterInputs = () => {
        return (
            <div>
                <DateRangeInput startDate={filter.startDate} endDate={filter.endDate} handleDateChange={handleDateChange} />
                <CategorySelect selectCategories={state.selectCategories} categoryMap={state.categoryMap} handleCategoryChange={handleCategoryChange} />
            </div>
        )
    }

    // Render function for the filter actions
    const renderFilterActions = () => {
        return (
            <div>
                <Fab size="small" color="primary" onClick={handleOpenDialog} className="add-expense-btn"
                    margin="dense" title="Add Expense" role="button">
                    <AddIcon />
                </Fab>
            </div>
        )
    }
  
    return (
        <div>
            <PageHeader pageTitle="Manage Expenses" />
            <TableFilter renderInputs={renderFilterInputs} renderActions={renderFilterActions} />
            <ExpensesTable expenses={state.expenses} handleUpdate={handleUpdate} handleDelete={handleDelete} />
            {state.dialogOpen &&
                <ExpenseDialog open={state.dialogOpen} handleClose={handleCloseDialog} dialogExpense={state.dialogExpense} />
            }
            <SnackMsg ref={snackRef} />
        </div>
    )
})
