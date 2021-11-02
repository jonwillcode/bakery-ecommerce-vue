<template>
  <div class="home">
    <section class="hero is-medium is-primary mb-6">
      <div class="hero-body has-text-centered">
        <p id="custom-hero-title" class="title is-size-1 has-text-weight-bold mb-6">
          Welcome to Menjl's
        </p>
        <p class="subtitle">
          "The best of the best"
        </p>
        <p>Shop online for the best sweet treats!</p>
      </div>
    </section>

    <div class="columns is-multiline">
      <div class="column is-12">
        <h2 class="is-size-3 has-text-centered">Latest Products</h2>
        </div>
        <ProductBox 
          v-for="product in latestProducts"
          v-bind:key="product.id"
        v-bind:product="product"
      />
    </div>
     <div class="columns is-multiline">
    <div class="column is-12">
      <h2 class="is-size-3 has-text-centered">Categories</h2>
    </div>
    <div v-for="category in this.menuCategories" class="column is-3">
        <div class="box">
          <!-- <figure class="image mb-4">
            <img src="" >
          </figure> -->

          
          <router-link :to="`${category.get_absolute_url}`"><h3 class="is-size-4 has-text-centered">{{ category.name }}</h3></router-link>
    
        </div>
      </div>
      </div>
     
  </div>
</template>

<script>
import axios from 'axios';
import ProductBox from '@/components/ProductBox'

export default {
  name: 'Home',
  data() {
    return {
      latestProducts: [],
      menuCategories: [Object,]
    }
  }, 
  components: {
    ProductBox
  },
  mounted() {
    document.title = 'Home | Menjl\'s'
    this.getLatestProducts()
    this.getCategories()

  }, 
  methods: {
    async getLatestProducts() {
      this.$store.commit('setIsLoading', true)
      await axios
        .get('/api/v1/latest-products/')
        .then(response => {
          this.latestProducts = response.data
        })
        .catch(error => {
          console.log(error)
        })

      this.$store.commit('setIsLoading', false)
    }, 
    async getCategories() {
      this.$store.commit('setIsLoading', true)
      await axios
        .get('/api/v1/categories_displayed/')
        .then(response => {
          this.menuCategories = response.data
        })
        .catch(error => {
          console.log(error)
        })

      console.log('menucat', this.menuCategories)

      this.$store.commit('setIsLoading', false)
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');

#custom-hero-title {
  font-family: 'Alex Brush', cursive;
}
</style>