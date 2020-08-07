import React, { useState, useEffect, useRef, useCallback } from 'react'
import PageHeader from '../common/PageHeader'
import TableFilter from '../common/TableFilter'
import SnackMsg from '../common/SnackMsg'
import DateRangeInput from '../common/DateRangeInput'
import moment from 'moment'
import ImportService from '../../services/import'
import ExpenseService from '../../services/expense'
import Fab from '@material-ui/core/Fab'
import ImportDialog from './ImportDialog'
import ImportsTable from './ImportsTable'
import PublishIcon from '@material-ui/icons/Publish'

export default React.memo(function Imports() {
    const snackRef = useRef(null)

    const [state, setState] = useState({
        imports: [],
        dialogOpen: false      
    })
    const [filter, setFilter] = useState({
        startDate: moment().startOf('year').format('YYYY-MM-DD'),
        startDateMs: moment().startOf('year').valueOf(),
        endDate: moment().endOf('day').format('YYYY-MM-DD'),
        endDateMs: moment().endOf('day').valueOf()
    })

    // Update state
    const updateState = useCallback((newState) => {
        setState(state => ({ ...state, ...newState }))
    }, [setState])

    // Update filter state
    const updateFilter = (newFilter) => {
        setFilter(filter => ({ ...filter, ...newFilter }))
    }
    
    // Retrieve the import summary list  
    const getImports = useCallback(() => {        
        ImportService.getImports(filter).then((imports) => {
            updateState({ imports: imports })
        }).catch((error) => {
            console.error('Error retrieving imports:', error)
            snackRef.current.show(true, 'Error retrieving imports')            
        })
    }, [filter, updateState])

    // Retrieve the imports list whenever the filter changes
    useEffect(() => {
        getImports()
    }, [filter, getImports])   
    
    // Delete the import summary and all associated expenses  
    const handleDelete = (importItem) => {
        ExpenseService.deleteExpensesByImportId(importItem._id).then(() => {
            snackRef.current.show(false, 'Imported expenses deleted successfully')
            getImports()
        }).catch((error) => {
            console.error('Error deleting imported expenses:', error)
            snackRef.current.show(true, 'Error deleting imported expense')
        })
    }

    // Open the import dialog
    const handleOpenDialog = useCallback(() => {
        updateState({ dialogOpen: true })
    }, [updateState])

    // Close the import dialog
    const handleCloseDialog = (refresh) => {
        if (refresh) {
            snackRef.current.show(false, 'Expenses imported successfully')
            getImports()
        }
        updateState({ dialogOpen: false })
    }

    // Save filter state when the filter dates change
    const handleDateChange = useCallback((startDate, startDateMs, endDate, endDateMs) => {
        updateFilter({
            startDate: startDate,
            startDateMs: startDateMs,
            endDate: endDate,
            endDateMs: endDateMs
        })
    }, [])

    // Render function for the filter inputs
    const renderFilterInputs = () => {
        return (
            <div>
                <DateRangeInput startDate={filter.startDate} endDate={filter.endDate} handleDateChange={handleDateChange} />
            </div>
        )
    }

    // Render function for the filter actions
    const renderFilterActions = () => {
        return (
            <>
                <Fab size="small" color="primary" onClick={handleOpenDialog} className="add-expense-btn"
                    margin="dense" title="Add Expense">
                    <PublishIcon />
                </Fab>
                <ImportDialog open={state.dialogOpen} handleClose={handleCloseDialog} />
            </>
        )
    }
    
    return (
        <div>            
            <PageHeader pageTitle="Imports" />
            <TableFilter renderInputs={renderFilterInputs} renderActions={renderFilterActions}/>           
            <ImportsTable imports={state.imports} handleDelete={handleDelete} />
            <SnackMsg ref={snackRef} />
        </div>
    )
})
