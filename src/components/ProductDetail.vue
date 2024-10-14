<template>
  <div v-if="product">
    <h1>{{ product.title }}</h1>
    <img :src="product.thumbnail" alt="Product Image" />
    <p>{{ product.description }}</p>
    <p>Price: {{ product.price }}</p>
    
    <!-- Add to Cart Button -->
    <button @click="addToCart(product)">Add to Cart</button>
    
    <!-- Back Button -->
    <button @click="goBack">Back</button>
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
  props: ['id'],
  data() {
    return {
      product: null,
    };
  },
  async created() {
    const productId = this.id || this.$route.params.id;
    try {
      const response = await axios.get(`https://dummyjson.com/products/${productId}`);
      this.product = response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  },
  methods: {
    ...mapMutations(['addToBasket']), // Use Vuex mutation to add the product to cart
    goBack() {
      this.$router.back(); // Navigate to the previous page
    },
    addToCart(product) {
      this.addToBasket(product); // Add the product to the cart (handled by Vuex)
      alert(`${product.title} has been added to your cart!`);
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
