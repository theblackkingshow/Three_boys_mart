import { Product } from '../types';

const runtimeEnv = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const apiBaseUrl = (runtimeEnv.VITE_API_URL || '').replace(/\/$/, '');

export const loadCatalogProducts = async (): Promise<Product[] | null> => {
  if (!apiBaseUrl) return null;
  const response = await fetch(`${apiBaseUrl}/api/products`);
  if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
  return response.json();
};

export const uploadProductAndInsert = async (
  product: Omit<Product, 'id' | 'currentPrice'>,
  imageFile?: File
): Promise<Product | null> => {
  if (!apiBaseUrl) return null;
  let image = product.image;
  if (imageFile) {
    const upload = await fetch(`${apiBaseUrl}/api/uploads/product-image`, {
      method: 'POST',
      headers: { 'Content-Type': imageFile.type, 'X-File-Name': imageFile.name },
      body: imageFile,
    });
    if (!upload.ok) throw new Error(`Image upload failed (${upload.status})`);
    image = (await upload.json()).url;
  }

  const response = await fetch(`${apiBaseUrl}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, image }),
  });
  if (!response.ok) throw new Error(`Product insert failed (${response.status})`);
  return response.json();
};