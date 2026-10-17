// Clean vector SVG data URIs for UI icons
const svgLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 40'><text x='5' y='28' font-family='sans-serif' font-weight='bold' font-size='28' fill='%23e23744'>Tomato.</text></svg>";
const svgBasket = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231c1c1c' stroke-width='2'><path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'></path><line x1='3' y1='6' x2='21' y2='6'></line><path d='M16 10a4 4 0 0 1-8 0'></path></svg>";
const svgSearch = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2349557e' stroke-width='2'><circle cx='11' cy='11' r='8'></circle><line x1='21' y1='21' x2='16.65' y2='16.65'></line></svg>";
const svgProfile = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2349557e' stroke-width='2'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path><circle cx='12' cy='7' r='4'></circle></svg>";

export const assets = {
  logo: svgLogo,
  basket_icon: svgBasket,
  search_icon: svgSearch,
  profile_icon: svgProfile,
  add_icon_white: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>",
  add_icon_green: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2324963f'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>",
  remove_icon_red: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e23744'><path d='M19 13H5v-2h14v2z'/></svg>",
  cross_icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>",
  bag_icon: svgBasket,
  logout_icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'><path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>",
  parcel_icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e23744' stroke-width='2'><rect x='2' y='7' width='20' height='14' rx='2' ry='2'/><path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'/></svg>"
};

export const menu_list = [
  {
    menu_name: "Non Veg",
    menu_image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Pure Veg",
    menu_image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Rolls",
    menu_image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Salad",
    menu_image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Sandwich",
    menu_image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Pasta",
    menu_image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Noodles",
    menu_image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Cake",
    menu_image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80"
  },
  {
    menu_name: "Desserts",
    menu_image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&auto=format&fit=crop&q=80"
  }
];