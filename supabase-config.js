/**
 * Supabase Configuration for Reno-Romax-Pro
 * 
 * INSTRUCTIONS:
 * 1. Go to https://supabase.com and create a free account
 * 2. Create a new project
 * 3. Go to Settings > API and copy your:
 *    - Project URL (SUPABASE_URL)
 *    - anon public key (SUPABASE_ANON_KEY)
 * 4. Replace the values below with your actual keys
 */

// ============================================
// YOUR SUPABASE CREDENTIALS - REPLACE THESE!
// ============================================
const SUPABASE_URL = 'https://ydbukmqldmpuuvoevdpf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PcjqsPpUYjnUahlf6uXiNQ_FA2G8H3S';

// ============================================
// DO NOT MODIFY BELOW THIS LINE
// ============================================

// Check if Supabase is configured
function isSupabaseConfigured() {
  return SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && 
         SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE' &&
         SUPABASE_URL.length > 10 &&
         SUPABASE_ANON_KEY.length > 10;
}

// Initialize Supabase client
let supabase = null;

async function initSupabase() {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured. Using localStorage mode.');
    return false;
  }

  try {
    // Load Supabase JS library dynamically
    if (typeof window.supabase === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    }
    
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ============================================
// DATABASE OPERATIONS
// ============================================

// Get all products
async function getProducts() {
  if (!supabase) {
    return getLocalProducts();
  }
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return getLocalProducts();
  }
}

// Get local products from localStorage
function getLocalProducts() {
  const stored = localStorage.getItem('reno_romax_data');
  if (stored) {
    const data = JSON.parse(stored);
    return data.products || [];
  }
  return [];
}

// Save product
async function saveProductToDB(product) {
  if (!supabase) {
    saveProductLocal(product);
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'handle' });
    
    if (error) throw error;
    
    // Also save to localStorage as backup
    saveProductLocal(product);
    return true;
  } catch (error) {
    console.error('Error saving product to Supabase:', error);
    saveProductLocal(product);
    return false;
  }
}

// Save product to localStorage
function saveProductLocal(product) {
  const stored = localStorage.getItem('reno_romax_data');
  const data = stored ? JSON.parse(stored) : { categories: [], products: [] };
  
  const existingIndex = data.products.findIndex(p => p.handle === product.handle);
  if (existingIndex >= 0) {
    data.products[existingIndex] = product;
  } else {
    data.products.push(product);
  }
  
  localStorage.setItem('reno_romax_data', JSON.stringify(data));
}

// Delete product
async function deleteProductFromDB(handle) {
  if (!supabase) {
    deleteProductLocal(handle);
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('handle', handle);
    
    if (error) throw error;
    
    deleteProductLocal(handle);
    return true;
  } catch (error) {
    console.error('Error deleting product from Supabase:', error);
    deleteProductLocal(handle);
    return false;
  }
}

// Delete product from localStorage
function deleteProductLocal(handle) {
  const stored = localStorage.getItem('reno_romax_data');
  if (stored) {
    const data = JSON.parse(stored);
    data.products = data.products.filter(p => p.handle !== handle);
    localStorage.setItem('reno_romax_data', JSON.stringify(data));
  }
}

// Get all categories
async function getCategories() {
  if (!supabase) {
    return getLocalCategories();
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data ? data.map(c => c.name) : [];
  } catch (error) {
    console.error('Error fetching categories from Supabase:', error);
    return getLocalCategories();
  }
}

// Get local categories
function getLocalCategories() {
  const stored = localStorage.getItem('reno_romax_data');
  if (stored) {
    const data = JSON.parse(stored);
    return data.categories || [];
  }
  return [];
}

// Save category
async function saveCategoryToDB(name) {
  if (!supabase) {
    saveCategoryLocal(name);
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('categories')
      .insert({ name });
    
    if (error) throw error;
    
    saveCategoryLocal(name);
    return true;
  } catch (error) {
    console.error('Error saving category to Supabase:', error);
    saveCategoryLocal(name);
    return false;
  }
}

