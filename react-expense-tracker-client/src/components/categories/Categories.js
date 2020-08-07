import React, { useState, useEffect, useRef, useCallback } from 'react'
import PageHeader from '../common/PageHeader'
import { makeStyles } from '@material-ui/core/styles'
import CategoryService from '../../services/category'
import SnackMsg from '../common/SnackMsg'
import { Paper } from '@material-ui/core'
import CategoryDetails from './CategoryDetails'
import SubcategoryDetails from './SubcategoryDetails'
import CategoryTable from './CategoryTable'
import CategoryToolbar from './CategoryToolbar'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        position: 'relative',
        height: 'calc(100vh - 140px)'
    },
    tree: {
        flex: '0 0 320px',
        height: '100%',
        overflow: 'auto'
    },
    details: {
        height: 'calc(100vh - 140px)',
        marginLeft: '20px',
        width: '100%'
    }
}))

export default React.memo(function Categories() {
    const classes = useStyles()
    const snackRef = useRef(null)
    let init = useRef(null)

    // This component's state
    const [state, setState] = useState({
        categories: [],
        categoryMap: {},
        subcategoryMap: {},
        menuAnchorEl: null
    })

    // Lifted state for the CategoryTable component
    const [tableState, setTableState] = useState({
        selectedItemIds: [],
        expandedRowIds: [],
        selectedCategory: null,
        selectedSubcategory: null,
        parentCategory: null
    })

    // Lifted state for the CategoryToolbar component
    const [toolbarState, setToolbarState] = useState({
        openAddSubcategoryDialog: false,
        confirmDialogOpen: false
    })

    // Update state
    const updateState = useCallback((newState) => {
        setState(state => ({ ...state, ...newState }))
    }, [setState])

    // Update table state
    const updateTableState = useCallback((newState) => {
        setTableState(state => ({ ...state, ...newState }))
    }, [setTableState])

    // Update toolbar state
    const updateToolbarState = useCallback((newState) => {
        setToolbarState(state => ({ ...state, ...newState }))
    }, [setToolbarState])

    // Retrieve the category data
    const getCategories = useCallback(() => {        
        CategoryService.getCategoryInfo().then(({ categories, categoryMap, subcategoryMap }) => {
            if (!init.current) {
                init.current = true
                updateState({
                    categories: categories,
                    categoryMap: categoryMap,
                    subcategoryMap: subcategoryMap
                })
            } else {
                updateState({
                    categories: categories,
                    categoryMap: categoryMap,
                    subcategoryMap: subcategoryMap
                })
            }
        }).catch((error) => {
            console.error('Error retreiving categories:', error)
            snackRef.current.show(true, 'Error retrieving categories')
        })
    }, [updateState])

    // Retrieve the categories when component first mounted
    useEffect(() => {
        getCategories()
    }, [getCategories])
        
    return (
        <>
            <PageHeader pageTitle="Categories" />

            <div className={classes.container}>

                {/* Right hand side panel with category tree */}
                <Paper elevation={2} className={classes.tree}>
                    <CategoryToolbar
                        tableState={tableState}
                        updateTableState={updateTableState}
                        toolbarState={toolbarState}
                        updateToolbarState={updateToolbarState}
                        categories={state.categories}
                        getCategories={getCategories} />

                    <CategoryTable
                        tableState={tableState}
                        updateTableState={updateTableState}
                        updateToolbarState={updateToolbarState}
                        categories={state.categories}
                        categoryMap={state.categoryMap}
                        subcategoryMap={state.subcategoryMap} />
                </Paper>

                {/* Left hand side panel with category/subcategory details */}
                <div className={classes.details}>
                    {tableState.selectedCategory &&
                        <CategoryDetails category={tableState.selectedCategory} getCategories={getCategories} />}
                    {tableState.selectedSubcategory &&
                        <SubcategoryDetails subcategory={tableState.selectedSubcategory} getCategories={getCategories}
                            parentCategory={state.categoryMap[tableState.selectedSubcategory.parentCategoryId]} />}
                </div>
            </div>

            <SnackMsg ref={snackRef} />
        </>
    )
})
