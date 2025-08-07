export interface Product {
  id: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  status: 'active' | 'archived' | 'draft';
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: ProductVariant[];
  options: ProductOption[];
  images: ProductImage[];
  image: ProductImage | null;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string | null;
  grams: number;
  image_id: number | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export interface ProductOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  admin_graphql_api_id: string;
}

export interface ProductCollection {
  id: number;
  handle: string;
  title: string;
  updated_at: string;
  body_html: string;
  published_at: string;
  sort_order: string;
  template_suffix: string | null;
  disjunctive: boolean;
  rules: CollectionRule[];
  published_scope: string;
  admin_graphql_api_id: string;
  image: ProductImage | null;
}

export interface CollectionRule {
  column: string;
  relation: string;
  condition: string;
}

// Local app-specific types
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  selectedOptions: {[key: string]: string};
}

export interface WishlistItem {
  product: Product;
  variant?: ProductVariant;
  addedAt: string;
}

export interface ProductFilter {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  vendor?: string;
  availability?: 'available' | 'out_of_stock';
  sortBy?: 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc' | 'created_asc' | 'created_desc';
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  count: number;
}