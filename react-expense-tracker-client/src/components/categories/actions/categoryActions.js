import * as ActionTypes from './categoryActionType'

export function addCategory(category) {    
    return {
        type: ActionTypes.ADD_CATEGORY,
        payload: {
            category
        }
    }
}

export function cancelConfirmDelete() {
    return {
        type: ActionTypes.CANCEL_CONFIRM_DELETE        
    }
}

export function closeAddSubcategoryDialog() {
    return {
        type: ActionTypes.CLOSE_ADD_SUBCATEGORY_DIALOG        
    }
}

export function collapseAllCategories() {
    return {
        type: ActionTypes.COLLAPSE_ALL_CATEGORIES       
    }
}

export function collapseCategoryWithSelectedSubcategory() {
    return {
        type: ActionTypes.COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY        
    }
}

export function confirmDelete() {   
    return {
        type: ActionTypes.CONFIRM_DELETE
    }
}

export function deleteCategory() {
    return {
        type: ActionTypes.DELETE_CATEGORY
    }
}

export function deleteSubcategory(category) {
    return {
        type: ActionTypes.DELETE_SUBCATEGORY,
        payload: {
            category
        }
    }
}

export function expandAllCategories() {
    return {
        type: ActionTypes.EXPAND_ALL_CATEGORIES
    }
}

export function expandCategoryRows(expandedRowIds) {
    return {
        type: ActionTypes.EXPAND_CATEGORY_ROWS,
        payload: {
            expandedRowIds
        }
    }
}

export function initialSelectCategory(category) {
    return {
        type: ActionTypes.INITIAL_SELECT_CATEGORY,
        payload: {
            category
        }
    }
}

export function resetExpandedCategoryRows(categoryId) {
    return {
        type: ActionTypes.RESET_EXPANDED_CATEGORY_ROWS,
        payload: {
            categoryId
        }
    }
}

export function resetSelectedCategory() {
    return {
        type: ActionTypes.RESET_SELECTED_CATEGORY
    }
}

export function resetSelectedSubcategory() {
    return {
        type: ActionTypes.RESET_SELECTED_SUBCATEGORY
    }
}

export function selectCategory(category) {
    return {
        type: ActionTypes.SELECT_CATEGORY,
        payload: {
            category
        }
    }
}

export function selectSubcategory(subcategory) {
    return {
        type: ActionTypes.SELECT_SUBCATEGORY,
        payload: {
            subcategory
        }
    }
}

export function setCategoryData(categories, categoryMap, subcategoryMap) {
    return {
        type: ActionTypes.SET_CATEGORY_DATA,
        payload: {
            categories,
            categoryMap,
            subcategoryMap
        }    
    }
}

export function showAddSubcategoryDialog() {
    return {
        type: ActionTypes.SHOW_ADD_SUBCATEGORY_DIALOG
    }
}
