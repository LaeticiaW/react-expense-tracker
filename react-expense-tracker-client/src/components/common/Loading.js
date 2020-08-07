import React from 'react'
import {LinearProgress, Fade} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    loading: {
        height: '6px',
        marginTop: '-12px',
        marginBottom: '6px'
    }
}))

export default React.memo(function Loading({ isLoading }) {
    const classes = useStyles()

    return (
        <div className={classes.loading}>
            <Fade in={isLoading} style={{ transitionDelay: isLoading ? '800ms' : '0ms', }} unmountOnExit>
                <LinearProgress />
            </Fade>
        </div>
    )
})