import { Product, DynamicPricingConfig } from '../types';

export const DEFAULT_PRICING_CONFIG: DynamicPricingConfig = {
  enabled: true,
  surplusDiscountPercentage: 15,
  surplusThreshold: 35,
  scarcitySurgePercentage: 8,
  scarcityThreshold: 6,
};

/**
 * Calculates dynamic price based on the vendor's real-time inventory level.
 * - If stock >= surplusThreshold: Applies surplus discount (e.g. -15%) to help clear fresh stock.
 * - If stock <= scarcityThreshold and stock > 0: Applies slight scarcity demand adjustment (+8%) with low-stock badge.
 * - Otherwise: Base standard price.
 */
export function calculateDynamicPrice(
  basePrice: number,
  stock: number,
  config: DynamicPricingConfig = DEFAULT_PRICING_CONFIG
): {
  currentPrice: number;
  tierInfo: {
    status: 'surplus_discount' | 'regular' | 'scarcity_surge';
    discountPercent?: number;
    surgePercent?: number;
    reason: string;
  };
} {
  if (!config.enabled || stock <= 0) {
    return {
      currentPrice: Number(basePrice.toFixed(2)),
      tierInfo: {
        status: 'regular',
        reason: stock <= 0 ? 'Out of Stock' : 'Standard Price',
      },
    };
  }

  if (stock >= config.surplusThreshold) {
    const discount = config.surplusDiscountPercentage;
    const discountedPrice = basePrice * (1 - discount / 100);
    return {
      currentPrice: Number(Math.max(0.5, discountedPrice).toFixed(2)),
      tierInfo: {
        status: 'surplus_discount',
        discountPercent: discount,
        reason: `📉 ${discount}% Surplus Stock Saver (Vendor high inventory)`,
      },
    };
  }

  if (stock <= config.scarcityThreshold) {
    const surge = config.scarcitySurgePercentage;
    const surgedPrice = basePrice * (1 + surge / 100);
    return {
      currentPrice: Number(surgedPrice.toFixed(2)),
      tierInfo: {
        status: 'scarcity_surge',
        surgePercent: surge,
        reason: `⚡ Scarcity alert: Only ${stock} left in vendor inventory`,
      },
    };
  }

  return {
    currentPrice: Number(basePrice.toFixed(2)),
    tierInfo: {
      status: 'regular',
      reason: `Optimal stock level (${stock} units)`,
    },
  };
}

export function updateProductDynamicPrices(
  products: Product[],
  config: DynamicPricingConfig = DEFAULT_PRICING_CONFIG
): Product[] {
  return products.map((p) => {
    const calculation = calculateDynamicPrice(p.basePrice, p.stock, config);
    return {
      ...p,
      currentPrice: calculation.currentPrice,
      pricingTierInfo: calculation.tierInfo,
    };
  });
}
