import React, { useState } from 'react'
import {TextField, MenuItem} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({    
    categorySelect: {
        marginRight: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '5px'      
    }
}))

export default React.memo(function CategorySelect({ selectCategories, categoryMap, handleCategoryChange }) {
    const classes = useStyles()

    const [categoryIds, setCategoryIds] = useState([])

    // Update state when a category is selected
    const handleChange = (event) => {
        const categoryIds = event.target.value
        setCategoryIds(event.target.value)
        handleCategoryChange(categoryIds)
    }

    // Override how the selected categories are displayed 
    const renderSelectedCategories = (values) => {
        const otherCount = values.length > 1 ? '(+ ' + (values.length - 1) + ')' : ''
        return (
            <div>{categoryMap[values[0]]} {otherCount}</div>
        )
    }

    return (
        <TextField select id="categoryIds" name="categoryIds"
            className={classes.categorySelect}            
            SelectProps={{
                multiple: true, value: categoryIds, onChange: handleChange,
                renderValue: renderSelectedCategories,
                MenuProps: {
                    anchorOrigin: { vertical: 'top', horizontal: 'center'},                  
                    className: classes.menu
                }
            }}
            label="Category" value={categoryIds} onChange={handleChange}
            variant="outlined" margin="dense">        
            {
                selectCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                        {category.label}
                    </MenuItem>
                ))
            }
        </TextField >
    )
})