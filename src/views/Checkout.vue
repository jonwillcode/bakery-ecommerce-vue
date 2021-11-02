<template>
  <div class="page-checkout">
      <div class="columns-is-multiline">
          <div class="column is-12">
              <h1 class="title">Checkout</h1>
          </div>
          <div class="column is-12 box">
              <table class="table is-fullwidth">
                  <thead>
                      <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="item in cart.items"
                        v-bind:key="item.product.id">
                        <td>{{ item.product.name }}</td>
                        <td>{{ item.product.price }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ getItemTotal(item).toFixed(2)  }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                      <tr>
                          <td colspan="2">Total</td>
                          <td>{{ cartTotalLength }}</td>
                          <td>{{ cartTotalPrice.toFixed(2) }}</td>
                      </tr>
                  </tfoot>
              </table>
          </div>

          <div class="column is-12 box">
              <h2 class="subtitle">Shipping details</h2>
              <p class="has-text-grey mb-4">* All fields are required.</p>
              <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label>First name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="first_name" placeholder="Linda">
                            </div>
                        </div>

                        <div class="field">
                            <label>Last name*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="last_name" placeholder="Burger">
                            </div>
                        </div>

                        <div class="field">
                            <label>E-mail*</label>
                            <div class="control">
                                <input type="email" class="input" v-model="email" placeholder="lindaburg@emailbox.com">
                            </div>
                        </div>

                        <div class="field">
                            <label>Phone*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="phone" placeholder="3122876590">
                            </div>
                        </div>
                    </div>

                    <div class="column is-6">
                        <div class="field">
                            <label>Address*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address1" placeholder="123 Main St">
                            </div>
                        </div>

                        <div class="field">
                            <label>Apt, Suite, Lot, etc.</label>
                            <div class="control">
                                <input type="text" class="input" v-model="address2" placeholder="Apt B">
                            </div>
                        </div>
                        <div class="field">
                            <label>City*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="city" placeholder="Chicago">
                            </div>
                        </div>
                        <div class="field">
                            <label>State*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="state" placeholder="IL">
                            </div>
                        </div>

                        <div class="field">
                            <label>Postal Code*</label>
                            <div class="control">
                                <input type="text" class="input" v-model="postal" placeholder="60007">
                            </div>
                        </div>
                        <div class="field">
                            <label>Pickup Time*</label>
                            <div class="control">
                                <input type="time" class="input" v-model="pickup_time" placeholder="">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="notification is-danger mt-4" v-if="errors.length">
                    <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
                </div>

                <hr>
                <div class="column is-half ">
                    <div class="message">
                        <div class="message-header">
                            Credit Card Details
                        </div>
                        <div class="message-body">
                            <div id="card-element">
                        </div>
                    </div>
                    </div>
                    <template v-if="cartTotalLength">
                        <button class="button is-dark" @click="submitForm">Submit</button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Checkout', 
    data() {
        return {
            cart: {
                items: []
            }, 
            stripe: {}, 
            card: {},
            first_name: '', 
            last_name: '', 
            email: '',
            phone: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postal: '',
            pickup_time: '',
            errors: []
        }
    }, 
    mounted() {
        document.title = 'Checkout | Menjl\'s'

        this.cart = this.$store.state.cart 

        if (this.cartTotalLength > 0) {
            this.stripe = Stripe('pk_test_51JmnvHA1qwRGCMb7nrjRl04qlBO8wFXBlpuqnsML8F4kRB73tA0yUpHixzzUQBoHxNAx2KetjY8cf00fot5yErWV00bG5bHEeH')
            const elements = this.stripe.elements();
            this.card = elements.create('card', { hidePostalCode: true })

            this.card.mount('#card-element')
        }
    }, 
    methods: {
        getItemTotal(item) { 
            return item.quantity * item.product.price
        },
        submitForm() {
            // reset the errors list
            this.errors = []

            if(this.first_name === '' ) {
                this.errors.push('First name is required.')
            }
            if(this.last_name === '' ) {
                this.errors.push('Last name is required.')
            }
            if(this.email === '' ) {
                this.errors.push('Email is required.')
            }
            if(this.phone === '' ) {
                this.errors.push('Phone is required.')
            }
            if(this.postal === '' ) {
                this.errors.push('Postal is required.')
            }
            if(this.city === '' ) {
                this.errors.push('City is required.')
            }
            if(this.state === '' ) {
                this.errors.push('State is required.')
            }
            if(this.address1 === '' ) {
                this.errors.push('Address is required.')
            }
            if(this.pickup_time === '' ) {
                this.errors.push('Pickup time is required.')
            }
           

            if (!this.errors.length) {
                this.$store.commit('setIsLoading', true)

                this.stripe.createToken(this.card).then(result => {
                    if (result.error) {
                        this.$store.commit('setIsLoading', false)

                        this.errors.push('🤔 Something went wrong with Stripe. Please try again.')

                        console.log(result.error.message)
                    } else {
                        this.stripeTokenHandler(result.token)
                    }
                })
            }

        },
        async stripeTokenHandler(token) {
            const items = []

            for (let i = 0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i];
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity, 
                    price: item.product.price * item.quantity
                }

                items.push(obj)
            }

            const data = {
                'first_name': this.first_name,
                'last_name': this.last_name,
                'email': this.email,
                'address1': this.address1,
                'address2': this.address2,
                'postal': this.postal,
                'city': this.city,
                'state': this.state,
                'phone': this.phone,
                'items': items,
                'pickup_time': this.pickup_time,
                'stripe_token': token.id 
            }

            await axios 
                .post('/api/v1/checkout/', data)
                .then(respoinse => {
                    this.$store.commit('clearCart')
                    this.$router.push({name:'Success', props: {pickup_time: 'test'}})
                })
                .catch(error => {
                    this.errors.push('Something went wrong. Please try again.')
                    console.log(error.response.data)
                })

                this.$store.commit('setIsLoading', false)
        }
    },
    computed: {
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curVal) => {
                return acc += curVal.product.price * curVal.quantity
            }, 0)
        }, 
        cartTotalLength() { 
            return this.cart.items.reduce((acc, curVal) => {
                    return acc += curVal.quantity
                }, 0)
        }
    }

}
</script>

<style>

</style>