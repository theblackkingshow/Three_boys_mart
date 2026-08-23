import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserRole,
  StoreSector,
  GroceryCategory,
  DietaryTag,
  Vendor,
  Product,
  CartItem,
  Order,
  OrderStatus,
  DeliveryDriver,
  UserProfile,
  DynamicPricingConfig,
  PaymentDetails,
  OrderMessage,
} from '../types';
import {
  INITIAL_VENDORS,
  INITIAL_PRODUCTS,
  INITIAL_DRIVERS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from '../data/mockData';
import {
  DEFAULT_PRICING_CONFIG,
  updateProductDynamicPrices,
  calculateDynamicPrice,
} from '../services/dynamicPricing';
import { loadCatalogProducts, uploadProductAndInsert, uploadProductImage, updateProductRecord } from '../services/catalogApi';

interface AppContextType {
  // Role & Current User
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  loginAs: (role: UserRole, customDetails?: { name: string; email: string }) => void;
  logout: () => void;

  // Vendors & Stores
  vendors: Vendor[];
  selectedVendorId: string | null;
  setSelectedVendorId: (id: string | null) => void;
  currentVendor: Vendor | undefined;

  // Products & Dynamic Pricing
  products: Product[];
  pricingConfig: DynamicPricingConfig;
  updatePricingConfig: (config: Partial<DynamicPricingConfig>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProductBasePrice: (productId: string, newBasePrice: number) => void;
  updateProductImage: (productId: string, imageFile: File) => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id' | 'currentPrice'>, imageFile?: File) => Promise<void>;

  // Search & Filtering
  selectedSector: StoreSector;
  setSelectedSector: (sector: StoreSector) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: GroceryCategory | 'All';
  setSelectedCategory: (category: GroceryCategory | 'All') => void;
  selectedDietary: DietaryTag[];
  toggleDietaryFilter: (tag: DietaryTag) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onlyInStock: boolean;
  setOnlyInStock: (only: boolean) => void;
  sortBy: 'popularity' | 'price_asc' | 'price_desc' | 'discount' | 'rating';
  setSortBy: (sort: 'popularity' | 'price_asc' | 'price_desc' | 'discount' | 'rating') => void;
  filteredProducts: Product[];
  resetFilters: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    substitution?: 'best_match' | 'contact_me' | 'refund'
  ) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  validateCartInventory: () => { isValid: boolean; message?: string };
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartServiceFee: number;
  driverTip: number;
  setDriverTip: (tip: number) => void;
  cartTotal: number;
  cartUniqueVendors: Vendor[];

  // Orders & Real-time Tracking
  orders: Order[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  activeTrackingOrder: Order | undefined;
  createOrder: (orderData: {
    payment: PaymentDetails;
    addressId?: string;
    customAddress?: Order['deliveryAddress'];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  sendOrderMessage: (
    orderId: string,
    senderRole: 'customer' | 'driver' | 'vendor' | 'system',
    senderName: string,
    text: string
  ) => void;
  simulateAdvanceOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;

  // Drivers
  drivers: DeliveryDriver[];
  activeDriverId: string;
  setActiveDriverId: (id: string) => void;
  activeDriver: DeliveryDriver | undefined;
  assignDriverToOrder: (orderId: string, driverId: string) => void;
  updateDriverStatus: (driverId: string, status: 'available' | 'busy' | 'offline') => void;

  // UI Modals & Navigation
  activeModal: 'cart' | 'checkout' | 'product_detail' | 'profile' | 'recipe_ai' | 'pricing_rules' | 'login' | null;
  setActiveModal: (modal: 'cart' | 'checkout' | 'product_detail' | 'profile' | 'recipe_ai' | 'pricing_rules' | 'login' | null) => void;
  selectedProductForModal: Product | null;
  openProductDetail: (product: Product) => void;
  activeTab: 'store' | 'tracking' | 'driver_portal' | 'vendor_portal' | 'admin_dashboard' | 'user_profile';
  setActiveTab: (tab: 'store' | 'tracking' | 'driver_portal' | 'vendor_portal' | 'admin_dashboard' | 'user_profile') => void;

  // Notification Toast
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Role
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);

  // Tabs & Modals
  const [activeTab, setActiveTab] = useState<'store' | 'tracking' | 'driver_portal' | 'vendor_portal' | 'admin_dashboard' | 'user_profile'>('store');
  const [activeModal, setActiveModal] = useState<'cart' | 'checkout' | 'product_detail' | 'profile' | 'recipe_ai' | 'pricing_rules' | 'login' | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Role Authentication Handler with Automatic Dedicated Page Routing
  const loginAs = (role: UserRole, customDetails?: { name: string; email: string }) => {
    setUserRole(role);
    setActiveModal(null);

    // Update profile info based on role
    if (role === 'admin') {
      setUserProfile((prev) => ({
        ...prev,
        name: customDetails?.name || 'Alexander Hayes',
        email: customDetails?.email || 'admin@freshmarket.com.au',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      }));
      setActiveTab('admin_dashboard');
      showToast('Authenticated as Administrator: Redirecting to Admin Command Center', 'success');
    } else if (role === 'driver') {
      setUserProfile((prev) => ({
        ...prev,
        name: customDetails?.name || 'Marcus Vance',
        email: customDetails?.email || 'driver.marcus@freshmarket.com.au',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      }));
      setActiveTab('driver_portal');
      showToast('Authenticated as Delivery Driver: Redirecting to Driver GPS Application', 'success');
    } else if (role === 'vendor') {
      setUserProfile((prev) => ({
        ...prev,
        name: customDetails?.name || 'Elena Rostova',
        email: customDetails?.email || 'manager@metro-supermarket.com.au',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      }));
      setActiveTab('vendor_portal');
      showToast('Authenticated as Merchant: Redirecting to Supermarket & Kitchen Portal', 'success');
    } else {
      setUserProfile((prev) => ({
        ...prev,
        name: customDetails?.name || 'Alexandria Morgan',
        email: customDetails?.email || 'alex.morgan@sydney.com.au',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      }));
      setActiveTab('store');
      showToast('Authenticated as Customer: Redirecting to Food & Grocery Storefront', 'success');
    }
  };

  const logout = () => {
    setUserRole('customer');
    setActiveTab('store');
    showToast('Signed out of ecosystem account', 'info');
  };

  // Data
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [pricingConfig, setPricingConfig] = useState<DynamicPricingConfig>(DEFAULT_PRICING_CONFIG);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [drivers, setDrivers] = useState<DeliveryDriver[]>(INITIAL_DRIVERS);
  const [activeDriverId, setActiveDriverId] = useState<string>('driver-1');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>('ord-1092');

  // Search & Filter
  const [selectedSector, setSelectedSector] = useState<StoreSector>('all');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GroceryCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'discount' | 'rating'>('popularity');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [driverTip, setDriverTip] = useState<number>(3.0);

  useEffect(() => {
    loadCatalogProducts()
      .then((remoteProducts) => {
        if (remoteProducts?.length) setProducts(updateProductDynamicPrices(remoteProducts, pricingConfig));
      })
      .catch(() => showToast('Using local catalog while the database is unavailable', 'warning'));
  }, []);


  // Sync Dynamic Pricing on Stock or Config Change
  const updatePricingConfig = (newConfig: Partial<DynamicPricingConfig>) => {
    setPricingConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      setProducts((currentProducts) => updateProductDynamicPrices(currentProducts, updated));
      return updated;
    });
    showToast('Dynamic pricing configuration updated', 'success');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const calc = calculateDynamicPrice(p.basePrice, newStock, pricingConfig);
          return {
            ...p,
            stock: newStock,
            currentPrice: calc.currentPrice,
            pricingTierInfo: calc.tierInfo,
          };
        }
        return p;
      })
    );
    showToast(`Inventory updated. Customer dynamic price re-evaluated.`, 'info');
  };

  const updateProductBasePrice = (productId: string, newBasePrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const calc = calculateDynamicPrice(newBasePrice, p.stock, pricingConfig);
          return {
            ...p,
            basePrice: newBasePrice,
            currentPrice: calc.currentPrice,
            pricingTierInfo: calc.tierInfo,
          };
        }
        return p;
      })
    );
  };

  const updateProductImage = async (productId: string, imageFile: File) => {
    try {
      const image = await uploadProductImage(imageFile);
      if (image) {
        const savedProduct = await updateProductRecord(productId, { image });
        setProducts((prev) => prev.map((product) => product.id === productId ? { ...product, image: savedProduct?.image || image } : product));
      } else {
        const localImage = URL.createObjectURL(imageFile);
        setProducts((prev) => prev.map((product) => product.id === productId ? { ...product, image: localImage } : product));
      }
      showToast('Product image updated', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Product image could not be updated', 'warning');
    }
  };

  const addNewProduct = async (rawProduct: Omit<Product, 'id' | 'currentPrice'>, imageFile?: File) => {
    const calc = calculateDynamicPrice(rawProduct.basePrice, rawProduct.stock, pricingConfig);
    const newProd: Product = {
      ...rawProduct,
      id: `prod-${Date.now()}`,
      currentPrice: calc.currentPrice,
      pricingTierInfo: calc.tierInfo,
    };
    setProducts((prev) => [newProd, ...prev]);
    try {
      const savedProduct = await uploadProductAndInsert(rawProduct, imageFile);
      if (savedProduct) setProducts((prev) => [savedProduct, ...prev.filter((product) => product.id !== newProd.id)]);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Product could not be saved remotely', 'warning');
    }
    showToast(`Added ${newProd.name} to catalog`, 'success');
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
    showToast('Profile updated successfully', 'success');
  };

  // Switch role and update tab if appropriate
  const handleSetUserRole = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'customer') {
      setActiveTab('store');
    } else if (newRole === 'driver') {
      setActiveTab('driver_portal');
    } else if (newRole === 'vendor') {
      setActiveTab('vendor_portal');
    } else if (newRole === 'admin') {
      setActiveTab('admin_dashboard');
    }
    showToast(`Switched view to ${newRole.toUpperCase()} mode`, 'info');
  };

  // Filters
  const toggleDietaryFilter = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSelectedSector('all');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedVendorId(null);
    setSelectedDietary([]);
    setPriceRange([0, 50]);
    setOnlyInStock(false);
    setSortBy('popularity');
  };

  const currentVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId),
    [vendors, selectedVendorId]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Sector filter (All / Grocery supermarket items / Prepared hot food & meals)
        if (selectedSector === 'grocery' && p.itemType !== 'grocery') return false;
        if (selectedSector === 'food' && p.itemType !== 'food') return false;
        // Vendor filter
        if (selectedVendorId && p.vendorId !== selectedVendorId) return false;
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchCategory = p.category.toLowerCase().includes(query);
          const matchBrand = p.brand.toLowerCase().includes(query);
          const matchVendor = p.vendorName.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCategory && !matchBrand && !matchVendor) {
            return false;
          }
        }
        // Dietary filter
        if (selectedDietary.length > 0) {
          const hasAllDietary = selectedDietary.every((tag) => p.dietary.includes(tag));
          if (!hasAllDietary) return false;
        }
        // Price filter
        if (p.currentPrice < priceRange[0] || p.currentPrice > priceRange[1]) return false;
        // In Stock filter
        if (onlyInStock && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.currentPrice - b.currentPrice;
        if (sortBy === 'price_desc') return b.currentPrice - a.currentPrice;
        if (sortBy === 'discount') {
          const discA = a.pricingTierInfo?.discountPercent || 0;
          const discB = b.pricingTierInfo?.discountPercent || 0;
          return discB - discA;
        }
        if (sortBy === 'rating') {
          return b.stock - a.stock;
        }
        // Default popularity
        return b.initialStock - a.initialStock;
      });
  }, [products, selectedSector, selectedVendorId, selectedCategory, searchQuery, selectedDietary, priceRange, onlyInStock, sortBy]);

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number = 1,
    substitution: 'best_match' | 'contact_me' | 'refund' = 'best_match'
  ) => {
    if (product.stock <= 0) {
      showToast('Item is currently out of stock', 'warning');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity, selectedSubstitution: substitution }];
      }
    });
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const safeQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: safeQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const validateCartInventory = () => {
    const unavailableItem = cart.find((item) => {
      const currentProduct = products.find((product) => product.id === item.product.id);
      return !currentProduct || currentProduct.stock < item.quantity;
    });

    if (!unavailableItem) return { isValid: true };

    const currentProduct = products.find((product) => product.id === unavailableItem.product.id);
    const availableStock = currentProduct?.stock ?? 0;
    return {
      isValid: false,
      message: unavailableItem.product.name + ' only has ' + availableStock + ' item' + (availableStock === 1 ? '' : 's') + ' available. Update your cart before checkout.',
    };
  };

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return Number(
      cart.reduce((sum, item) => sum + item.product.currentPrice * item.quantity, 0).toFixed(2)
    );
  }, [cart]);

  const cartUniqueVendors = useMemo(() => {
    const vendorIds = Array.from(new Set(cart.map((item) => item.product.vendorId)));
    return vendors.filter((v) => vendorIds.includes(v.id));
  }, [cart, vendors]);

  const cartDeliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    // Base delivery fee from primary vendor or average
    return cartUniqueVendors.length > 0 ? cartUniqueVendors[0].deliveryFee : 4.99;
  }, [cart.length, cartUniqueVendors]);

  const cartServiceFee = useMemo(() => {
    return cart.length > 0 ? 1.5 : 0;
  }, [cart.length]);

  const cartTotal = useMemo(() => {
    return Number((cartSubtotal + cartDeliveryFee + cartServiceFee + driverTip).toFixed(2));
  }, [cartSubtotal, cartDeliveryFee, cartServiceFee, driverTip]);

  // Order Placement
  const createOrder = (orderData: {
    payment: PaymentDetails;
    addressId?: string;
    customAddress?: Order['deliveryAddress'];
  }): Order | null => {
    const inventoryCheck = validateCartInventory();
    if (!inventoryCheck.isValid) {
      showToast(inventoryCheck.message || 'Some cart items are no longer available.', 'warning');
      return null;
    }

    const address =
      orderData.customAddress ||
      (userProfile.addresses.find((a) => a.id === orderData.addressId) || userProfile.addresses[0]);

    const vendorIds: string[] = Array.from(new Set<string>(cart.map((i) => i.product.vendorId)));
    const vendorNames: string[] = Array.from(new Set<string>(cart.map((i) => i.product.vendorName)));

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      vendorId: item.product.vendorId,
      vendorName: item.product.vendorName,
      category: item.product.category,
      quantity: item.quantity,
      unitPrice: item.product.currentPrice,
      totalPrice: Number((item.product.currentPrice * item.quantity).toFixed(2)),
      image: item.product.image,
      unit: item.product.unit,
      substitution: item.selectedSubstitution,
      isPacked: false,
    }));

    // Deduct stock from the current catalog value after inventory validation.
    cart.forEach((item) => {
      const currentProduct = products.find((product) => product.id === item.product.id);
      if (currentProduct) {
        updateProductStock(item.product.id, currentProduct.stock - item.quantity);
      }
    });

    const randomDriver = drivers.find((d) => d.status === 'available') || drivers[0];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `FM-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: userProfile.id,
      customerName: userProfile.name,
      customerPhone: userProfile.phone,
      customerEmail: userProfile.email,
      deliveryAddress: {
        street: address.street,
        unitNumber: address.unitNumber,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        deliveryInstructions: address.deliveryInstructions,
        lat: address.lat || -33.8824,
        lng: address.lng || 151.2118,
      },
      vendorIds,
      vendorNames,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      serviceFee: cartServiceFee,
      driverTip,
      discountAmount: 0,
      totalAmount: cartTotal,
      currency: 'AUD',
      status: 'order_placed',
      payment: orderData.payment,
      driver: randomDriver,
      assignedDriverId: randomDriver.id,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: `${new Date(Date.now() + 25 * 60000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} (~25 mins)`,
      timeline: [
        {
          status: 'order_placed',
          label: `Order Placed & Payment Confirmed (${orderData.payment.provider})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          notes: `Paid $${cartTotal.toFixed(2)} AUD via ${orderData.payment.provider}. Transaction ID: ${orderData.payment.transactionId}`,
        },
        {
          status: 'vendor_accepted',
          label: 'Store Acknowledged & Order Queued',
          timestamp: 'Pending',
          completed: false,
        },
        {
          status: 'packing_items',
          label: 'Packing Fresh Groceries in Insulated Bags',
          timestamp: 'Pending',
          completed: false,
        },
        {
          status: 'driver_assigned',
          label: `Driver Assigned (${randomDriver.name})`,
          timestamp: 'Pending',
          completed: false,
        },
        {
          status: 'out_for_delivery',
          label: 'Out For Delivery (Live GPS Tracking)',
          timestamp: 'Pending',
          completed: false,
        },
        {
          status: 'delivered',
          label: 'Delivered at Doorstep',
          timestamp: 'Pending',
          completed: false,
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          orderId: `ord-${Date.now()}`,
          senderRole: 'system',
          senderName: 'FreshMarket Engine',
          text: `Your grocery order #${orderData.payment.transactionId.slice(-6)} has been placed! Stores are preparing your items.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      driverCoordinates: {
        lat: -33.8688,
        lng: 151.2093,
        heading: 180,
        progressPercent: 10,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    clearCart();
    setActiveModal(null);
    setActiveTab('tracking');
    showToast(`Order ${newOrder.orderNumber} successfully placed!`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const updatedTimeline = ord.timeline.map((evt) => {
            if (evt.status === status) {
              return { ...evt, completed: true, timestamp: now, notes: notes || evt.notes };
            }
            return evt;
          });

          // If delivered, mark delivered time
          const isDelivered = status === 'delivered';
          return {
            ...ord,
            status,
            actualDeliveredTime: isDelivered ? now : ord.actualDeliveredTime,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to ${status.replace(/_/g, ' ').toUpperCase()}`, 'info');
  };

  const simulateAdvanceOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const stages: OrderStatus[] = [
      'order_placed',
      'vendor_accepted',
      'packing_items',
      'driver_assigned',
      'out_for_delivery',
      'delivered',
    ];
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
    showToast(`Order cancelled and refunded to payment method`, 'warning');
  };

  const sendOrderMessage = (
    orderId: string,
    senderRole: 'customer' | 'driver' | 'vendor' | 'system',
    senderName: string,
    text: string
  ) => {
    if (!text.trim()) return;
    const newMsg: OrderMessage = {
      id: `msg-${Date.now()}`,
      orderId,
      senderRole,
      senderName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, messages: [...ord.messages, newMsg] };
        }
        return ord;
      })
    );
  };

  const assignDriverToOrder = (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            driver,
            assignedDriverId: driver.id,
            status: ord.status === 'order_placed' || ord.status === 'vendor_accepted' ? 'driver_assigned' : ord.status,
          };
        }
        return ord;
      })
    );
    showToast(`Driver ${driver.name} assigned to order`, 'success');
  };

  const updateDriverStatus = (driverId: string, status: 'available' | 'busy' | 'offline') => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status } : d))
    );
  };

  // Live GPS Simulation Timer for 'out_for_delivery' active orders
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.status === 'out_for_delivery' && ord.driverCoordinates) {
            const currentProgress = ord.driverCoordinates.progressPercent;
            if (currentProgress < 98) {
              const nextProgress = Math.min(100, currentProgress + 2);
              // Interpolate lat/lng from store to customer
              const storeLat = -33.8688;
              const storeLng = 151.2093;
              const destLat = ord.deliveryAddress.lat;
              const destLng = ord.deliveryAddress.lng;
              const t = nextProgress / 100;
              const newLat = storeLat + (destLat - storeLat) * t;
              const newLng = storeLng + (destLng - storeLng) * t;

              return {
                ...ord,
                driverCoordinates: {
                  lat: Number(newLat.toFixed(6)),
                  lng: Number(newLng.toFixed(6)),
                  heading: 165,
                  progressPercent: nextProgress,
                },
              };
            }
          }
          return ord;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const openProductDetail = (product: Product) => {
    setSelectedProductForModal(product);
    setActiveModal('product_detail');
  };

  const activeTrackingOrder = useMemo(
    () => orders.find((o) => o.id === activeTrackingOrderId) || orders[0],
    [orders, activeTrackingOrderId]
  );

  const activeDriver = useMemo(
    () => drivers.find((d) => d.id === activeDriverId) || drivers[0],
    [drivers, activeDriverId]
  );

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        userProfile,
        updateUserProfile,
        loginAs,
        logout,
        vendors,
        selectedVendorId,
        setSelectedVendorId,
        currentVendor,
        products,
        pricingConfig,
        updatePricingConfig,
        updateProductStock,
        updateProductBasePrice,
        updateProductImage,
        addNewProduct,
        selectedSector,
        setSelectedSector,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDietary,
        toggleDietaryFilter,
        priceRange,
        setPriceRange,
        onlyInStock,
        setOnlyInStock,
        sortBy,
        setSortBy,
        filteredProducts,
        resetFilters,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        validateCartInventory,
        cartSubtotal,
        cartDeliveryFee,
        cartServiceFee,
        driverTip,
        setDriverTip,
        cartTotal,
        cartUniqueVendors,
        orders,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        activeTrackingOrder,
        createOrder,
        updateOrderStatus,
        sendOrderMessage,
        simulateAdvanceOrder,
        cancelOrder,
        drivers,
        activeDriverId,
        setActiveDriverId,
        activeDriver,
        assignDriverToOrder,
        updateDriverStatus,
        activeModal,
        setActiveModal,
        selectedProductForModal,
        openProductDetail,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
