const runtimeEnv = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const apiBaseUrl = (runtimeEnv.VITE_API_URL || (runtimeEnv.VITE_USE_SAME_ORIGIN_API === 'true' ? globalThis.location.origin : '')).replace(/\/$/, '');

export interface ShippingQuote {
  fee: number;
  provider: 'flat_rate' | 'courier_ready';
  message: string;
}

export const getShippingQuote = async (suburb: string, postcode: string, subtotal: number): Promise<ShippingQuote> => {
  if (!apiBaseUrl) return { fee: subtotal >= 100 ? 0 : 10, provider: 'flat_rate', message: subtotal >= 100 ? 'Free local delivery' : 'Standard local delivery' };
  const response = await fetch(`${apiBaseUrl}/api/shipping/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ suburb, postcode, subtotal }),
  });
  if (!response.ok) throw new Error(`Shipping quote failed (${response.status})`);
  return response.json();
};

export const submitOrderToBackend = async (order: unknown): Promise<void> => {
  if (!apiBaseUrl) return;
  const response = await fetch(`${apiBaseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error(`Order submission failed (${response.status})`);
};