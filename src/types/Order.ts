export interface Order {
  id: number;
  admin_graphql_api_id: string;
  app_id: number | null;
  browser_ip: string | null;
  buyer_accepts_marketing: boolean;
  cancel_reason: string | null;
  cancelled_at: string | null;
  cart_token: string | null;
  checkout_id: number | null;
  checkout_token: string | null;
  client_details: ClientDetails | null;
  closed_at: string | null;
  confirmed: boolean;
  contact_email: string | null;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: PriceSet;
  current_total_discounts: string;
  current_total_discounts_set: PriceSet;
  current_total_duties_set: PriceSet | null;
  current_total_price: string;
  current_total_price_set: PriceSet;
  current_total_tax: string;
  current_total_tax_set: PriceSet;
  customer_locale: string | null;
  device_id: number | null;
  discount_codes: DiscountCode[];
  email: string;
  estimated_taxes: boolean;
  financial_status: FinancialStatus;
  fulfillment_status: FulfillmentStatus | null;
  gateway: string;
  landing_site: string | null;
  landing_site_ref: string | null;
  location_id: number | null;
  name: string;
  note: string | null;
  note_attributes: NoteAttribute[];
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_duties_set: PriceSet | null;
  payment_gateway_names: string[];
  phone: string | null;
  presentment_currency: string;
  processed_at: string;
  processing_method: string;
  reference: string | null;
  referring_site: string | null;
  source_identifier: string | null;
  source_name: string;
  source_url: string | null;
  subtotal_price: string;
  subtotal_price_set: PriceSet;
  tags: string;
  tax_lines: TaxLine[];
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: PriceSet;
  total_line_items_price: string;
  total_line_items_price_set: PriceSet;
  total_outstanding: string;
  total_price: string;
  total_price_set: PriceSet;
  total_price_usd: string;
  total_shipping_price_set: PriceSet;
  total_tax: string;
  total_tax_set: PriceSet;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: number | null;
  billing_address: Address;
  customer: Customer;
  discount_applications: DiscountApplication[];
  fulfillments: Fulfillment[];
  line_items: LineItem[];
  payment_terms: PaymentTerms | null;
  refunds: Refund[];
  shipping_address: Address;
  shipping_lines: ShippingLine[];
}

export interface ClientDetails {
  accept_language: string | null;
  browser_height: number | null;
  browser_ip: string;
  browser_width: number | null;
  session_hash: string | null;
  user_agent: string | null;
}

export interface PriceSet {
  shop_money: Money;
  presentment_money: Money;
}

export interface Money {
  amount: string;
  currency_code: string;
}

export interface DiscountCode {
  code: string;
  amount: string;
  type: string;
}

export interface NoteAttribute {
  name: string;
  value: string;
}

export interface TaxLine {
  price: string;
  rate: number;
  title: string;
  price_set: PriceSet;
  channel_liable: boolean;
}

export interface Address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: string | null;
  company: string | null;
  latitude: number | null;
  longitude: number | null;
  name: string;
  country_code: string;
  province_code: string;
}

export interface Customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: number | null;
  note: string | null;
  verified_email: boolean;
  multipass_identifier: string | null;
  tax_exempt: boolean;
  phone: string | null;
  tags: string;
  currency: string;
  addresses: Address[];
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: string | null;
  tax_exemptions: string[];
  email_marketing_consent: MarketingConsent | null;
  sms_marketing_consent: MarketingConsent | null;
  admin_graphql_api_id: string;
  default_address: Address;
}

export interface MarketingConsent {
  state: string;
  opt_in_level: string;
  consent_updated_at: string | null;
  consent_collected_from: string;
}

export interface DiscountApplication {
  target_type: string;
  type: string;
  value: string;
  value_type: string;
  allocation_method: string;
  target_selection: string;
  title: string;
  description: string | null;
}

export interface Fulfillment {
  id: number;
  order_id: number;
  status: string;
  created_at: string;
  service: string;
  updated_at: string;
  tracking_company: string | null;
  tracking_number: string | null;
  tracking_numbers: string[];
  tracking_url: string | null;
  tracking_urls: string[];
  receipt: Receipt;
  name: string;
  admin_graphql_api_id: string;
  line_items: LineItem[];
  shipment_status: string | null;
}

