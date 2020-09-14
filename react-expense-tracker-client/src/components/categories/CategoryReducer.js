export default function categoryReducer(state, action) {    
    switch (action.type) {
        case 'set-category-data':
            return {
                ...state,
                categories: action.payload.categories,
                categoryMap: action.payload.categoryMap,
                subcategoryMap: action.payload.subcategoryMap
            }
        case 'add-category': 
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedSubcategory: null,
                selectedItemIds: [action.payload.category._id]
            } 
        case 'update-category':
            return {
                ...state
            }     
        case 'show-add-subcategory-dialog':
            return {
                ...state,
                openAddSubcategoryDialog: true 
            } 
        case 'close-add-subcategory-dialog':
            return {
                ...state,
                openAddSubcategoryDialog: false
            } 
        case 'initial-select-category': 
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id],
            }            
        case 'select-category':
            return {
                ...state,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id],
                selectedSubcategory: null
            } 
        case 'select-subcategory':
            return {
                ...state,                
                selectedSubcategory: action.payload.subcategory,
                selectedItemIds: [action.payload.subcategory.id],
                selectedCategory: null
            }       
        case 'reset-selected-category':
            return {
                ...state,
                selectedCategory: state.categoryMap[state.selectedCategory._id]
            }   
        case 'reset-selected-subcategory':
            return {
                ...state,
                selectedSubcategory: state.subcategoryMap[state.selectedSubcategory.id]
            }     
        case 'delete-subcategory':
            return {
                ...state,
                selectedSubcategory: null,
                selectedCategory: action.payload.category,
                selectedItemIds: [action.payload.category._id]
            }
        case 'delete-category':
            return {
                ...state,
                selectedCategory: null
            }
        case 'confirm-delete':
            return {
                ...state,
                openConfirmDeleteDialog: true
            }
        case 'cancel-confirm-delete':
            return {
                ...state,
                openConfirmDeleteDialog: false
            }        
        case 'expand-rows':
            return {
                ...state,
                expandedRowIds: action.payload.expandedRowIds
            }    
        case 'expand-all':
            return {
                ...state,
                expandedRowIds: state.categories.map(cat => cat._id) 
            }   
        case 'collapse-all':
            return {
                ...state,
                expandedRowIds: []
            } 
        case 'collapse-category-with-selected-subcategory':
            return {
                ...state,
                selectedSubcategory: null,
                selectedCategory: state.categoryMap[state.selectedSubcategory.parentCategoryId],
                selectedItemIds: [state.selectedSubcategory.parentCategoryId]
            }    
        case 'reset-expanded-rows':
            return {
                ...state,
                expandedRowIds: state.expandedRowIds.concat([action.categoryId])
            }                        
        default:
            console.error('CategoryReducer error, unknown action type:', action.type)            
    }
}