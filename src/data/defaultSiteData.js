/** Default CMS payload — structure mirrors common thrift storefront nav (e.g. rewago.in style columns). */

const megaCategories = {
  men: [
    {
      heading: 'NEW ARRIVAL',
      sections: [
        {
          title: 'Clothing',
          items: [
            'Shirts',
            'T-shirts',
            'Jackets',
            'Blazers',
            'Jeans',
            'Trousers',
            'Shorts',
            'Kurtas',
            'Dhothis',
          ],
        },
      ],
    },
    {
      heading: '',
      sections: [{ title: 'Bags & Backpacks', items: [] }],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Footwear',
          items: [
            'Casual Shoes',
            'Sports Shoes',
            'Formal Shoes',
            'Sneakers',
            'Sandals & Floaters',
            'Flip-Flops',
            'Socks',
          ],
        },
      ],
    },
    {
      heading: '',
      sections: [{ title: 'Fashion Accessories', items: ['Belts, Wallets & More'] }],
    },
  ],
  women: [
    {
      heading: 'NEW ARRIVAL',
      sections: [
        {
          title: 'Clothing',
          items: [
            'Tops',
            'Dresses',
            'Blazers',
            'Trousers',
            'Jeans',
            'Jackets',
            'Skirts',
            'Kurti',
            'Churidar Bottoms',
            'Shawls',
            'Sarees',
            'Blouses',
            'Swimwear',
            'Sleepwear',
          ],
        },
      ],
    },
    {
      heading: '',
      sections: [{ title: 'Handbags, Bags & Backpacks', items: [] }],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Footwear',
          items: [
            'Casual Shoes',
            'Flats',
            'Heels',
            'Boots',
            'Sports Shoes & Floaters',
          ],
        },
      ],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Jewellery',
          items: ['Fashion Jewellery', 'Fine Jewellery', 'Earrings'],
        },
      ],
    },
    {
      heading: '',
      sections: [{ title: 'Belts, Wallets & More', items: [] }],
    },
  ],
  kids: [
    {
      heading: 'NEW ARRIVAL',
      sections: [
        {
          title: 'Boys Clothing',
          items: [
            'Shirts',
            'T-Shirts',
            'Jackets',
            'Blazers',
            'Jeans',
            'Trousers',
            'Shorts',
            'Kurtas',
            'Dhotis',
            'Sweatshirts',
          ],
        },
      ],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Girls Clothing',
          items: ['Tops', 'Dresses', 'Jeans', 'Trousers', 'Jackets', 'Sweatshirts'],
        },
      ],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Footwear',
          items: [
            'Casual Shoes',
            'FlipFlops',
            'Sport Shoes',
            'Flats',
            'Sandals',
            'Heels',
            'School Shoes',
            'Socks',
          ],
        },
      ],
    },
    {
      heading: '',
      sections: [{ title: 'Kids Accessories', items: ['Infants'] }],
    },
    {
      heading: '',
      sections: [{ title: 'Toys & Games', items: [] }],
    },
  ],
  luxury: [
    {
      heading: '',
      sections: [{ title: 'Bags', items: [] }],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Women',
          items: ['Womens Dress', 'Womens Jackets'],
        },
      ],
    },
    {
      heading: '',
      sections: [
        {
          title: 'Men',
          items: ['Mens Shoes', 'Mens Jackets'],
        },
      ],
    },
  ],
};