export interface Receipt {
  testcase: boolean;
  authorization: string;
}

export interface LineItem {
  id: number;
  admin_graphql_api_id: string;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: string | null;
  gift_card: boolean;
  grams: number;
  name: string;
  origin_location: OriginLocation;
  price: string;
  price_set: PriceSet;
  product_exists: boolean;
  product_id: number;
  properties: Property[];
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: PriceSet;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: string | null;
  vendor: string;
  tax_lines: TaxLine[];
  duties: Duty[];
  discount_allocations: DiscountAllocation[];
}

export interface OriginLocation {
  id: number;
  country_code: string;
  province_code: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
}

export interface Property {
  name: string;
  value: string;
}

export interface Duty {
  id: string;
  harmonized_system_code: string;
  country_code_of_origin: string;
  shop_money: Money;
  presentment_money: Money;
  tax_lines: TaxLine[];
  admin_graphql_api_id: string;
}

export interface DiscountAllocation {
  amount: string;
  amount_set: PriceSet;
  discount_application_index: number;
}

export interface PaymentTerms {
  amount: number;
  currency: string;
  payment_terms_name: string;
  payment_terms_type: string;
  due_in_days: number;
  payment_schedules: PaymentSchedule[];
}

export interface PaymentSchedule {
  amount: number;
  currency: string;
  issued_at: string | null;
  due_at: string | null;
  completed_at: string | null;
  expected_payment_method: string;
}

export interface Refund {
  id: number;
  order_id: number;
  created_at: string;
  note: string | null;
  user_id: number | null;
  processed_at: string;
  restock: boolean;
  duties: Duty[];
  additional_fees: AdditionalFee[];
  total_duties_set: PriceSet;
  return: Return | null;
  admin_graphql_api_id: string;
  refund_line_items: RefundLineItem[];
  transactions: Transaction[];
  order_adjustments: OrderAdjustment[];
}

export interface AdditionalFee {
  amount: string;
  amount_set: PriceSet;
  tax_amount: string;
  tax_amount_set: PriceSet;
  name: string;
}

export interface Return {
  id: number;
  order_id: number;
  status: string;
  admin_graphql_api_id: string;
}

export interface RefundLineItem {
  id: number;
  line_item_id: number;
  location_id: number | null;
  quantity: number;
  restock_type: string;
  subtotal: string;
  subtotal_set: PriceSet;
  total_tax: string;
  total_tax_set: PriceSet;
  line_item: LineItem;
}

export interface Transaction {
  id: number;
  order_id: number;
  kind: string;
  gateway: string;
  status: string;
  message: string | null;
  created_at: string;
  test: boolean;
  authorization: string | null;
  location_id: number | null;
  user_id: number | null;
  parent_id: number | null;
  processed_at: string;
  device_id: number | null;
  error_code: string | null;
  source_name: string;
  receipt: Receipt;
  amount: string;
  currency: string;
  admin_graphql_api_id: string;
}

export interface OrderAdjustment {
  id: number;
  order_id: number;
  refund_id: number;
  amount: string;
  amount_set: PriceSet;
  kind: string;
  reason: string;
  tax_amount: string;
  tax_amount_set: PriceSet;
}

export interface ShippingLine {
  id: number;
  carrier_identifier: string | null;
  code: string | null;
  delivery_category: string | null;
  discounted_price: string;
  discounted_price_set: PriceSet;
  phone: string | null;
  price: string;
  price_set: PriceSet;
  requested_fulfillment_service_id: string | null;
  source: string;
  title: string;
  tax_lines: TaxLine[];
  discount_allocations: DiscountAllocation[];
}

export type FinancialStatus = 
  | 'pending'
  | 'authorized'
  | 'partially_paid'
  | 'paid'
  | 'partially_refunded'
  | 'refunded'
  | 'voided';

export type FulfillmentStatus = 
  | 'fulfilled'
  | 'null'
  | 'partial'
  | 'restocked';

// Local app-specific types
export interface OrderSummary {
  totalOrders: number;
  totalRevenue: string;
  averageOrderValue: string;
  recentOrders: Order[];
}

export interface OrderAnalytics {
  dailyOrders: {date: string; count: number; revenue: string}[];
  topProducts: {product: string; quantity: number; revenue: string}[];
  ordersByStatus: {status: string; count: number}[];
}