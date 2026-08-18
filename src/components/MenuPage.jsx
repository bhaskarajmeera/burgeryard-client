import { useState } from 'react';
import { useCart } from '../context/CartContext';

const menuItems = [
  {
    id: 1,
    name: 'Yard Special',
    category: 'Signature Burgers',
    price: 15,
    description:
      'Wagyu Beef, American Cheese, Pickled Gherkins, Fresh Lettuce, Slaw, Jalapenos, Yard Signature Sauce & Spicy Peri Sauce',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Backyard Classic',
    category: 'Signature Burgers',
    price: 15,
    description:
      'Wagyu Beef, American Cheese, Red Onion, Pickled Gherkins, Fresh Lettuce, Tomatoes, Yard Signature Sauce & Truffle Sauce',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Double Stack',
    category: 'Signature Burgers',
    price: 23,
    description:
      'Double Wagyu Beef & Double American Cheese, Maple Beef Rashers, Pickled Gherkins, Fresh Lettuce, Tomatoes, Red Onions, Yard Signature Sauce & Truffle Sauce',
    image:
      'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Smokey BBQ Deluxe',
    category: 'Signature Burgers',
    price: 15,
    description:
      'Wagyu Beef, American Cheese, Onion Rings, Tomatoes, Smokey BBQ Sauce & Yard Signature Sauce',
    image:
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Aussie Mate',
    category: 'Signature Burgers',
    price: 20,
    description:
      'Wagyu Beef, Crispy Fried Chicken, Double American Cheese, Red Onion, Beetroot, Fresh Lettuce, Tomatoes, Yard Signature Sauce & Smokey BBQ Sauce',
    image:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Cheese Lover’s',
    category: 'Signature Burgers',
    price: 15,
    description:
      'Wagyu Beef, Double American Cheese, Red Onion, Pickle Gherkins, Yard Signature Sauce & Truffle Sauce',
    image:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Chicky Chook',
    category: 'Chicken',
    price: 15,
    description:
      'Seasoned Grilled Chicken, American Cheese, Fresh Lettuce, Tomatoes, Yard Signature Sauce & Truffle Sauce',
    image:
      'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Crispy Firebird',
    category: 'Chicken',
    price: 15,
    description:
      'Crispy Fried Chicken, American Cheese, Onion Rings, Slaw, Tomatoes, Jalapenos, Yard Signature Sauce & Spicy Peri Sauce',
    image:
      'https://images.unsplash.com/photo-1565310022184-f23a884f29da?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    name: 'Green Yard Veggie',
    category: 'Veggie Picks',
    price: 15,
    description:
      'Fried Veggie Patty, American Cheese, Fresh Lettuce, Pickled Gherkins, Tomatoes, Slaw, Grilled Peppers, Onion Rings, Yard Signature Sauce & Spicy Peri Sauce',
    image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 10,
    name: 'Junior Cheese Burger',
    category: 'Burgers For Kids',
    price: 13,
    description: 'Wagyu Beef, American Cheese, Yard Signature Sauce & Ketchup',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 11,
    name: 'Combo Chips + Soft Drink',
    category: 'Combos',
    price: 7,
    description: 'Burger + chips + soft drink',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 12,
    name: 'Oreo',
    category: 'Milkshakes',
    price: 9.9,
    description: 'Classic Oreo shake',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 13,
    name: 'Biscoff',
    category: 'Milkshakes',
    price: 9.9,
    description: 'Smooth Biscoff milkshake',
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 14,
    name: 'Caramel',
    category: 'Milkshakes',
    price: 8.9,
    description: 'Sweet caramel shake',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 15,
    name: 'Strawberry',
    category: 'Milkshakes',
    price: 8.9,
    description: 'Fresh strawberry shake',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 16,
    name: 'Chocolate',
    category: 'Milkshakes',
    price: 8.9,
    description: 'Rich chocolate shake',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 17,
    name: 'Vanilla',
    category: 'Milkshakes',
    price: 8.9,
    description: 'Classic vanilla shake',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 18,
    name: 'Medium Chips',
    category: 'Sides',
    price: 7,
    description: 'Crispy golden fries',
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 19,
    name: 'Large Chips',
    category: 'Sides',
    price: 9,
    description: 'Extra large crispy fries',
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 20,
    name: 'Loaded Fries',
    category: 'Sides',
    price: 15,
    description:
      'Crunchy Fries, Liquid Cheese Sauce, Fried Chicken Pieces, Yard Signature Sauce',
    image:
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 21,
    name: 'Veg Loaded Fries',
    category: 'Sides',
    price: 15,
    description:
      'Crunchy Fries, Liquid Cheese Sauce, Red Onion, Jalapenos, Yard Signature Sauce & Spicy Peri Sauce',
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 22,
    name: 'Chicken Nuggets & Chips',
    category: 'Sides',
    price: 10,
    description: 'Crispy chicken bites and fries',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 23,
    name: 'Onion Rings',
    category: 'Sides',
    price: 10,
    description: 'Golden battered onion rings',
    image:
      'https://images.unsplash.com/photo-1532635241-17e820acc59f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 24,
    name: 'Yard Spicy Peri Sauce',
    category: 'Yard Sauces',
    price: 2,
    description: 'Spicy peri sauce',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 25,
    name: 'Yard Signature Sauce',
    category: 'Yard Sauces',
    price: 2,
    description: 'Special burger house sauce',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 26,
    name: 'Yard Truffle Sauce',
    category: 'Yard Sauces',
    price: 2,
    description: 'Rich truffle burger sauce',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 27,
    name: 'Pineapple',
    category: 'Add-Ons',
    price: 1,
    description: 'Fresh pineapple topping',
    image:
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 28,
    name: 'Cheese',
    category: 'Add-Ons',
    price: 1,
    description: 'Extra cheese slice',
    image:
      'https://images.unsplash.com/photo-1552767059-ce182ead6e3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 29,
    name: 'Egg',
    category: 'Add-Ons',
    price: 2,
    description: 'Breakfast-style egg',
    image:
      'https://images.unsplash.com/photo-1518569656558-1f25e69d93d3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 30,
    name: 'Beef Rasher',
    category: 'Add-Ons',
    price: 2,
    description: 'Crispy beef rasher',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 31,
    name: 'Premium Wagyu Beef Patty',
    category: 'Add-Ons',
    price: 6,
    description: 'High-end wagyu beef patty',
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 32,
    name: 'Chicken Patty',
    category: 'Add-Ons',
    price: 5,
    description: 'Crispy chicken patty',
    image:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
  },
];

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];
  const visibleItems =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section className="menu-page">
      <div className="hero-banner brand-banner">
        <div>
          <p className="eyebrow">The Mark Hotel</p>
          <h1>Burger Yard</h1>
        </div>
        <div className="contact-details">
          <p>@ The Mark Hotel</p>
          <p>+61 451 449 096</p>
          <p>46 Dickson St, Lambton NSW 2299</p>
        </div>
      </div>

      <div className="menu-header">
        <div>
          <p className="eyebrow dark">Our menu</p>
          <h2>Built to satisfy every craving</h2>
        </div>
      </div>

      <div className="category-filter" aria-label="Menu categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={category === activeCategory ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {visibleItems.map((item) => (
          <article className="menu-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="menu-body">
              <div className="menu-topline">
                <span className="item-category">{item.category}</span>
                <span className="price">${Number(item.price).toFixed(2)}</span>
              </div>

              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <button type="button" onClick={() => addToCart(item)}>
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
