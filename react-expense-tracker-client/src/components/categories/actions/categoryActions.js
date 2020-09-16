export const ADD_CATEGORY = 'ADD_CATEGORY'
export const CANCEL_CONFIRM_DELETE = 'CANCEL_CONFIRM_DELETE'
export const CLOSE_ADD_SUBCATEGORY_DIALOG = 'CLOSE_ADD_SUBCATEGORY_DIALOG'
export const COLLAPSE_ALL_CATEGORIES = 'COLLAPSE_ALL_CATEGORIES'
export const COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY = 'COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY'
export const CONFIRM_DELETE = 'CONFIRM_DELETE'
export const DELETE_CATEGORY = 'DELETE_CATEGORY'
export const DELETE_SUBCATEGORY = 'DELETE_SUBCATEGORY'
export const EXPAND_ALL_CATEGORIES = 'EXPAND_ALL_CATEGORIES'
export const EXPAND_CATEGORY_ROWS = 'EXPAND_CATEGORY_ROWS'
export const INITIAL_SELECT_CATEGORY = 'INITIAL_SELECT_CATEGORY'
export const RESET_EXPANDED_CATEGORY_ROWS = 'RESET_EXPANDED_CATEGORY_ROWS'
export const RESET_SELECTED_CATEGORY = 'RESET_SELECTED_CATEGORY'
export const RESET_SELECTED_SUBCATEGORY = 'RESET_SELECTED_SUBCATEGORY'
export const SELECT_CATEGORY = 'SELECT_CATEGORY'
export const SELECT_SUBCATEGORY = 'SELECT_SUBCATEGORY'
export const SET_CATEGORY_DATA = 'SET_CATEGORY_DATA'
export const SHOW_ADD_SUBCATEGORY_DIALOG = 'SHOW_ADD_SUBCATEGORY_DIALOG'

export function addCategory(category) {    
    return {
        type: ADD_CATEGORY,
        payload: {
            category
        }
    }
}

export function cancelConfirmDelete() {
    return {
        type: CANCEL_CONFIRM_DELETE        
    }
}

export function closeAddSubcategoryDialog() {
    return {
        type: CLOSE_ADD_SUBCATEGORY_DIALOG        
    }
}

export function collapseAllCategories() {
    return {
        type: COLLAPSE_ALL_CATEGORIES       
    }
}

export function collapseCategoryWithSelectedSubcategory() {
    return {
        type: COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY        
    }
}

export function confirmDelete() {   
    return {
        type: CONFIRM_DELETE
    }
}

export function deleteCategory() {
    return {
        type: DELETE_CATEGORY
    }
}

export function deleteSubcategory(category) {
    return {
        type: DELETE_SUBCATEGORY,
        payload: {
            category
        }
    }
}

export function expandAllCategories() {
    return {
        type: EXPAND_ALL_CATEGORIES
    }
}

export function expandCategoryRows(expandedRowIds) {
    return {
        type: EXPAND_CATEGORY_ROWS,
        payload: {
            expandedRowIds
        }
    }
}

export function initialSelectCategory(category) {
    return {
        type: INITIAL_SELECT_CATEGORY,
        payload: {
            category
        }
    }
}

export function resetExpandedCategoryRows(categoryId) {
    return {
        type: RESET_EXPANDED_CATEGORY_ROWS,
        payload: {
            categoryId
        }
    }
}

export function resetSelectedCategory() {
    return {
        type: RESET_SELECTED_CATEGORY
    }
}

export function resetSelectedSubcategory() {
    return {
        type: RESET_SELECTED_SUBCATEGORY
    }
}

export function selectCategory(category) {
    return {
        type: SELECT_CATEGORY,
        payload: {
            category
        }
    }
}

export function selectSubcategory(subcategory) {
    return {
        type: SELECT_SUBCATEGORY,
        payload: {
            subcategory
        }
    }
}

export function setCategoryData(categories, categoryMap, subcategoryMap) {
    return {
        type: SET_CATEGORY_DATA,
        payload: {
            categories,
            categoryMap,
            subcategoryMap
        }    
    }
}

export function showAddSubcategoryDialog() {
    return {
        type: SHOW_ADD_SUBCATEGORY_DIALOG
    }
}
