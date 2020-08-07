import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppHeader from './components/appBar/AppHeader'
import { Router, Route, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"
import { NavRoutes } from './routes.js'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import { makeStyles } from '@material-ui/core/styles'

const history = createBrowserHistory();

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#005da1'
        },
        secondary: {
            main: '#d8ebf7'
        },
        info: {
            main: '#2196F3'
        },
        success: {
            main: '#4CAF50'
        },
        warning: {
            main: '#ffb81c'
        },
        error: {
            main: '#bf0d3e'
        },
        accent: {
            main: '#e57200'
        },
        defaultIcon: {
            main: '#cdcdcd'
        },
        contrastThreshold: 3,
        tonalOffset: 0.2
    },
    overrides: {
        MuiTableCell: {
            root: {
                padding: '4px 8px',
                // backgroundColor: "#eaeaea",
            }
        },
        MuiMenuItem: {
            root: {
                fontSize: '0.875rem !important'
            }
        },
        MuiDialogTitle: {
            root: {
                backgroundColor: '#005da1',
                color: '#ffffff'
            }
        },
        MuiDialogActions: {
            root: {
                justifyContent: 'flex-start',
                margin: '4px'
            }
        },
        MuiSelect: {
            outlined: {
                minWidth: '200px',
                backgroundColor: '#ffffff',
                fontSize: '0.875rem'
            }
        },
        MuiBackdrop: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
        },
        MuiFormControl: {
            root: {


            }
        }
    }
})

const useStyles = makeStyles(theme => ({
    appContent: {
        margin: '80px 20px 20px 20px',
        fontSize: '0.875rem'
    }
}))

export default function App() {
    const classes = useStyles()

    // Create the application route elements
    const routes = () => {
        const navRoutes = NavRoutes.map(route => {
            if (!route.meta.redirect) {
                return <Route path={route.path} component={route.component} key={route.name} />
            } else {
                return (
                    <Route exact path={route.path} key={route.name}>
                        <Redirect to={route.redirectTo} />
                    </Route>
                )
            }
        })
        return navRoutes
    }

    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <div className="app">
                    <Router history={history}>
                        <CssBaseline />
                        <AppHeader />
                        <div className={classes.appContent}>
                            {routes()}
                        </div>
                    </Router>
                </div>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    )
}
