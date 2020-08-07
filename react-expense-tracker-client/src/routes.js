import React from 'react'
import Dashboard from './components/dashboard/Dashboard'
import Categories from './components/categories/Categories'
import Expenses from './components/expenses/Expenses'
import ExpenseSummary from './components/expenses/ExpenseSummary'
import Imports from './components/imports/Imports'
import PublishIcon from '@material-ui/icons/Publish'
import HomeIcon from '@material-ui/icons/Home'
import CategoryIcon from '@material-ui/icons/Category'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import ListAltIcon from '@material-ui/icons/ListAlt'

export const NavRoutes = [
    {
        name: 'Home',
        path: '/', 
        redirectTo: '/dashboard',       
        meta: { redirect: true, hidden: true }       
    }, {
        name: 'Dashboard',
        path: '/dashboard',  
        component: Dashboard,     
        meta: { icon: () => { return <HomeIcon/> }}        
    }, {
        name: 'Categories',
        path: '/categories',  
        component: Categories,     
        meta: {icon: () => { return <CategoryIcon/> }}        
    }, {
        name: 'Manage Expenses',
        path: '/expenses',      
        component: Expenses,  
        meta: {icon: () => { return <CreditCardIcon/> }}       
    }, {
        name: 'Expense Summary',
        path: '/expenseSummary', 
        component: ExpenseSummary,       
        meta: {icon: () => { return <ListAltIcon/> }}       
    }, {
        name: 'Import Expenses',
        path: '/imports',  
        component: Imports,     
        meta: {icon: () => { return <PublishIcon/> }}        
    }
]
