import React, { useState } from 'react'
import { Card, CardContent, Toolbar, Fab } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import UpdateCategoryDialog from './UpdateCategoryDialog'
import PropTypes, { CategoryType } from 'types'

const useStyles = makeStyles(theme => ({
    card: {
        height: '100%',
        overflow: 'auto'
    },
    contentRoot: {
        padding: '0px'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#d8ebf7',
        borderRadius: '5px',
        marginBottom: '16px'
    },
    contentContainer: {
        padding: '24px'
    },
    row: {
        display: 'flex',
        marginBottom: '16px'
    },
    label: {
        width: '200px',
        fontWeight: 'bold'
    }
}))

const CategoryDetails = React.memo(({ category, getCategories }) => {
    const classes = useStyles()

    const [openDialog, setOpenDialog] = useState(false)

    const handleShowDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        getCategories()
    }

    return (
        <>
            <Card className={classes.card} elevation={2}>
                <CardContent classes={{ root: classes.contentRoot }}>
                    <Toolbar className={classes.toolbar}>
                        <h3 className="detailsTitle">Category Details</h3>                       
                        <Fab size="small" color="primary" onClick={handleShowDialog}
                            margin="dense" title="Menu">
                            <EditIcon />
                        </Fab>
                    </Toolbar>

                    <div className={classes.contentContainer}>
                        <div className={classes.row}>
                            <label className={classes.label} htmlFor="categoryName">Category:</label>
                            <div id="categoryName">{category.name}</div>
                        </div>

                        <div className={classes.row}>
                            <label className={classes.label} htmlFor="subcategories">Subcategories:</label>
                            <div id="subcategories">
                                {category.subcategories.map(subcat => (
                                    <div className={classes.subcategory} key={subcat.id}>{subcat.name}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
            <UpdateCategoryDialog open={openDialog} category={category} onClose={handleCloseDialog} />
        </>
    )
})

// Prop Types
CategoryDetails.propTypes = {
    category: CategoryType,
    getCategories: PropTypes.func.isRequired    
}

export default CategoryDetails