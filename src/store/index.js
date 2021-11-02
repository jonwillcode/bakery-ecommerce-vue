import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    cart: {
      items: [],
    },
    navMenuCategories: {},
    isAuthenticated: false, 
    token: '',
    isLoading: false
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart',JSON.stringify(state.cart))
      }

      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true 
      } else {
        state.token = ''
        state.isAuthenticated = false 
      }
    }, 
    addToCart(state, item) {
      const exists = state.cart.items.filter(i => i.product.id === item.product.id)
      
      if (exists.length) {
        exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
      } else {
        // add the item if not in the cart
        state.cart.items.push(item)
      }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    setIsLoading(state, status) {
      state.isLoading = status;
    }, 
    setToken(state, token) {
      state.token = token 
      state.isAuthenticated = true 
    },
    removeToken(state, token) {
      state.token = ''
      state.isAuthenticated = false 
    }, 
    clearCart(state) {
      state.cart = { items: [] }

      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    saveCategories(state, categories) {
      state.navMenuCategories = categories;
    }
  },
  actions: {
    async loadCategories({commit}) {
      await axios
        .get('/api/v1/categories_displayed/')
        .then(response => {
          commit('saveCategories', response.data)

        })
        .catch(error => {
          throw new Error(`API ${error}`)
        })
    }
  },
  modules: {
  }
})
