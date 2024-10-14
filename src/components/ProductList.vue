<template>
  <div class="container">
    <h1>GlowLane Products</h1>
    <div class="basket">
      <h2>Basket</h2>
      <ul>
        <li v-for="item in basket" :key="item.id">
          {{ item.title }} ({{ item.quantity }}) - {{ (item.price * item.quantity).toFixed(2) }} USD
          <button @click="removeFromBasket(item.id)">Remove</button>
          <input 
            type="number" 
            v-model.number="item.quantity" 
            @change="updateQuantity(item.id, item.quantity)" 
            min="1" 
          />
        </li>
      </ul>
      <p>Total: {{ basketTotal.toFixed(2) }} USD</p>
    </div>
    <div class="product-list">
      <div class="sidebar">
        <div>
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search products..."
        @input="updateSearchQuery"
      />

      <div class="categories-sec">
        <h3 style="padding-bottom: 0;margin-bottom:0">Filters</h3>
        <hr />
        <h4>Category</h4>
        <div v-for="category in categories" :key="category">
          <label>
            <input 
              type="checkbox" 
              :value="category" 
              v-model="selectedCategories" 
              @change="updateCategory"
            />
            {{ category }} ({{ countProductsByCategory(category) }})
          </label>
        </div>
      </div>
    </div>

      </div>
      <div class="product-items">
        <div v-if="loading">Loading products...</div>
    <div v-else-if="filteredProducts.length === 0">No products available.</div>
    <div v-else>
      <div class="result-info">
  <p>
    Showing {{ paginatedProducts.length }} of {{ filteredProducts.length }} results 
    <span v-if="selectedCategories.length > 0">in categories: {{ selectedCategories.join(', ') }}</span>
  </p>
  <div class="sort-options">
    <h3>Sort By:</h3>
    <select v-model="selectedSortOption" @change="updateSortOrder">
      <option value="all">All</option>
      <option value="priceAsc">Price (Low to High)</option>
      <option value="priceDesc">Price (High to Low)</option>
    </select>
  </div>
</div>

      <ul>
        <li v-for="product in paginatedProducts" :key="product.id">
          <h2 @click="openModal(product)">{{ product.title }}</h2>
          <img :src="product.thumbnail" alt="Product Image" width="100" height="100" />
          <p>{{ product.description }}</p>
          <p>Price: {{ product.price }} USD</p>
          <button @click="addToBasket(product)">Add to Basket</button>
        </li>
      </ul>
      
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">&laquo; Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next &raquo;</button>
      </div>
    </div>
      </div>
    </div>

    <ProductModal 
      :product="selectedProduct" 
      v-if="selectedProduct" 
      @close="closeModal" 
    />
    
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { debounce } from 'lodash';
import ProductModal from './ProductModal.vue';

export default {
  components: {
    ProductModal,
  },
  data() {
    return {
      loading: true,
      selectedProduct: null,
      selectedCategories: [], // Array for selected categories
      selectedSortOption: 'all', // Default sorting option
      searchQuery: '', // Search query
      currentPage: 1, // Current page number
      itemsPerPage: 6, // Number of items to display per page
    };
  },
  computed: {
    ...mapState(['basket', 'products']),
    ...mapGetters(['basketTotal']),
    categories() {
      return this.products && this.products.length > 0 
        ? [...new Set(this.products.map(product => product.category))] 
        : [];
    },
    filteredProducts() {
      let result = this.products;

      // Filter by selected categories
      if (this.selectedCategories.length > 0) {
        result = result.filter(product => this.selectedCategories.includes(product.category));
      }

      // Filter by search query
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        product.title && product.title.toLowerCase().includes(query)
      );

      // Sort the results based on the selected sorting option
      if (this.selectedSortOption === 'priceAsc') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.selectedSortOption === 'priceDesc') {
        result.sort((a, b) => b.price - a.price);
      }

      return result;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
  },
  methods: {
    ...mapMutations(['setProducts', 'addToBasket', 'removeFromBasket', 'updateQuantity', 'setSearchQuery']),
    async fetchProducts() { 
      try {
        const response = await axios.get('https://dummyjson.com/products');
        this.setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    updateCategory() {
      // This can be used for additional logic if needed
    },
    updateSearchQuery: debounce(function() {
      this.setSearchQuery(this.searchQuery);
      this.currentPage = 1; // Reset to the first page on search
    }, 300), // Adjust the delay as needed
    updateSortOrder() {
      // No need to implement anything here since sorting is computed from sortOptions
    },
    countProductsByCategory(category) {
      return this.products.filter(product => product.category === category).length;
    },
    openModal(product) {
      this.selectedProduct = product;
    },
    closeModal() {
      this.selectedProduct = null;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.basket-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.basket-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.basket-item-title {
  font-weight: bold;
  flex-grow: 1; /* Allows title to take the available space */
}

.basket-item-quantity {
  margin: 0 10px;
}

.basket-item-total {
  font-weight: bold;
  color: #007BFF; /* Primary color for total price */
}

.basket-quantity-input {
  width: 60px; /* Set a fixed width for quantity input */
  margin-left: 10px;
}

.basket-total {
  font-weight: bold;
  font-size: 1.2em;
  text-align: right; /* Align total price to the right */
  margin-top: 15px;
}
</style>
