import * as ActionTypes from './categoryActionType'

export const CategoryInitialState = {
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

export default function categoryReducer(state, action) {
    switch (action.type) {
        case ActionTypes.ADD_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedSubcategory: null,
                selectedItemIds: [action.payload.category._id]
            }
        case ActionTypes.CANCEL_CONFIRM_DELETE:
            return {
                ...state,
                openConfirmDeleteDialog: false
            }
        case ActionTypes.CLOSE_ADD_SUBCATEGORY_DIALOG:
            return {
                ...state,
                openAddSubcategoryDialog: false
            }
        case ActionTypes.COLLAPSE_ALL_CATEGORIES:
            return {
                ...state,
                expandedRowIds: []
            }
        case ActionTypes.COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: null,
                selectedCategory: state.categoryMap[state.selectedSubcategory.parentCategoryId],
                selectedItemIds: [state.selectedSubcategory.parentCategoryId]
            }
        case ActionTypes.CONFIRM_DELETE:
            return {
                ...state,
                openConfirmDeleteDialog: true
            }
        case ActionTypes.DELETE_CATEGORY:
            return {
                ...state,
                selectedCategory: null
            }
        case ActionTypes.DELETE_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: null,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id]
            }
        case ActionTypes.EXPAND_CATEGORY_ROWS:
            return {
                ...state,
                expandedRowIds: action.payload.expandedRowIds
            }
        case ActionTypes.EXPAND_ALL_CATEGORIES:
            return {
                ...state,
                expandedRowIds: state.categories.map(cat => cat._id)
            }
        case ActionTypes.INITIAL_SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id],
            }
        case ActionTypes.RESET_EXPANDED_CATEGORY_ROWS:
            return {
                ...state,
                expandedRowIds: state.expandedRowIds.concat([action.categoryId])
            }
        case ActionTypes.RESET_SELECTED_CATEGORY:
            return {
                ...state,
                selectedCategory: state.categoryMap[state.selectedCategory._id]
            }
        case ActionTypes.RESET_SELECTED_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: state.subcategoryMap[state.selectedSubcategory.id]
            }
        case ActionTypes.SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id],
                selectedSubcategory: null
            }
        case ActionTypes.SELECT_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: action.payload.subcategory,
                selectedItemIds: [action.payload.subcategory.id],
                selectedCategory: null
            }
        case ActionTypes.SHOW_ADD_SUBCATEGORY_DIALOG:
            return {
                ...state,
                openAddSubcategoryDialog: true
            }
        case ActionTypes.SET_CATEGORY_DATA:
            return {
                ...state,
                categories: action.payload.categories,
                categoryMap: action.payload.categoryMap,
                subcategoryMap: action.payload.subcategoryMap
            }
        default:
            console.error('CategoryReducer error, unknown action type:', action.type)
    }
}