import PropTypes, { shape, number, string, bool, arrayOf, object, func, oneOfType } from 'prop-types'

export default PropTypes

export const SubcategoryType = shape({
    id: string,
    name: string,
    matchText: arrayOf(string),
    treeId: number,
    parentTreeId: number
})

export const CategoryType = shape({
    name: string,
    subcategories: arrayOf(SubcategoryType),
    treeId: number
})

export const CategoryStateType = shape({
    categories: arrayOf(CategoryType),
    categoryMap: object,
    subcategoryMap: object,
    selectedItemIds: arrayOf(string),
    expandedRowIds: arrayOf(string),
    selectedCategory: CategoryType,
    selectedSubcategory: SubcategoryType,
    parentCategory: CategoryType,
    openAddSubcategoryDialog: bool,
    openConfirmDeleteDialog: bool
})

export const ExpenseType = shape({
    _id: string,
    trxDate: string.isRequired,
    trxMonth: number,
    trxYear: number,
    categoryId: string,
    categoryName: string,
    subcategoryId: string,
    subcategoryName: string,
    amount: oneOfType([number, string]).isRequired,
    description: string.isRequired,
    importId: string

})

export const ExpenseSummaryType = shape({
    _id: shape({
        categoryId: string,
        subcategoryId: string
    }),
    categoryName: string,
    subcategoryName: string,
    totalAmount: number
})

export const DashletOptionsType = shape({
    x: number, 
    y: number, 
    i: string, 
    w: number,
    h: number,
    minW: number,
    minH: number,
    component: func, 
    dashletTitle: string 
})

export const ImportType = shape({
    importDate: string,
    fileName: string,
    description: string, 
    title: string,
    recordCount: number     
})
