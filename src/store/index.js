import { createStore } from 'vuex';

export default createStore({
  state: {
    products: [],
    basket: [],
    searchQuery: '',
    selectedCategory: '',
  },
  mutations: {
    // Set products in the store
    setProducts(state, products) {
      state.products = products;
    },
    // Add product to the basket
    addToBasket(state, product) {
      const existingProduct = state.basket.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1; // Increment quantity if product exists
      } else {
        state.basket.push({ ...product, quantity: 1 }); // Add new product with quantity
      }
    },
    // Remove product from the basket
    removeFromBasket(state, productId) {
      state.basket = state.basket.filter(item => item.id !== productId); // Remove the product by filtering
    },
    // Update quantity of a product in the basket
    updateQuantity(state, { productId, quantity }) {
      const existingProduct = state.basket.find(item => item.id === productId);
      if (existingProduct && quantity > 0) {
        existingProduct.quantity = quantity; // Update quantity if product exists
      } else if (existingProduct && quantity === 0) {
        // Remove item if quantity is set to 0
        state.basket = state.basket.filter(item => item.id !== productId);
      }
    },
    // Set search query
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    // Set selected category
    setSelectedCategory(state, category) {
      state.selectedCategory = category;
    },
  },
  getters: {
    // Filter products based on search query and category
    filteredProducts(state) {
      let filtered = state.products;

      // Apply category filter if selected
      if (state.selectedCategory) {
        filtered = filtered.filter(product => product.category === state.selectedCategory);
      }

      // Apply search filter if search query is provided
      if (state.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }

      return filtered;
    },
    // Calculate total price in the basket
    basketTotal(state) {
      return state.basket.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    // Get items in the basket
    basketItems(state) {
      return state.basket;
    },
    // Count the total number of items in the basket
    basketItemCount(state) {
      return state.basket.reduce((count, item) => count + item.quantity, 0);
    }
  },
});
