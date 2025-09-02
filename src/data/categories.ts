import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'men',
    name: 'Men',
    slug: 'men',
    description: 'Men\'s clothing and accessories',
    productCount: 45,
    subcategories: [
      {
        id: 'men-tops',
        name: 'Tops & Shirts',
        slug: 'men-tops',
        parentId: 'men',
        productCount: 15,
        subcategories: [
          { id: 'men-tshirts', name: 'T-Shirts', slug: 'men-tshirts', parentId: 'men-tops', productCount: 8 },
          { id: 'men-shirts', name: 'Shirts', slug: 'men-shirts', parentId: 'men-tops', productCount: 5 },
          { id: 'men-hoodies', name: 'Hoodies & Sweatshirts', slug: 'men-hoodies', parentId: 'men-tops', productCount: 4 },
          { id: 'men-jackets', name: 'Jackets', slug: 'men-jackets', parentId: 'men-tops', productCount: 6 },
          { id: 'men-sweaters', name: 'Sweaters & Cardigans', slug: 'men-sweaters', parentId: 'men-tops', productCount: 3 }
        ]
      },
      {
        id: 'men-bottoms',
        name: 'Bottoms',
        slug: 'men-bottoms',
        parentId: 'men',
        productCount: 12,
        subcategories: [
          { id: 'men-jeans', name: 'Jeans', slug: 'men-jeans', parentId: 'men-bottoms', productCount: 6 },
          { id: 'men-trousers', name: 'Trousers', slug: 'men-trousers', parentId: 'men-bottoms', productCount: 4 },
          { id: 'men-shorts', name: 'Shorts', slug: 'men-shorts', parentId: 'men-bottoms', productCount: 3 },
          { id: 'men-trackpants', name: 'Track Pants & Joggers', slug: 'men-trackpants', parentId: 'men-bottoms', productCount: 2 }
        ]
      },
      {
        id: 'men-ethnic',
        name: 'Ethnic Wear',
        slug: 'men-ethnic',
        parentId: 'men',
        productCount: 8,
        subcategories: [
          { id: 'men-kurta', name: 'Kurta Pyjama', slug: 'men-kurta', parentId: 'men-ethnic', productCount: 3 },
          { id: 'men-sherwani', name: 'Sherwani', slug: 'men-sherwani', parentId: 'men-ethnic', productCount: 2 },
          { id: 'men-nehru', name: 'Nehru Jacket', slug: 'men-nehru', parentId: 'men-ethnic', productCount: 2 },
          { id: 'men-dhoti', name: 'Dhoti Kurta', slug: 'men-dhoti', parentId: 'men-ethnic', productCount: 1 }
        ]
      },
      {
        id: 'men-formal',
        name: 'Formal Wear',
        slug: 'men-formal',
        parentId: 'men',
        productCount: 6,
        subcategories: [
          { id: 'men-suits', name: 'Suits & Blazers', slug: 'men-suits', parentId: 'men-formal', productCount: 3 },
          { id: 'men-dress', name: 'Dress Shirts & Pants', slug: 'men-dress', parentId: 'men-formal', productCount: 2 },
          { id: 'men-accessories', name: 'Ties & Bow Ties', slug: 'men-accessories', parentId: 'men-formal', productCount: 1 }
        ]
      },
      {
        id: 'men-activewear',
        name: 'Activewear',
        slug: 'men-activewear',
        parentId: 'men',
        productCount: 4,
        subcategories: [
          { id: 'men-gym', name: 'Gym T-shirts', slug: 'men-gym', parentId: 'men-activewear', productCount: 2 },
          { id: 'men-tracksuits', name: 'Tracksuits', slug: 'men-tracksuits', parentId: 'men-activewear', productCount: 1 },
          { id: 'men-sports', name: 'Sports Shorts', slug: 'men-sports', parentId: 'men-activewear', productCount: 1 }
        ]
      }
    ]
  },
  {
    id: 'women',
    name: 'Women',
    slug: 'women',
    description: 'Women\'s clothing and accessories',
    productCount: 52,
    subcategories: [
      {
        id: 'women-tops',
        name: 'Tops & Blouses',
        slug: 'women-tops',
        parentId: 'women',
        productCount: 18,
        subcategories: [
          { id: 'women-tshirts', name: 'T-Shirts & Tops', slug: 'women-tshirts', parentId: 'women-tops', productCount: 8 },
          { id: 'women-blouses', name: 'Blouses & Shirts', slug: 'women-blouses', parentId: 'women-tops', productCount: 6 },
          { id: 'women-hoodies', name: 'Hoodies & Sweatshirts', slug: 'women-hoodies', parentId: 'women-tops', productCount: 4 }
        ]
      },
      {
        id: 'women-dresses',
        name: 'Dresses',
        slug: 'women-dresses',
        parentId: 'women',
        productCount: 15,
        subcategories: [
          { id: 'women-casual-dress', name: 'Casual Dresses', slug: 'women-casual-dress', parentId: 'women-dresses', productCount: 8 },
          { id: 'women-formal-dress', name: 'Formal Dresses', slug: 'women-formal-dress', parentId: 'women-dresses', productCount: 4 },
          { id: 'women-party-dress', name: 'Party Dresses', slug: 'women-party-dress', parentId: 'women-dresses', productCount: 3 }
        ]
      },
      {
        id: 'women-bottoms',
        name: 'Bottoms',
        slug: 'women-bottoms',
        parentId: 'women',
        productCount: 12,
        subcategories: [
          { id: 'women-jeans', name: 'Jeans', slug: 'women-jeans', parentId: 'women-bottoms', productCount: 6 },
          { id: 'women-skirts', name: 'Skirts', slug: 'women-skirts', parentId: 'women-bottoms', productCount: 3 },
          { id: 'women-trousers', name: 'Trousers & Pants', slug: 'women-trousers', parentId: 'women-bottoms', productCount: 3 }
        ]
      },
      {
        id: 'women-ethnic',
        name: 'Ethnic Wear',
        slug: 'women-ethnic',
        parentId: 'women',
        productCount: 7,
        subcategories: [
          { id: 'women-sarees', name: 'Sarees', slug: 'women-sarees', parentId: 'women-ethnic', productCount: 3 },
          { id: 'women-suits', name: 'Salwar Suits', slug: 'women-suits', parentId: 'women-ethnic', productCount: 2 },
          { id: 'women-lehenga', name: 'Lehenga Choli', slug: 'women-lehenga', parentId: 'women-ethnic', productCount: 2 }
        ]
      }
    ]
  },
  {
    id: 'kids',
    name: 'Kids',
    slug: 'kids',
    description: 'Kids\' clothing for boys and girls',
    productCount: 38,
    subcategories: [
      {
        id: 'kids-tops',
        name: 'Tops',
        slug: 'kids-tops',
        parentId: 'kids',
        productCount: 12,
        subcategories: [
          { id: 'kids-tshirts', name: 'T-Shirts & Polo', slug: 'kids-tshirts', parentId: 'kids-tops', productCount: 6 },
          { id: 'kids-shirts', name: 'Shirts & Blouses', slug: 'kids-shirts', parentId: 'kids-tops', productCount: 3 },
          { id: 'kids-hoodies', name: 'Hoodies & Sweatshirts', slug: 'kids-hoodies', parentId: 'kids-tops', productCount: 3 }
        ]
      },
      {
        id: 'kids-bottoms',
        name: 'Bottoms',
        slug: 'kids-bottoms',
        parentId: 'kids',
        productCount: 10,
        subcategories: [
          { id: 'kids-jeans', name: 'Jeans & Pants', slug: 'kids-jeans', parentId: 'kids-bottoms', productCount: 5 },
          { id: 'kids-shorts', name: 'Shorts & Skirts', slug: 'kids-shorts', parentId: 'kids-bottoms', productCount: 3 },
          { id: 'kids-trackpants', name: 'Track Pants & Leggings', slug: 'kids-trackpants', parentId: 'kids-bottoms', productCount: 2 }
        ]
      },
      {
        id: 'kids-dresses',
        name: 'Dresses (Girls)',
        slug: 'kids-dresses',
        parentId: 'kids',
        productCount: 8,
        subcategories: [
          { id: 'kids-frocks', name: 'Frocks & Party Dresses', slug: 'kids-frocks', parentId: 'kids-dresses', productCount: 5 },
          { id: 'kids-casual-dress', name: 'Casual Dresses', slug: 'kids-casual-dress', parentId: 'kids-dresses', productCount: 3 }
        ]
      },
      {
        id: 'kids-ethnic',
        name: 'Ethnic Wear',
        slug: 'kids-ethnic',
        parentId: 'kids',
        productCount: 6,
        subcategories: [
          { id: 'kids-boys-ethnic', name: 'Boys Ethnic', slug: 'kids-boys-ethnic', parentId: 'kids-ethnic', productCount: 3 },
          { id: 'kids-girls-ethnic', name: 'Girls Ethnic', slug: 'kids-girls-ethnic', parentId: 'kids-ethnic', productCount: 3 }
        ]
      },
      {
        id: 'kids-sleepwear',
        name: 'Sleepwear',
        slug: 'kids-sleepwear',
        parentId: 'kids',
        productCount: 2,
        subcategories: [
          { id: 'kids-pajamas', name: 'Pajama Sets', slug: 'kids-pajamas', parentId: 'kids-sleepwear', productCount: 2 }
        ]
      }
    ]
  }
];