export const defaultSiteData = {
  menu: [
    { id: 'men', label: 'MEN' },
    { id: 'women', label: 'WOMEN' },
    { id: 'kids', label: 'KIDS' },
    { id: 'luxury', label: 'Luxury Brands' },
  ],
  hero: {
    title: 'THE GO-TO FOR THRIFTED STYLE AT LOW PRICE',
    subtitle: 'Wear the change — preloved fashion for everyone.',
    imageUrl: 'https://picsum.photos/seed/rewago-hero/1600/700',
    ctaLabel: 'View catalog',
  },
  promoTiles: [
    {
      label: 'Casual Wear',
      discount: '75-85% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-casual/400/400',
      searchQuery: 'casual',
      categoryId: 'all',
    },
    {
      label: 'Formal Wear',
      discount: '65-75% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-formal/400/400',
      searchQuery: 'formal',
      categoryId: 'all',
    },
    {
      label: 'Denim Wear',
      discount: '70-80% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-denim/400/400',
      searchQuery: 'denim',
      categoryId: 'all',
    },
    {
      label: 'Party Wear',
      discount: '75-82% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-party/400/400',
      searchQuery: 'party',
      categoryId: 'all',
    },
    {
      label: 'Active Wear',
      discount: '75-85% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-active/400/400',
      searchQuery: 'active',
      categoryId: 'all',
    },
    {
      label: 'Ethnic Wear',
      discount: '65-75% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-ethnic/400/400',
      searchQuery: 'ethnic',
      categoryId: 'all',
    },
    {
      label: 'Kids Wear',
      discount: '70-80% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-kids/400/400',
      searchQuery: 'kids',
      categoryId: 'kids',
    },
    {
      label: 'Winter Wear',
      discount: '75-85% OFF',
      imageUrl: 'https://picsum.photos/seed/tile-winter/400/400',
      searchQuery: 'winter',
      categoryId: 'all',
    },
  ],
  trustBar: [
    'BUY, SELL AND DONATE WITH REWAGO',
    'FREE SHIPPING',
    'FLASH SALE ON EVERY THURSDAYS',
  ],
  sections: {
    trending: [
      {
        id: 'men-shoe-1',
        title: 'Floral Shirt',
        subtitle: 'Thrift Store Bombay',
        category: 'women',
        subcategory: 'Tops',
        brand: 'Allen Solly',
        imageUrl: 'https://picsum.photos/seed/trending-1/500/650',
        price: 999,
        stock: 4,
        tags: 'casual, women, tops',
      },
      {
        id: 'men-shoe-2',
        title: 'Adidas 4DFWD',
        subtitle: 'Prekickz',
        category: 'men',
        subcategory: 'Casual Shoes',
        brand: 'Adidas',
        imageUrl: 'https://picsum.photos/seed/trending-2/500/650',
        price: 7259,
        stock: 3,
        tags: 'casual, men, sneakers',
      },
      {
        id: 'women-dress-1',
        title: 'Black Polka Dress',
        subtitle: 'Vintage Streets',
        category: 'women',
        subcategory: 'Dresses',
        brand: 'BIBA',
        imageUrl: 'https://picsum.photos/seed/trending-3/500/650',
        price: 1399,
        stock: 6,
        tags: 'party, women, dress',
      },
    ],
    brands: [
      { name: 'Allen Solly', imageUrl: 'https://picsum.photos/seed/brand-1/220/220' },
      { name: 'BIBA', imageUrl: 'https://picsum.photos/seed/brand-2/220/220' },
      { name: 'H&M', imageUrl: 'https://picsum.photos/seed/brand-3/220/220' },
      { name: 'Levis', imageUrl: 'https://picsum.photos/seed/brand-4/220/220' },
    ],
    faq: [
      {
        question: 'Can I get a refund if the item I received is torn or slightly damaged?',
        answer:
          'If damage was not mentioned in the listing or shown in photos, you may request a refund within 48 hours with images.',
      },
      {
        question: 'Can I donate clothes to you? How does it work?',
        answer: 'Yes — contact us with details; we list quality preloved items and support charity from sales.',
      },
      {
        question: 'If I become a seller, do I have to manage delivery or customer messages?',
        answer: 'We handle logistics and customer support; you focus on listing great pieces.',
      },
    ],
    categories: megaCategories,
    blogs: [
      {
        id: 'blog-1',
        title: 'Thrifting Isn’t Boring — It’s a Whole New Vibe',
        excerpt: 'Fresh, creative, full of personality. Vintage gems or modern drops.',
        author: 'Rewago Editorial',
        imageUrl: 'https://picsum.photos/seed/blog-1/900/500',
      },
      {
        id: 'blog-2',
        title: 'How to Build a Capsule Wardrobe (The Thrifted Way)',
        excerpt: 'Fewer pieces, more outfits — curated preloved picks that work together.',
        author: 'Style Team',
        imageUrl: 'https://picsum.photos/seed/blog-2/900/500',
      },
      {
        id: 'blog-3',
        title: 'Rewago Unfiltered: Making Thrift Shopping India’s Next Obsession',
        excerpt: 'Slow fashion, upcycling, and community — the story behind the racks.',
        author: 'Team Rewago',
        imageUrl: 'https://picsum.photos/seed/blog-3/900/500',
      },
    ],
  },
  sellerBanner: {
    title: 'Want to Sell with Rewago?',
    body: "Got clothes you've loved but don't wear anymore? We're here to help you pass them on and make some money while you're at it!",
    ctaLabel: 'JOIN AS A SELLER',
  },
  donation: {
    title: 'Donate preloved clothes',
    description:
      'Drop your WhatsApp number below and we will get in touch with the next steps.',
    placeholder: 'Enter your WhatsApp number',
    buttonLabel: 'Send',
  },
};
