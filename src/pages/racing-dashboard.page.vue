<script setup lang="ts">
import { onMounted, ref } from 'vue';

const isLoading = ref(true);

onMounted(async () => {
  try {
    isLoading.value = false;
  } catch {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="racing-dashboard">
    <header class="dashboard-header">
      <h1>Racing Dashboard</h1>
      <p>Welcome to the Horse Racing Management System</p>
    </header>

    <div v-if="isLoading" class="loading-state">
      <p>Loading dashboard...</p>
    </div>

    <div v-else class="dashboard-content">
      <section class="dashboard-section">
        <h2>Active Races</h2>
        <p>Race information will appear here</p>
      </section>

      <section class="dashboard-section">
        <h2>Horse Statistics</h2>
        <p>Horse statistics will appear here</p>
      </section>

      <section class="dashboard-section">
        <h2>Recent Results</h2>
        <p>Recent race results will appear here</p>
      </section>
    </div>
  </div>
</template>

<style>
.racing-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.125rem;
  color: #6b7280;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.dashboard-content {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.dashboard-section {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

.dashboard-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.dashboard-section p {
  color: #6b7280;
}
</style>
