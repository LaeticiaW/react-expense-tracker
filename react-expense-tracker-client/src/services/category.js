import axios from 'axios'

export default {
    categoryUrl: 'http://localhost:3000/category/',
    maxTreeId: 1,

    /*
     * Retrieve the list of all categories
     */
    getCategories() {
        return axios.get(this.categoryUrl).then((response) => {
            // Add tree id to data, only for UI use with Vuetify treeView widget and not persisted
            if (response.data && response.data.length) {
                response.data.forEach((category) => {
                    category.treeId = this.maxTreeId++
                    category.subcategories.forEach((subcat) => {
                        subcat.treeId = this.maxTreeId++
                        subcat.parentTreeId = category.treeId
                        subcat.parentCategoryId = category._id
                    })
                })

                // Sort the categories by name
                response.data.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return -1
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1
                    }
                    return 0
                })

                return response.data
            }
            return []
        }).catch((error) => {
            console.error('CategoryService.getCategories error:', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Create a new categories
     * @param {object} categories - categories object to create
     */
    createCategory(category) {
        return axios({
            url: this.categoryUrl,
            method: 'POST',
            data: category
        }).then((response) => response.data).catch((error) => {
            console.error('CategoryService.createCategory error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Update an existing categories
     * @param {object} categories - categories object to update
     */
    updateCategory(category) {
        // Make a copy of the category and remove the treeId and parentTreeId properties before updating.  These properties
        // are required for the tree widget, but are set at the client and do not need to be persisted.
        let cat = JSON.parse(JSON.stringify(category))
        delete cat.treeId
        delete cat.parentTreeId
        cat.subcategories.forEach(subcat => {
            delete subcat.treeId
            delete subcat.parentTreeId
        })

        return axios({
            url: this.categoryUrl + category._id,
            method: 'PUT',
            data: cat
        }).then((response) => {
            return response.data
        }).catch((error) => {
            console.error('CategoryService.updateCategory error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Delete a categories
     * @param {string} categoryId - id of categories to delete
     */
    deleteCategory(categoryId) {
        return axios({
            url: this.categoryUrl + categoryId,
            method: 'DELETE'
        }).then((response) => response.data).catch((error) => {
            console.error('CategoryService.deleteCategory error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Retrieve the categories data and process it, returning the categories list, subcategory list, categories map, and subcategory map
     */
    getCategoryInfo() {
        return this.getCategories().then((categories) => {
            const selectCategories = categories.map((item) => ({
                _id: item._id,
                name: item.name
            }))

            const categoryMap = categories.reduce((map, obj) => {
                map[obj._id] = obj
                return map
            }, {})

            const subcategories = []
            categories.forEach((cat) => {
                if (cat.subcategories && cat.subcategories.length) {
                    subcategories.push(...cat.subcategories)
                }
            })
            const subcategoryMap = subcategories.reduce((map, obj) => {
                map[obj.id] = obj
                return map
            }, {})

            return {
                categories,
                selectCategories,
                categoryMap,
                subcategories,
                subcategoryMap
            }
        }).catch((error) => {
            console.error('CategoryService.getCategoryInfo error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    },

    /*
     * Retrieve the categories data for a select drop down
     */
    getCategorySelect() {
        return this.getCategories().then((categories) => {
            const selectCategories = categories.map((item) => ({
                value: item._id,
                label: item.name
            }))

            return selectCategories
        }).catch((error) => {
            console.error('CategoryService.getCategorySelect error', error.response ? error.response : error)
            return Promise.reject(error.response)
        })
    }
}
