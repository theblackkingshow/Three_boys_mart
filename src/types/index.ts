export type UserRole = 'customer' | 'driver' | 'vendor' | 'admin';

export type StoreSector = 'all' | 'grocery' | 'food';

export type GroceryCategory =
  | 'Fresh Produce'
  | 'Dairy & Eggs'
  | 'Bakery & Bread'
  | 'Meat & Seafood'
  | 'Pantry & Staples'
  | 'Beverages & Juices'
  | 'Snacks & Treats'
  | 'Frozen Foods'
  | 'Deli & Prepared'
  | 'Hot Meals & Kitchen'
  | 'Sushi & Asian Bowls'
  | 'Artisan Pizza & Pasta'
  | 'Household & Cleaning'
  | 'Personal Care'
  | 'Organic & Specialty'
  | 'Men\'s Fashion'
  | 'Women\'s Fashion'
  | 'Kids\' Fashion';

export type DietaryTag =
  | 'Organic'
  | 'Gluten-Free'
  | 'Vegan'
  | 'Vegetarian'
  | 'Dairy-Free'
  | 'Halal'
  | 'Australian Grown'
  | 'Sugar-Free';

export type MarketplaceTag = 'fashion' | 'groceries' | 'beauty' | 'crafts';

export interface Vendor {
  id: string;
  name: string;
  type:
    | 'Supermarket'
    | 'Artisan Grocery'
    | 'Organic Mart'
    | 'Seafood & Deli'
    | 'Bakery'
    | 'Express Mart'
    | 'Hot Food & Kitchen'
    | 'Pizzeria & Trattoria'
    | 'Sushi & Asian Bowls';
  sector: 'grocery' | 'food' | 'hybrid';
  rating: number;
  reviewsCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrder: number;
  address: string;
  suburb: string;
  state: string; // e.g. NSW, VIC, QLD
  phone: string;
  image: string;
  logo: string;
  isOpen: boolean;
  featured: boolean;
  tags: string[];
  bannerColor: string;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: GroceryCategory;
  categoryTags?: MarketplaceTag[];
  itemType?: 'grocery' | 'food' | 'lifestyle'; // distinguishes marketplace departments
  description: string;
  basePrice: number; // Base reference price
  currentPrice: number; // Computed dynamic price based on stock level
  unit: string; // e.g. '1kg', '500g', 'each', '6 pack', '2L', 'serving'
  unitPriceComparison?: string; // e.g. '$3.50/kg'
  image: string;
  stock: number; // Current inventory level
  initialStock: number; // Full stock reference
  lowStockThreshold: number; // Threshold where price increases
  surplusThreshold: number; // Threshold where price is discounted
  dietary: DietaryTag[];
  origin: string; // e.g. 'Australia (Victoria)', 'Tasmania'
  brand: string;
  barcode?: string;
  nutrition?: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    sugar?: string;
  };
  pricingTierInfo?: {
    status: 'surplus_discount' | 'regular' | 'scarcity_surge';
    discountPercent?: number;
    surgePercent?: number;
    reason: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSubstitution: 'best_match' | 'contact_me' | 'refund';
  customNotes?: string;
}

export type OrderStatus =
  | 'order_placed'
  | 'vendor_accepted'
  | 'packing_items'
  | 'ready_for_pickup'
  | 'driver_assigned'
  | 'driver_at_store'
  | 'out_for_delivery'
  | 'arrived_destination'
  | 'delivered'
  | 'cancelled';

export type FulfillmentType = 'pickup' | 'delivery';

export type PaymentMethodType =
  | 'stripe_card'
  | 'paypal'
  | 'payid_au'
  | 'afterpay_au'
  | 'bpay_au'
  | 'poli_au'
  | 'apple_pay'
  | 'cash_on_delivery';

export interface PaymentDetails {
  method: PaymentMethodType;
  provider: string;
  transactionId: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paidAt: string;
  cardLast4?: string;
  cardBrand?: string;
  payIdHandle?: string;
  bpayBillerCode?: string;
  bpayRef?: string;
  installments?: {
    count: number;
    amountPerInstallment: number;
    frequency: string;
  };
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalDeliveries: number;
  vehicleType: 'Car' | 'E-Bike' | 'Scooter' | 'Van';
  vehiclePlate: string;
  vehicleModel: string;
  currentLat: number;
  currentLng: number;
  status: 'available' | 'busy' | 'offline';
  todayEarnings: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  category: GroceryCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  unit: string;
  substitution: 'best_match' | 'contact_me' | 'refund';
  isPacked?: boolean;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderRole: 'customer' | 'driver' | 'vendor' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress: {
    street: string;
    unitNumber?: string;
    suburb: string;
    state: string;
    postcode: string;
    deliveryInstructions?: string;
    lat: number;
    lng: number;
  };
  vendorIds: string[];
  vendorNames: string[];
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  driverTip: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  payment: PaymentDetails;
  driver?: DeliveryDriver;
  assignedDriverId?: string;
  createdAt: string;
  estimatedDeliveryTime: string;
  actualDeliveredTime?: string;
  deliveryProofPhoto?: string;
  customerSignature?: string;
  timeline: OrderTimelineEvent[];
  messages: OrderMessage[];
  driverCoordinates?: {
    lat: number;
    lng: number;
    heading?: number;
    progressPercent: number; // 0 to 100
  };
}

export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  unitNumber?: string;
  suburb: string;
  state: string;
  postcode: string;
  deliveryInstructions: string;
  isDefault: boolean;
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: CustomerAddress[];
  savedPaymentMethods: {
    id: string;
    type: PaymentMethodType;
    details: string;
    isDefault: boolean;
  }[];
  dietaryPreferences: DietaryTag[];
  loyaltyPoints: number;
}

export interface DynamicPricingConfig {
  enabled: boolean;
  surplusDiscountPercentage: number; // e.g. 15% discount for surplus stock > 30 items
  surplusThreshold: number;
  scarcitySurgePercentage: number; // e.g. 10% increase for scarce stock < 5 items
  scarcityThreshold: number;
}
