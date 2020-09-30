import React from 'react'
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import * as Actions from '../../store/actions/actions'
import { AppBar, Toolbar, Avatar, Menu, MenuItem } from '@material-ui/core'
import NavDrawer from './NavDrawer'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    appTitle: {
        flexGrow: 1
    },
    avatar: {
        color: theme.palette.primary.main,
        backgroundColor: '#ffffff',
        width: theme.spacing(4),
        height: theme.spacing(4),
    }
}))

export default function AppHeader() {
    const classes = useStyles()    
    const userState = useSelector(state => state.user, shallowEqual)
    const dispatch = useDispatch()
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
    
    // Open the avatar menu
    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget)
    }

    // Close the avatar menu
    const handleCloseMenu = () => {
        setMenuAnchorEl(null)
    };

    // Logout the user
    const handleLogout = () => {
        handleCloseMenu()              
        dispatch(Actions.logout())
    }

    return (
        <header className={classes.root}>
            <AppBar position="fixed" className="app-header">
                <Toolbar>
                    <NavDrawer />
                    <h3 className={classes.appTitle}>Expense Tracker</h3>                  
                    {userState.loggedInUserId &&
                        <>
                            <Avatar className={classes.avatar} onClick={handleOpenMenu} title={userState.userName}>
                                {userState.userLetter}
                            </Avatar>
                            <Menu id="menu" anchorEl={menuAnchorEl} keepMounted
                                open={Boolean(menuAnchorEl)} onClose={handleCloseMenu}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </header>
    )
}
