<template>
  <div class="wrapper">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item"><strong>Menjl's</strong></router-link>

        <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="narbar-menu" @click="showMobileMenu = !showMobileMenu" >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" id="navbar-menu" v-bind:class="{ 'is-active': showMobileMenu }">
        <div class="navbar-start">
           <!-- <router-link to="/pastry" class="navbar-item">Pastry</router-link>
          <router-link to="/doughnut" class="navbar-item">Doughnut</router-link> -->
        <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link" href="#">
          Browse by category
        </a>
        <div class="navbar-dropdown is-boxed">
          <a v-for="category in this.$store.state.navMenuCategories"  class="navbar-item" :href="category.get_absolute_url">
            {{category.name}}
          </a>
        </div>
      </div>
      
            
            </div>
            <div class="navbar-end">
              <div class="navbar-item">
                <form method="get" action="/search">
                  <div class="field has-addons">
                    <div class="control">
                      <input type="text" class="input" placeholder="What are you looking for?" name="query">
                    </div>
                    <div class="control">
                      <button class="button is-primary">
                        <span class="icon">
                          <i class="fas fa-search"></i>
                        </span>
                      </button>
                    </div>
                  </div>
            </form>
          </div>
         
          <div class="navbar-item">
            <div class="buttons">
              <template v-if="$store.state.isAuthenticated">
                <router-link to="/my-account" class="button is-light">My Account</router-link>
              </template>

              <template v-else>
                <router-link to="/login" class="button is-light">Login</router-link>
              </template>

              <router-link to="/cart" class="button is-primary">
                <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                <span>Cart ({{ cartTotalLength }})</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="is-loading-bar has-text-centered" v-bind:class="{'is-loading': $store.state.isLoading } ">
      <div class="lds-dual-ring">
      </div>
    </div>

    <section class="section">
      <router-view />
    </section>

  <footer class="footer">
      <p class="has-text-centered">Fake E-Commerce Copyright &copy; 2021</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios' 
import {mapState} from "vuex";

export default {
  data() {
    return {
      showMobileMenu: false,
      cart: {
        items: []
      }, 
      navMenuCategories: [{},]
    }
  }, 
  beforeCreate() {
    this.$store.commit('initializeStore')

    const token = this.$store.state.token 

    if (token) { 
      axios.defaults.headers.common['Authorization'] = 'Token ' + token
    } else {
      axios.defaults.headers.common['Authorization'] = ''
    }
  },
  mounted() {
    this.cart = this.$store.state.cart
  },
  created() {
    this.$store.dispatch('loadCategories')

  },
  computed: {
    cartTotalLength() {
      let totalLength = 0 
      for (let i = 0; i < this.cart.items.length; i++) {
        totalLength += this.cart.items[i].quantity
      }
      return totalLength
    }
  }
}
</script>

<style lang="scss">
@import '/assets/css/custom_styles.scss';
@import '../node_modules/bulma';

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #ccc;
  border-color: #ccc transparent #ccc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.is-loading-bar {
  height: 0;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  &.is-loading {
    height: 80px;
  }
}
</style>
