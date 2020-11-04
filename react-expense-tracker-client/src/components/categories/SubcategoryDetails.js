import React, { useState, useContext } from 'react'
import { Card, CardContent, Toolbar, Fab } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import UpdateSubcategoryDialog from './UpdateSubcategoryDialog'
import { SubcategoryType, CategoryType } from 'types'
import { CategoryContext } from './CategoryContext'

const useStyles = makeStyles(theme => ({
    card: {
        height: '100%'
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

const SubcategoryDetails = React.memo(({ subcategory, parentCategory }) => {
    const classes = useStyles()
    const [openDialog, setOpenDialog] = useState(false)
    const { getCategories } = useContext(CategoryContext)

    // Show the update subcategory dialog
    const handleShowDialog = () => {
        setOpenDialog(true)
    }

    // Close the update subcategory dialog
    const handleCloseDialog = () => {
        setOpenDialog(false)
        getCategories()
    }

    return (
        <>
            <Card className={classes.card} elevation={2}>
                <CardContent classes={{ root: classes.contentRoot }}>
                    <Toolbar className={classes.toolbar}>
                        <h3 className="detailsTitle">Subcategory Details</h3>
                        <Fab size="small" color="primary" onClick={handleShowDialog}
                            margin="dense" title="Menu">
                            <EditIcon />
                        </Fab>
                    </Toolbar>

                    <div className={classes.contentContainer}>
                        <div className={classes.row}>
                            <label className={classes.label} htmlFor="subcategoryName">Subcategory:</label>
                            <div id="subcategoryName">{subcategory.name}</div>
                        </div>
                        <div className={classes.row}>
                            <label className={classes.label} htmlFor="matchText">Import Match Text:</label>
                            <div id="matchText">
                                {subcategory.matchText.map(text => (
                                    <div className={classes.matchText} key={text}>{text}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <UpdateSubcategoryDialog open={openDialog} subcategory={subcategory} parentCategory={parentCategory} onClose={handleCloseDialog} />
        </>
    )
})

// Prop Types
SubcategoryDetails.propTypes = {
    subcategory: SubcategoryType.isRequired,
    parentCategory: CategoryType.isRequired    
}

export default SubcategoryDetails

