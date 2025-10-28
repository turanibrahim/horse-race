<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-tea-green-100 flex items-center justify-center p-8">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-cool-gray-800 mb-4">
          Your Custom Theme
        </h1>
        <p class="text-cool-gray-600 text-lg">
          Beautiful colors from Tea Green, Flax, Coral Pink, Cool Gray & Cadet Gray palette
        </p>
      </div>

      <!-- Color Palette Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <!-- Tea Green -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-tea-green h-24" />
          <div class="p-4">
            <h3 class="font-semibold text-cool-gray-800">
              Tea Green
            </h3>
            <p class="text-sm text-cool-gray-600">
              #CAE7B9
            </p>
          </div>
        </div>

        <!-- Flax -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-flax h-24" />
          <div class="p-4">
            <h3 class="font-semibold text-cool-gray-800">
              Flax
            </h3>
            <p class="text-sm text-cool-gray-600">
              #F3DE8A
            </p>
          </div>
        </div>

        <!-- Coral Pink -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-coral-pink h-24" />
          <div class="p-4">
            <h3 class="font-semibold text-cool-gray-800">
              Coral Pink
            </h3>
            <p class="text-sm text-cool-gray-600">
              #EB9486
            </p>
          </div>
        </div>

        <!-- Cool Gray -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-cool-gray h-24" />
          <div class="p-4">
            <h3 class="font-semibold text-cool-gray-800">
              Cool Gray
            </h3>
            <p class="text-sm text-cool-gray-600">
              #7E7F9A
            </p>
          </div>
        </div>

        <!-- Cadet Gray -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-cadet-gray h-24" />
          <div class="p-4">
            <h3 class="font-semibold text-cool-gray-800">
              Cadet Gray
            </h3>
            <p class="text-sm text-cool-gray-600">
              #97A7B3
            </p>
          </div>
        </div>
      </div>

      <!-- Component Examples -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Tea Green Card -->
        <div class="bg-tea-green-500 p-6 rounded-lg shadow-md">
          <h3 class="text-tea-green-900 font-semibold text-lg mb-2">
            Primary Theme
          </h3>
          <p class="text-tea-green-800 mb-4">
            Using tea-green as primary color
          </p>
          <button class="bg-tea-green-700 hover:bg-tea-green-800 text-white px-4 py-2 rounded">
            Click me
          </button>
        </div>

        <!-- Flax Card -->
        <div class="bg-flax-400 p-6 rounded-lg shadow-md">
          <h3 class="text-flax-900 font-semibold text-lg mb-2">
            Secondary Theme
          </h3>
          <p class="text-flax-800 mb-4">
            Using flax as secondary color
          </p>
          <button class="bg-flax-600 hover:bg-flax-700 text-white px-4 py-2 rounded">
            Click me
          </button>
        </div>

        <!-- Coral Pink Card -->
        <div class="bg-coral-pink-500 p-6 rounded-lg shadow-md">
          <h3 class="text-coral-pink-900 font-semibold text-lg mb-2">
            Accent Theme
          </h3>
          <p class="text-coral-pink-800 mb-4">
            Using coral-pink as accent color
          </p>
          <button class="bg-coral-pink-700 hover:bg-coral-pink-800 text-white px-4 py-2 rounded">
            Click me
          </button>
        </div>
      </div>

      <!-- Available Classes -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-cool-gray-800 mb-6">
          Available Tailwind Classes
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-cool-gray-700 mb-3">
              Named Colors
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-tea-green rounded" />
                <code class="text-cool-gray-600">bg-tea-green</code>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-flax rounded" />
                <code class="text-cool-gray-600">bg-flax</code>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-coral-pink rounded" />
                <code class="text-cool-gray-600">bg-coral-pink</code>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-cool-gray rounded" />
                <code class="text-cool-gray-600">bg-cool-gray</code>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-cadet-gray rounded" />
                <code class="text-cool-gray-600">bg-cadet-gray</code>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-cool-gray-700 mb-3">
              Color Scales
            </h3>
            <div class="space-y-2 text-sm">
              <code class="block text-cool-gray-600">tea-green-[50-900]</code>
              <code class="block text-cool-gray-600">flax-[50-900]</code>
              <code class="block text-cool-gray-600">coral-pink-[50-900]</code>
              <code class="block text-cool-gray-600">cool-gray-[50-900]</code>
              <code class="block text-cool-gray-600">cadet-gray-[50-900]</code>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-cool-gray-200">
          <p class="text-cool-gray-600 text-sm">
            Use these classes with any Tailwind prefix: <code>bg-</code>, <code>text-</code>, <code>border-</code>, <code>ring-</code>, etc.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
