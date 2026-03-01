export interface TemplateFeature {
  name: string;
  description: string;
}

export interface Template {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  category: 'Website' | 'Shopify';
  price: number;
  currency: string;
  image: string;
  features: string[];
  detailedFeatures: TemplateFeature[];
  highlights: string[];
  previewImages: string[];
  previewLabels?: string[];
  orderUrl: string;
  liveDemo?: string;
}

const SANITY_BASE = 'https://cdn.sanity.io/images/4nal441a/production';

export const templates: Template[] = [
  {
    slug: 'saloon-website',
    title: 'Elevate Your Salon Business with a High-Performance Booking Website',
    shortTitle: 'Salon Booking Website',
    description: 'Capture more clients and showcase your services with a beautiful, mobile-responsive design built for appointment booking.',
    longDescription: 'A premium salon website designed to turn visitors into booked clients. Features a sleek, modern design with built-in appointment scheduling, service galleries, and client review sections. Every detail is built to spotlight your expertise, streamline client booking, and make it easy for customers to contact or schedule with you.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/a1dfe7fbef442ecb5c9946f4695fdaaa15a4ec63-3603x2442.png?rect=0,6,3603,2431&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Mobile Responsive', 'Booking System', 'SEO Friendly'],
    detailedFeatures: [
      { name: '5 Page Website', description: 'Includes Home, About, Services, Contact, and Testimonials pages covering all your business needs.' },
      { name: '7 Days Delivery', description: 'Fully functional and beautifully designed website live in one week.' },
      { name: 'Dynamic & Mobile Responsive', description: 'Optimal viewing on smartphones, tablets, and desktops.' },
      { name: 'Appointment Booking', description: 'Built-in scheduling system with real-time availability for clients.' },
      { name: 'Service Showcase', description: 'Dedicated sections with detailed descriptions highlighting your services.' },
      { name: 'SEO Friendly', description: 'Built with best practices to rank higher in search engine results.' },
      { name: 'Contact Form', description: 'Capture leads and inquiries from potential customers.' },
      { name: 'Click-to-Call', description: 'One-tap calling directly from the website on mobile devices.' },
      { name: 'Google Maps', description: 'Integrated location map so customers can find you easily.' },
    ],
    highlights: ['60+ stores launched', '5.0 / 5.0 rating', 'Appointment booking built-in'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/014c23e9ea3eb1f1cf5ca8ad332d6c579d1dac3c-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/642cc7530f781b7f062e317c98ef5855ff8fab6e-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/b91b299114f1bcfaba227f31453d37a21103adb9-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/f5d3ebe7b4c66bac0abf613ffde94e5b6600f043-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Services', 'Booking', 'Gallery', 'Contact'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'online-tshirt-store',
    title: 'Online T-Shirt Store: Start Selling in Style',
    shortTitle: 'T-Shirt Store',
    description: 'Launch your online apparel brand with a conversion-optimized storefront built to move product from day one.',
    longDescription: 'A complete Shopify-powered t-shirt store ready to accept orders. Product catalog, size guides, payment processing, and inventory management all pre-configured. Designed for apparel brands that want to start selling fast without compromising on presentation.',
    category: 'Shopify',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/032123a1c6d3c9d62872d819e0814e110d03d75d-5760x4096.png?rect=0,105,5760,3886&w=498&h=336`,
    features: ['Shopify Store', '7 Days Delivery', 'Payment Gateway', 'Product Catalog', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Shopify Platform', description: 'Built on Shopify for reliable hosting, payment processing, and order management.' },
      { name: '7 Days Delivery', description: 'Your store live and accepting orders within one week.' },
      { name: 'Payment Gateway', description: 'Secure checkout with Stripe, PayPal, and major card providers.' },
      { name: 'Product Catalog', description: 'Organized product listings with size variants, colors, and pricing.' },
      { name: 'Mobile Responsive', description: 'Optimized shopping experience across all devices.' },
      { name: 'Inventory Management', description: 'Track stock levels and get low-inventory alerts automatically.' },
    ],
    highlights: ['Shopify-powered', 'Instant payment processing', 'Inventory tracking'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/40bddfac482782d9ef3d2d5b19540901892cc8bd-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/6023be0923126eb0713512374729cbdb34b55e24-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
    ],
    previewLabels: ['Home', 'Collection', 'Product'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'shopify-online-store',
    title: 'Your Online Store with Shopify',
    shortTitle: 'General Shopify Store',
    description: 'A versatile Shopify storefront ready for any product line. Built for speed, conversion, and easy inventory management.',
    longDescription: 'A multi-purpose Shopify storefront that adapts to any product category. Clean layout, fast load times, and a checkout flow optimized for conversion. Whether you sell physical goods, digital products, or subscriptions, this template handles it all.',
    category: 'Shopify',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/922bc40d5daec924c737b8014f43a3ab3ec970e4-5760x4096.png?rect=0,105,5760,3886&w=498&h=336`,
    features: ['Shopify Store', '7 Days Delivery', 'Payment Gateway', 'Inventory Management', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Shopify Platform', description: 'Enterprise-grade e-commerce infrastructure with 99.99% uptime.' },
      { name: '7 Days Delivery', description: 'Complete store setup and customization in one week.' },
      { name: 'Payment Gateway', description: 'Multiple payment options including credit cards, Apple Pay, and Google Pay.' },
      { name: 'Inventory Management', description: 'Real-time stock tracking with automated alerts.' },
      { name: 'Mobile Responsive', description: 'Fluid layout that converts on every screen size.' },
      { name: 'SEO Optimized', description: 'Clean URL structure and meta tags for organic discoverability.' },
    ],
    highlights: ['Multi-product support', 'Flexible catalog', 'Analytics-ready'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/16dd20dd0e4d2a052b6b5ec7dd762cf5747a2bc5-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/54b5db3c8e52775210f1c174fd5c97bac387ec6d-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
    ],
    previewLabels: ['Home', 'Collection', 'Product'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'superhero-tshirt-store',
    title: 'Online Superhero T-Shirt Store: Let Your Brand Be Legendary',
    shortTitle: 'Superhero T-Shirt Store',
    description: 'A bold, themed e-commerce store designed for niche apparel. Eye-catching design that turns browsers into buyers.',
    longDescription: 'A visually striking Shopify store built for niche apparel brands. Bold typography, dynamic product displays, and a themed design language that matches the energy of your brand. Built to stand out in a crowded market and convert casual browsers into loyal customers.',
    category: 'Shopify',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/e80a66a60e52811d9ebabb5bdd119f18a653ea0c-5760x4096.png?rect=0,105,5760,3886&w=498&h=336`,
    features: ['Shopify Store', '7 Days Delivery', 'Payment Gateway', 'Themed Design', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Themed Design', description: 'Bold, character-driven visual identity that makes your brand memorable.' },
      { name: 'Shopify Platform', description: 'Reliable infrastructure with built-in order and shipping management.' },
      { name: '7 Days Delivery', description: 'Launch-ready store in just one week.' },
      { name: 'Payment Gateway', description: 'Secure, multi-method checkout for global customers.' },
      { name: 'Product Showcase', description: 'Hero sections and featured collections that highlight bestsellers.' },
      { name: 'Mobile Responsive', description: 'Immersive mobile experience matching the desktop quality.' },
    ],
    highlights: ['Niche-focused design', 'High visual impact', 'Built for apparel'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/46eb2a9be224937be9e9094a9561fc1d35ddfa7a-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/06bc3ad349ff775b73257a2d05466237f7bbb589-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
    ],
    previewLabels: ['Home', 'Collection', 'Product'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'online-makeup-store',
    title: 'Online Makeup Store: Start Selling Beauty Products Instantly',
    shortTitle: 'Makeup Store',
    description: 'A polished beauty e-commerce experience. Showcase products with high-quality imagery and seamless checkout.',
    longDescription: 'A refined Shopify store tailored for beauty and cosmetics brands. Large product imagery, swatches, shade selectors, and a clean aesthetic that lets your products shine. From serums to palettes, every product page is designed to educate and convert.',
    category: 'Shopify',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/24d3659e54092802c3d214970d0171cabd1260a7-5760x4096.png?rect=0,105,5760,3886&w=498&h=336`,
    features: ['Shopify Store', '7 Days Delivery', 'Payment Gateway', 'Product Gallery', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Beauty-Focused Layout', description: 'Clean, elegant design that puts your products front and center.' },
      { name: 'Product Gallery', description: 'High-resolution image galleries with zoom and multi-angle views.' },
      { name: 'Shopify Platform', description: 'Trusted e-commerce platform with built-in analytics.' },
      { name: '7 Days Delivery', description: 'Your beauty store live and selling in one week.' },
      { name: 'Payment Gateway', description: 'Secure payments with global card and wallet support.' },
      { name: 'Mobile Responsive', description: 'Stunning visual experience on every device.' },
    ],
    highlights: ['Beauty-optimized layout', 'High-res galleries', 'Global payments'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/e1a5f1d4eff073192dbb0856450e95fbd6c4b099-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/ba92a409a6bacac432775cce2981670a945c69bc-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
    ],
    previewLabels: ['Home', 'Collection', 'Product'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'gaming-store',
    title: 'Launch Your Gaming Store Today: Smart Design, Fast Setup',
    shortTitle: 'Gaming Store',
    description: 'A high-energy storefront built for gaming gear and accessories. Dark-themed, fast-loading, and conversion-ready.',
    longDescription: 'A performance-focused website for gaming gear retailers. Dark-themed interface, bold product displays, and a layout designed for tech-savvy buyers who expect fast load times and seamless navigation. Built to showcase peripherals, accessories, and gear with style.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/d134f758be689aa1589b17fa0acb48c3bb9aea76-5760x4096.png?rect=0,105,5760,3886&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Payment Gateway', 'Mobile Responsive', 'SEO Friendly'],
    detailedFeatures: [
      { name: '5 Page Website', description: 'Complete site with Home, Products, About, FAQ, and Contact pages.' },
      { name: 'Dark Theme Design', description: 'High-contrast dark UI that matches gaming aesthetics.' },
      { name: '7 Days Delivery', description: 'Your gaming storefront live in one week.' },
      { name: 'Payment Gateway', description: 'Integrated checkout with multiple payment options.' },
      { name: 'Mobile Responsive', description: 'Full functionality across desktop, tablet, and mobile.' },
      { name: 'SEO Friendly', description: 'Optimized for gaming-related search terms and product discovery.' },
    ],
    highlights: ['Dark-themed UI', 'Gaming aesthetic', 'Fast load times'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/57fad525c46660ab5b5d44bde943435f8111bbfb-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/6c428d19bedc99e3663bbae1a9df88f9d3f2eea8-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
    ],
    previewLabels: ['Home', 'Products', 'Product Detail'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'electronics-store',
    title: 'Launch Your Electronics Store Online: Smart, Fast, Ready to Sell',
    shortTitle: 'Electronics Store',
    description: 'A clean, professional storefront for electronics and tech products. Organized categories, quick search, and streamlined checkout.',
    longDescription: 'A professional e-commerce website for electronics retailers. Organized product categories, spec-driven layouts, and a checkout flow built for higher-ticket tech purchases. Designed to build trust and reduce cart abandonment through clear product information and easy navigation.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/d642469a927ad733d6ccf225cc927a4abeefd2b7-5760x4096.png?rect=0,105,5760,3886&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Payment Gateway', 'Product Categories', 'Mobile Responsive'],
    detailedFeatures: [
      { name: '5 Page Website', description: 'Comprehensive site structure for electronics retail.' },
      { name: 'Product Categories', description: 'Organized navigation with category filtering and search.' },
      { name: '7 Days Delivery', description: 'Complete store ready for orders in one week.' },
      { name: 'Payment Gateway', description: 'Secure checkout supporting cards, wallets, and bank transfers.' },
      { name: 'Mobile Responsive', description: 'Clean browsing and purchasing experience on all devices.' },
      { name: 'SEO Friendly', description: 'Structured data and meta tags for product search visibility.' },
    ],
    highlights: ['Category filtering', 'Spec-driven layouts', 'Trust-building design'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/d97567ffcd0288197be3b1b5cc03fb9299e0b9a4-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/d0649e964d0505ee3f4f8867cf773bdb7fc8ef52-5760x4096.png?rect=563,0,4634,4096&w=629&h=556',
    ],
    previewLabels: ['Home', 'Products', 'Product Detail'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'furniture-store-shopify',
    title: 'Furniture Store with Shopify',
    shortTitle: 'Furniture Store',
    description: 'An elegant Shopify storefront for furniture and home decor. Large product imagery, room galleries, and easy navigation.',
    longDescription: 'An elegant Shopify store designed for furniture and home decor brands. Large-format product photography, room-setting galleries, and a browsing experience that inspires. Built for higher-ticket items where visual storytelling drives purchase decisions.',
    category: 'Shopify',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/3afa2dd29574ce4d057378cc4e34ca5c4dfe10ef-3603x2442.png?rect=0,6,3603,2431&w=498&h=336`,
    features: ['Shopify Store', '7 Days Delivery', 'Payment Gateway', 'Gallery Layout', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Gallery Layout', description: 'Large-format imagery with room-setting galleries and zoom views.' },
      { name: 'Shopify Platform', description: 'Reliable e-commerce with shipping, tax, and inventory management.' },
      { name: '7 Days Delivery', description: 'Your furniture store live and selling in one week.' },
      { name: 'Payment Gateway', description: 'Multi-payment support for higher-ticket purchases.' },
      { name: 'Collection Pages', description: 'Organized by room, style, or category for intuitive browsing.' },
      { name: 'Mobile Responsive', description: 'Visual storytelling that translates beautifully to mobile.' },
    ],
    highlights: ['Visual-first design', 'Room galleries', 'Higher-ticket optimized'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/014c23e9ea3eb1f1cf5ca8ad332d6c579d1dac3c-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/642cc7530f781b7f062e317c98ef5855ff8fab6e-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/b91b299114f1bcfaba227f31453d37a21103adb9-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/f5d3ebe7b4c66bac0abf613ffde94e5b6600f043-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Collection', 'Product', 'About', 'Contact'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'womens-clothing-brand',
    title: "Launch Your Online Women's Clothing Brand with Style and Speed",
    shortTitle: "Women's Clothing Store",
    description: 'A fashion-forward storefront designed for women\'s apparel. Lookbook layouts, size guides, and a smooth shopping experience.',
    longDescription: "A fashion-forward website designed for women's apparel brands. Lookbook-style layouts, editorial photography integration, and a refined shopping experience that matches the quality of your clothing. Built to tell your brand story while driving sales.",
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/a8d5b1a3be17f63447bfa6b8ad76edde27e726a6-3603x2442.png?rect=0,6,3603,2431&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Payment Gateway', 'Lookbook Layout', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Lookbook Layout', description: 'Editorial-style product presentation that tells your brand story.' },
      { name: '5 Page Website', description: 'Complete brand presence with Home, Shop, Lookbook, About, and Contact.' },
      { name: '7 Days Delivery', description: 'Your fashion brand online in one week.' },
      { name: 'Payment Gateway', description: 'Seamless checkout with popular payment methods.' },
      { name: 'Size Guides', description: 'Built-in sizing information to reduce returns.' },
      { name: 'Mobile Responsive', description: 'Beautiful fashion browsing on every screen size.' },
    ],
    highlights: ['Editorial layouts', 'Brand storytelling', 'Fashion-optimized'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/aa3fdd157d01164eaf3000c14d571d52c81b7ed5-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/ddb80e5a51edd9690666bac2fdb20689c01270c4-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/fca17ee6a9a81d4ac7af0a61d4d53646cf0b1cea-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/2a529406dee0919ed5e571b1c496d3cf0aae382f-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Collection', 'Product', 'Lookbook', 'About'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'shopify-store-grow',
    title: 'Launch Your Online Store with Shopify: Fast, Easy, Built to Grow',
    shortTitle: 'Growth Shopify Store',
    description: 'A scalable Shopify store built for businesses that plan to grow. Multi-product support, analytics-ready, and optimized for SEO.',
    longDescription: 'A scalable Shopify store designed for growing businesses. Multi-product catalog, built-in analytics, SEO-optimized pages, and a modular layout that grows with your product line. Perfect for founders who need a professional launch today and room to scale tomorrow.',
    category: 'Shopify',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/67578280136008c4371985b8b1221fb186854cb8-3603x2442.png?rect=0,6,3603,2431&w=498&h=336`,
    features: ['Shopify Store', '7 Days Delivery', 'Payment Gateway', 'Analytics Ready', 'SEO Friendly'],
    detailedFeatures: [
      { name: 'Scalable Architecture', description: 'Modular layout that handles 10 products or 10,000.' },
      { name: 'Shopify Platform', description: 'Industry-leading e-commerce with built-in marketing tools.' },
      { name: '7 Days Delivery', description: 'Launch-ready in one week with room to grow.' },
      { name: 'Analytics Dashboard', description: 'Pre-configured tracking for sales, traffic, and conversion data.' },
      { name: 'SEO Optimized', description: 'Structured for organic search visibility from day one.' },
      { name: 'Mobile Responsive', description: 'Consistent shopping experience across all devices.' },
    ],
    highlights: ['Built to scale', 'Analytics pre-configured', 'SEO from day one'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/bbadce7d4542f456866e9031eceece8dc021a6ea-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/2dbd8f7c8cfa0a6cfa52a8d64544022d3c324919-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/9c08ada9b8e44dfcda363fc5b99fd1774093c760-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/d4c40c725a1e501949dd81ceb00b462a9cf3aeb7-1761x1557.png?w=629&h=556',
    ],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'ecommerce-retail',
    title: 'E-Commerce Retail Store',
    shortTitle: 'Retail Store',
    description: 'A versatile e-commerce solution for retail businesses. Clean product pages, cart functionality, and payment integration.',
    longDescription: 'A clean, versatile e-commerce website for general retail. Product pages with gallery views, shopping cart with quantity management, and a streamlined checkout flow. Designed for retailers who want a professional online presence without the complexity of enterprise platforms.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/0bebd91f18b23e2ae30e33c9e97162b13e6adc18-1201x814.png?rect=0,2,1201,810&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Payment Gateway', 'Shopping Cart', 'Mobile Responsive'],
    detailedFeatures: [
      { name: '5 Page Website', description: 'Essential retail pages: Home, Products, Cart, About, and Contact.' },
      { name: 'Shopping Cart', description: 'Full cart functionality with quantity management and order summary.' },
      { name: '7 Days Delivery', description: 'Your retail store online and accepting orders in one week.' },
      { name: 'Payment Gateway', description: 'Secure checkout with credit card and wallet support.' },
      { name: 'Product Pages', description: 'Clean layouts with gallery views, descriptions, and pricing.' },
      { name: 'Mobile Responsive', description: 'Complete shopping experience on any device.' },
    ],
    highlights: ['Full cart system', 'Clean product pages', 'Easy content updates'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/bcc947fc496a0830efbef3eb5908011abea85ee4-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/5f150563d1158595bdbca1f2e81829550a52a427-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/8576d636ed0fbf3537ea5bda6c54eee6bb9e8344-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/a65fc20d5dda557ce9a0c1c2473c56fee30e9253-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Products', 'Product Detail', 'Cart', 'About'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'electronics-store-v2',
    title: 'Power Up Your Online Electronics Store: Built to Sell Fast and Smart',
    shortTitle: 'Electronics Store Pro',
    description: 'A premium electronics storefront with advanced product filtering, comparison features, and a high-conversion checkout flow.',
    longDescription: 'A premium-tier electronics store with advanced features. Product filtering by specs, comparison tools, and a checkout flow engineered for higher-ticket electronics purchases. Designed for serious retailers who need more than a basic catalog site.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/474dd977126c858083d78a4c41b82b4a6e1caecc-3603x2442.png?rect=0,6,3603,2431&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Payment Gateway', 'Product Filtering', 'Mobile Responsive'],
    detailedFeatures: [
      { name: 'Advanced Filtering', description: 'Filter by specs, price range, brand, and availability.' },
      { name: '5 Page Website', description: 'Comprehensive store with category pages and individual product views.' },
      { name: '7 Days Delivery', description: 'Premium electronics store live in one week.' },
      { name: 'Payment Gateway', description: 'Multi-method checkout optimized for higher-ticket items.' },
      { name: 'Product Comparison', description: 'Side-by-side spec comparisons to help buyers decide.' },
      { name: 'Mobile Responsive', description: 'Full feature parity across desktop and mobile.' },
    ],
    highlights: ['Spec-based filtering', 'Comparison tools', 'Premium checkout'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/cb87692cb1f90f6cd80493c5eda2c04429e1541e-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/ee95a048ea939c26fdd6c52cf518416fb2afab9e-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/a26485682141b8d7633a4e62f9e82b070fed2232-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/f03f7b72d580d6c7c04d13312d2d65825318904a-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Products', 'Product Detail', 'Cart', 'About'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'home-repair-startup',
    title: 'Build Your Home Repair Startup Online: Smart, Reliable, Ready to Grow',
    shortTitle: 'Home Repair Website',
    description: 'A professional service website for home repair businesses. Booking forms, service areas, and trust-building testimonials.',
    longDescription: 'A professional website built for home repair and maintenance businesses. Service area maps, booking request forms, before-and-after galleries, and trust signals like testimonials and certifications. Designed to convert local searches into booked service calls.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/edbbbfbb20107ae08477914c88a2574720a043e8-3984x2766.png?rect=0,39,3984,2688&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Contact Form', 'Service Showcase', 'Mobile Responsive'],
    detailedFeatures: [
      { name: '5 Page Website', description: 'Home, Services, Gallery, Testimonials, and Contact pages.' },
      { name: 'Service Showcase', description: 'Detailed service pages with pricing tiers and scope descriptions.' },
      { name: '7 Days Delivery', description: 'Your service business online in one week.' },
      { name: 'Contact & Booking Form', description: 'Lead capture form with service selection and scheduling.' },
      { name: 'Google Maps Integration', description: 'Service area display so customers know you cover their location.' },
      { name: 'Mobile Responsive', description: 'Optimized for mobile searches, which drive most local service leads.' },
    ],
    highlights: ['Local SEO optimized', 'Booking forms', 'Trust signals built in'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/347d303534d3004c76b65bf56a5eab4a37f8d949-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/347d303534d3004c76b65bf56a5eab4a37f8d949-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/0faf9640af510994d768e4ea331c7920cfd7c260-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/193facc565bbcd9f166e89b29661fbf13a37be14-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Services', 'About', 'Projects', 'Contact'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
  {
    slug: 'pharma-brand',
    title: 'Power Your Pharma Brand Online: Trusted, Compliant, Customer-Focused',
    shortTitle: 'Pharma Website',
    description: 'A compliance-ready website for pharmaceutical brands. Clean design, product catalogs, and professional credibility built in.',
    longDescription: 'A professional website for pharmaceutical and healthcare brands. Clean, clinical aesthetic with product catalogs, compliance-ready layouts, and trust-building elements like certifications and team profiles. Built to project authority and reliability in a regulated industry.',
    category: 'Website',
    price: 1499,
    currency: 'AED',
    image: `${SANITY_BASE}/713ffd559b10b7e1b305e1f37fcedd0e8c64af10-3603x2442.png?rect=0,6,3603,2431&w=498&h=336`,
    features: ['5 Page Website', '7 Days Delivery', 'Product Catalog', 'Contact Form', 'Mobile Responsive'],
    detailedFeatures: [
      { name: '5 Page Website', description: 'Home, Products, About, Certifications, and Contact pages.' },
      { name: 'Product Catalog', description: 'Organized pharmaceutical product listings with detailed information.' },
      { name: '7 Days Delivery', description: 'Your pharma brand online in one week.' },
      { name: 'Compliance-Ready', description: 'Clean layouts designed for regulated industry requirements.' },
      { name: 'Contact Form', description: 'Professional inquiry forms for B2B and customer contacts.' },
      { name: 'Mobile Responsive', description: 'Professional appearance across all devices.' },
    ],
    highlights: ['Healthcare aesthetic', 'Compliance-ready', 'Professional trust signals'],
    previewImages: [
      'https://cdn.sanity.io/images/4nal441a/production/98518af7f0126112ba00710d75564fcd3079102b-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/ce1e6f596b23397cd2dc04c94692697ac515a4d2-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/e4ac9677a29cab93f26dba5970b7789fa8d08087-1761x1557.png?w=629&h=556',
      'https://cdn.sanity.io/images/4nal441a/production/90fbe2e9c4a1a8b2ac18f82565cfd57d52037396-1761x1557.png?w=629&h=556',
    ],
    previewLabels: ['Home', 'Products', 'About', 'Research', 'Contact'],
    orderUrl: 'https://buy.stripe.com/6oE4jRdeT98z74Y9AB',
  },
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(category: 'all' | 'Website' | 'Shopify'): Template[] {
  if (category === 'all') return templates;
  return templates.filter((t) => t.category === category);
}

export function getFeaturedTemplates(count = 3): Template[] {
  return templates.slice(0, count);
}

export function getRelatedTemplates(currentSlug: string, count = 3): Template[] {
  const current = getTemplateBySlug(currentSlug);
  if (!current) return templates.slice(0, count);
  return templates
    .filter((t) => t.slug !== currentSlug && t.category === current.category)
    .slice(0, count);
}
