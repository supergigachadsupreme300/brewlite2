import { PRODUCTS_SEED } from './products/products.seed';

function main() {
  console.log(`Seeding ${PRODUCTS_SEED.length} products...`);
  PRODUCTS_SEED.forEach((product) => {
    console.log(`- ${product.id}: ${product.name} (stock: ${product.stock})`);
  });
  console.log('Seed completed.');
}

main();