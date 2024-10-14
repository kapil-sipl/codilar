<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>{{ product.title }}</h2>
      <img :src="product.thumbnail" alt="Product Image" />
      <p>{{ product.description }}</p>
      <p>Price: {{ product.price }}</p>
      <button @click="addToBasket">Add to Basket</button>&nbsp;
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
  },
  methods: {
    close() {
      this.$emit('close');
    },
    addToBasket() {
      this.$store.commit('addToBasket', this.product);
      this.close();
    },
  },
};
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.modal {
  background: white; 
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); 
  width: 90%; 
  max-width: 400px; 
}

.modal img {
  max-width: 100%;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.btn-close {
  background-color: #d9534f; 
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  display: block;
  width: 100%;
}
</style>
