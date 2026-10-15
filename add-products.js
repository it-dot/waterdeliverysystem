import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Role Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const products = [
  {
    name: "Purified Water",
    description: "Tap or groundwater treated via mechanical filtration and reverse osmosis (RO) to remove virtually all chemicals, minerals, and microorganisms.",
    price: 35,
    is_active: true
  },
  {
    name: "Mineral Water",
    description: "Water sourced directly from underground springs or wells, naturally containing dissolved minerals such as calcium, magnesium, potassium, and sodium.",
    price: 45,
    is_active: true
  },
  {
    name: "Alkaline Water",
    description: "Water treated (often through ionization or electrolysis) to achieve a higher pH level (typically 8.0 to 9.5), formulated to lower acidity.",
    price: 55,
    is_active: true
  },
  {
    name: "Distilled Water",
    description: "Water converted into vapor by boiling and condensed back into liquid in a separate container, resulting in pure H2O stripped of minerals, impurities, and contaminants.",
    price: 40,
    is_active: true
  },
  {
    name: "Spring Water",
    description: "Natural groundwater collected at the point where it flows naturally to the surface, processed minimally through basic sediment filtering while retaining its natural mineral profile.",
    price: 50,
    is_active: true
  },
  {
    name: "Bulk Tanker Delivery Water",
    description: "High-volume water transported via tanker trucks (typically 4,000 to 10,000+ liters) for commercial, residential cistern refilling, construction, or disaster relief; supplied either as treated potable water for consumption or utility-grade non-potable water for sanitation and industrial use.",
    price: 1500,
    is_active: true
  }
]

async function addProducts() {
  console.log("Adding products...")
  
  for (const product of products) {
    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('name', product.name)
      .single()
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is 'not found'
      console.error(`Error checking product ${product.name}:`, checkError)
      continue
    }
    
    let productId;
    
    if (existingProduct) {
      console.log(`Product ${product.name} already exists.`)
      productId = existingProduct.id;
    } else {
      console.log(`Inserting product ${product.name}...`)
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()
        
      if (insertError) {
        console.error(`Error inserting product ${product.name}:`, insertError)
        continue
      }
      productId = newProduct.id;
      console.log(`Inserted product ${product.name} with ID ${productId}`)
    }
    
    // Add inventory entry if not exists
    const { data: existingInventory, error: invCheckError } = await supabase
      .from('inventory')
      .select('id')
      .eq('product_id', productId)
      .single()
      
    if (invCheckError && invCheckError.code !== 'PGRST116') {
      console.error(`Error checking inventory for ${product.name}:`, invCheckError)
      continue
    }
    
    if (existingInventory) {
      console.log(`Inventory for ${product.name} already exists.`)
    } else {
      console.log(`Adding inventory for ${product.name}...`)
      const { error: invInsertError } = await supabase
        .from('inventory')
        .insert({
          product_id: productId,
          stock_level: 100, // Default stock level
          low_stock_threshold: 20
        })
        
      if (invInsertError) {
        console.error(`Error adding inventory for ${product.name}:`, invInsertError)
      } else {
        console.log(`Added inventory for ${product.name}.`)
      }
    }
  }
  
  console.log("Done adding products!")
}

addProducts()