// Save category to localStorage
function saveCategoryLocal(name) {
  const stored = localStorage.getItem('reno_romax_data');
  const data = stored ? JSON.parse(stored) : { categories: [], products: [] };
  
  if (!data.categories.includes(name)) {
    data.categories.push(name);
    localStorage.setItem('reno_romax_data', JSON.stringify(data));
  }
}

// Delete category
async function deleteCategoryFromDB(name) {
  if (!supabase) {
    deleteCategoryLocal(name);
    return true;
  }
  
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', name);
    
    if (error) throw error;
    
    deleteCategoryLocal(name);
    return true;
  } catch (error) {
    console.error('Error deleting category from Supabase:', error);
    deleteCategoryLocal(name);
    return false;
  }
}

// Delete category from localStorage
function deleteCategoryLocal(name) {
  const stored = localStorage.getItem('reno_romax_data');
  if (stored) {
    const data = JSON.parse(stored);
    data.categories = data.categories.filter(c => c !== name);
    localStorage.setItem('reno_romax_data', JSON.stringify(data));
  }
}

// ============================================
// BULK OPERATIONS
// ============================================

// Import all products
async function importProductsToDB(products) {
  if (!supabase) {
    importProductsLocal(products);
    return { success: true, count: products.length };
  }
  
  try {
    // Clear existing products first
    await supabase.from('products').delete().neq('handle', '');
    
    // Insert new products in batches of 100
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const { error } = await supabase.from('products').insert(batch);
      if (error) throw error;
      inserted += batch.length;
    }
    
    // Also save to localStorage
    importProductsLocal(products);
    
    return { success: true, count: inserted };
  } catch (error) {
    console.error('Error importing products to Supabase:', error);
    importProductsLocal(products);
    return { success: false, error: error.message };
  }
}

// Import products to localStorage
function importProductsLocal(products) {
  const data = {
    categories: [...new Set(products.map(p => p.category).filter(Boolean))],
    products: products
  };
  localStorage.setItem('reno_romax_data', JSON.stringify(data));
}

// Export all data
async function exportAllData() {
  const products = await getProducts();
  const categories = await getCategories();
  
  return {
    products,
    categories,
    exportedAt: new Date().toISOString(),
    source: supabase ? 'supabase' : 'localStorage'
  };
}

// Sync localStorage to Supabase (one-time migration)
async function syncToSupabase() {
  if (!supabase) {
    return { success: false, message: 'Supabase not configured' };
  }
  
  const localProducts = getLocalProducts();
  const localCategories = getLocalCategories();
  
  if (localProducts.length === 0) {
    return { success: true, message: 'No local data to sync' };
  }
  
  try {
    // Sync categories
    for (const cat of localCategories) {
      await supabase.from('categories').upsert({ name: cat }, { onConflict: 'name' });
    }
    
    // Clear existing products
    await supabase.from('products').delete().neq('handle', '');
    
    // Sync products in batches
    const batchSize = 100;
    let synced = 0;
    
    for (let i = 0; i < localProducts.length; i += batchSize) {
      const batch = localProducts.slice(i, i + batchSize);
      const { error } = await supabase.from('products').insert(batch);
      if (error) {
        console.error('Batch error:', error);
        // Continue with next batch
      } else {
        synced += batch.length;
      }
    }
    
    return { success: true, message: `Synced ${synced} products and ${localCategories.length} categories to Supabase` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// ============================================
// SQL FOR SUPABASE TABLES
// ============================================

const SUPABASE_SQL = `
-- Run this SQL in Supabase SQL Editor to create tables

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);

-- Allow public write access (for anon key)
CREATE POLICY "Allow public insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON categories FOR DELETE USING (true);

-- Create index for faster searches
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_handle ON products(handle);
`;

// Export for use
window.SupabaseConfig = {
  init: initSupabase,
  isConfigured: isSupabaseConfigured,
  getProducts,
  getCategories,
  saveProduct: saveProductToDB,
  deleteProduct: deleteProductFromDB,
  saveCategory: saveCategoryToDB,
  deleteCategory: deleteCategoryFromDB,
  importProducts: importProductsToDB,
  exportData: exportAllData,
  syncToSupabase,
  SQL: SUPABASE_SQL
};
