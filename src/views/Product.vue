<template>

    <section class="section">
        <div class="container">
            <div class="columns is-multiline">
                <div class="column">
                    <h1 class="is-size-3-mobile is-size-1-desktop title">{{ product.name }}</h1>
                    <h2 class="is-size-3-mobile is-size-2-desktop subtitle">{{ product.category.name }}</h2>
                    <p>{{ product.description }}</p>
                </div>
                <div class="column is-6-tablet is-5-desktop has-text-centered">
                    <img :src="product.get_image" alt="docker coffee image" class="px-6">
                </div>
                <div class="column is-12-tablet is-4-desktop">
                <div class="is-size-4 mb-4">${{ product.price }}</div>
                <p class="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis perferendis ipsa totam.</p>

                <div class="column is-three-quarters">

                    <div class="field has-addons ">
                        <div class="control">
                            <input min="1" v-model="quantity" type="number" class="input">
                        </div>
                        <div class="control">
                            <a @click="addToCart"  class="button is-primary">Add to Cart</a>
                        </div>
                    </div>
                    
                </div>
                
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import axios from 'axios';
import { toast } from 'bulma-toast';

export default {
    name: 'Product',
    data() {
        return {
            product: {category:{},},
            loading: false, 
            quantity: 1,
            
        }
    }, 
    mounted() {
        this.getProduct()
    }, 
    methods: {
        async getProduct() {
            this.$store.commit('setIsLoading', true)
            this.loading = true 
            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug

            await axios
                .get(`/api/v1/products/${category_slug}/${product_slug}/`)
                .then(response => {
                    this.product = response.data
                    this.loading = false 
                    document.title = this.product.name +' | Menjl\'s'
                })
                .catch(error => {
                    console.log(error)
                })

            this.$store.commit('setIsLoading', false)

        }, 
        addToCart() {
            if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }

            const item = {
                product: this.product, 
                quantity: this.quantity
            }

            this.$store.commit('addToCart', item)

            toast({ 
                message: 'The product was added to the cart',
                type: 'is-success',
                dismissible: true, 
                pauseOnHover: true, 
                duration: 2000,
                position: 'bottom-right',
            })
        }
    }
}
</script>