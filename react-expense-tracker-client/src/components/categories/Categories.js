import React, { useEffect, useRef, useCallback, useReducer } from 'react'
import PageHeader from '../common/PageHeader'
import { makeStyles } from '@material-ui/core/styles'
import CategoryService from '../../services/category'
import SnackMsg from '../common/SnackMsg'
import { Paper } from '@material-ui/core'
import CategoryDetails from './CategoryDetails'
import SubcategoryDetails from './SubcategoryDetails'
import CategoryTable from './CategoryTable'
import CategoryToolbar from './CategoryToolbar'
import CategoryReducer from './CategoryReducer'

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
    const initialState = {
        categories: [],
        categoryMap: {},
        subcategoryMap: {},
        selectedItemIds: [],
        expandedRowIds: [],
        selectedCategory: null,
        selectedSubcategory: null,
        parentCategory: null,
        openAddSubcategoryDialog: false,
        openConfirmDeleteDialog: false 
    }
    const [state, dispatch] = useReducer(CategoryReducer, initialState)  
      
    // Retrieve the category data
    const getCategories = useCallback(() => {             
        CategoryService.getCategoryInfo().then(({ categories, categoryMap, subcategoryMap }) => { 
            dispatch({type: 'set-category-data', payload: {
                categories: categories,
                categoryMap: categoryMap,
                subcategoryMap: subcategoryMap
            }})                          
        }).catch((error) => {
            console.error('Error retreiving categories:', error)
            snackRef.current.show(true, 'Error retrieving categories')
        })
    }, [])

    // Retrieve the categories when component first mounted
    useEffect(() => {
        getCategories()
    }, [getCategories])
        
    return (
        <>
            <PageHeader pageTitle="Categories" />

            <div className={classes.container}>

                {/* Left hand side panel with category tree */}
                <Paper elevation={2} className={classes.tree}>
                    <CategoryToolbar
                        dispatch={dispatch} 
                        state={state}                                             
                        getCategories={getCategories}/>

                    <CategoryTable
                        dispatch={dispatch}
                        state={state}/>
                </Paper>

                {/* Right hand side panel with category/subcategory details */}
                <div className={classes.details}>
                    {state.selectedCategory &&
                        <CategoryDetails category={state.selectedCategory} getCategories={getCategories} />}
                    {state.selectedSubcategory &&
                        <SubcategoryDetails subcategory={state.selectedSubcategory} getCategories={getCategories}
                            parentCategory={state.categoryMap[state.selectedSubcategory.parentCategoryId]} />}
                </div>
            </div>

            <SnackMsg ref={snackRef} />
        </>
    )
})
