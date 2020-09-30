import React, { useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
// Mobx: import { useContext } from 'react'
// Mobx: import { UserStoreContext } from '../../stores/mobx/UserStore'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { NavRoutes } from '../../routes.js'
import { Link } from "react-router-dom"

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    flex: {
        flex: 1
    },
    drawerPaper: {
        position: "relative",
        width: 240
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        color: '#ffffff'
    },
    toolbarMargin: theme.mixins.toolbar,
    aboveDrawer: {
        zIndex: theme.zIndex.drawer + 1
    },
    listIcon: {
        width: '50px !important',
        maxWidth: '50px !important',
        minWidth: '50px !important'
    }
}))

export default function NavDrawer() {
    const classes = useStyles()
    // Mobx: const userStore = useContext(UserStoreContext)
    const userStore = useSelector(state => state.user, shallowEqual)

    const [drawerOpen, setDrawerOpen] = useState(false)

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const list = () => {
        const routeList = NavRoutes.map(route => {
            if (!route.meta.hidden) {
                return (
                    <ListItem button component={Link} to={route.path} key={route.name} onClick={toggleDrawer}>
                        <ListItemIcon className={classes.listIcon}>{route.meta.icon()}</ListItemIcon>
                        <ListItemText>{route.name}</ListItemText>
                    </ListItem>
                )
            }
            return ''
        })

        return (
            <nav className="nav-drawer-list">
                <List>
                    {routeList}
                </List>
            </nav>
        )
    }

    return (
        <div className="nav-drawer">
            {userStore.loggedInUserId &&
                <>
                    <IconButton onClick={toggleDrawer} className={classes.menuButton}><MenuIcon /></IconButton>
                    <Drawer open={drawerOpen} classes={{ paper: classes.drawerPaper }} BackdropProps={{ invisible: true }}>
                        {list()}
                    </Drawer>
                </>
            }
        </div>
    )
}
