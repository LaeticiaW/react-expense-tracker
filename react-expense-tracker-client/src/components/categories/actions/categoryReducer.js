import * as CategoryActions from './categoryActions'

export default function categoryReducer(state, action) {
    switch (action.type) {
        case CategoryActions.ADD_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedSubcategory: null,
                selectedItemIds: [action.payload.category._id]
            }
        case CategoryActions.CANCEL_CONFIRM_DELETE:
            return {
                ...state,
                openConfirmDeleteDialog: false
            }
        case CategoryActions.CLOSE_ADD_SUBCATEGORY_DIALOG:
            return {
                ...state,
                openAddSubcategoryDialog: false
            }
        case CategoryActions.COLLAPSE_ALL_CATEGORIES:
            return {
                ...state,
                expandedRowIds: []
            }
        case CategoryActions.COLLAPSE_CATEGORY_WITH_SELECTED_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: null,
                selectedCategory: state.categoryMap[state.selectedSubcategory.parentCategoryId],
                selectedItemIds: [state.selectedSubcategory.parentCategoryId]
            }
        case CategoryActions.CONFIRM_DELETE:
            return {
                ...state,
                openConfirmDeleteDialog: true
            }
        case CategoryActions.DELETE_CATEGORY:
            return {
                ...state,
                selectedCategory: null
            }
        case CategoryActions.DELETE_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: null,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id]
            }
        case CategoryActions.EXPAND_CATEGORY_ROWS:
            return {
                ...state,
                expandedRowIds: action.payload.expandedRowIds
            }
        case CategoryActions.EXPAND_ALL_CATEGORIES:
            return {
                ...state,
                expandedRowIds: state.categories.map(cat => cat._id)
            }
        case CategoryActions.INITIAL_SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id],
            }
        case CategoryActions.RESET_EXPANDED_CATEGORY_ROWS:
            return {
                ...state,
                expandedRowIds: state.expandedRowIds.concat([action.categoryId])
            }
        case CategoryActions.RESET_SELECTED_CATEGORY:
            return {
                ...state,
                selectedCategory: state.categoryMap[state.selectedCategory._id]
            }
        case CategoryActions.RESET_SELECTED_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: state.subcategoryMap[state.selectedSubcategory.id]
            }
        case CategoryActions.SELECT_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id],
                selectedSubcategory: null
            }
        case CategoryActions.SELECT_SUBCATEGORY:
            return {
                ...state,
                selectedSubcategory: action.payload.subcategory,
                selectedItemIds: [action.payload.subcategory.id],
                selectedCategory: null
            }
        case CategoryActions.SHOW_ADD_SUBCATEGORY_DIALOG:
            return {
                ...state,
                openAddSubcategoryDialog: true
            }
        case CategoryActions.SET_CATEGORY_DATA:
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