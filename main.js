Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template:`
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{outOfStock: !inStock}">Out of Stock</p>
            <p v-show="onSale">{{sale}}</p>
            <p>Shipping: {{shipping}}</p>

            <ul>
                <li v-for="detail in details">{{detail}}</li>
            </ul>

            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>

            <button @click="addToCart" 
                    :discabled="!inStock"
                    :class="{disabledButton: !inStock}">
                Add To Cart
            </button>
            <button @click="removeFromCart" 
                    :discabled="!inStock"
                    :class="{disabledButton: !inStock}">
                Remove
            </button>
        </div>

        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p> {{ review.name }} </p>
                    <p> Rating: {{ review.rating }} </p>
                    <p> {{ review.review }} </p>
                    <p v-if="review.recommend=='yes'"> I will recommend this product :) </p>
                    <p v-else> I won't recommend this product :( </p>
                </li>
            </ul>
        </div>

        <product-review @review-submitted="addReview"></product-review>
    </div>
    `,
    data(){
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green.png',
                    variantQuantity: 8
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue.png',
                    variantQuantity: 2
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
            //if(this.cart.length > 0)
            //    this.cart -= 1
        },
        updateProduct(index){
            this.selectedVariant = index
            console.log(index)
        },
        addReview(productReview){
            this.reviews.push(productReview)
        }
    },
    computed: {//callback functions: methods that can be called like properties
        title(){ 
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity > 0
        },
        sale(){
            if(this.onSale)
                return this.brand + ' ' + this.product + ' is on sale!'
        },
        shipping(){
            if(this.premium)
                return 'free'
            else
                return '$2.99'
        }
    }
})

Vue.component('product-review', {
    template:`
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name"> 
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <label>Would you recommend this product?</label>
            <input type="radio" id="yes" value="yes" v-model="recommend">
            <label for="yes"> Yes </label>
            <br>
            <input type="radio" id="no" value="no" v-model="recommend">
            <label for="no"> No </label>
        </p>
        
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
    `,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            if (this.name && this.review && this.rating && this.recommend){
                //create a new object named productReview
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }

                // send the productReview to parent object product
                this.$emit('review-submitted', productReview)

                //reset the content of input box
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
            else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation information required.")
            }
        }
    }
})
var app = new Vue({
    el: '#app',   
    data: {
        premium: false,
        cart: []
    },
    methods: {
        addToCart(id){
            this.cart.push(id)
        },
        removeFromCart(id){
            this.cart = this.cart.filter(function(item) {
                return item !== id
              })
        }
    }
})