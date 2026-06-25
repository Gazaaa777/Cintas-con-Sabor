export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "box" | "gourmet" | "bodas" | "cumple" | "antojos" | "catering"; // box = Cakes in the Box, gourmet = Pastelería Gourmet, bodas = Ediciones de Bodas/Eventos, cumple = Pasteles de Cumpleaños, antojos = Antojos para el Hogar, catering = Menú General de Eventos y Catering
  image?: string;
  isNew?: boolean;
  noImage?: boolean;
  rating: number;
  sizes: { label: string; priceAdder: number; servings: string }[];
  ribbonOptions?: string[];
  features?: string[];
  isSpecial?: boolean;
  isCookie?: boolean;
  cookieMinimum?: number;
  presentation?: string;
  minimumOrder?: string;
  pageNumber?: number;
  subcategory?: "mini_gourmet_dulces" | "mini_gourmet_cookies" | "brigadeiros" | "dulces_especiales" | "mini_gourmet_salados";
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + ribbon + text)
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedServings: string;
  selectedRibbon: string;
  customText: string;
  customPrice: number;
}

export interface CustomCakeState {
  baseSponge: string;
  filling: string;
  ribbonStyle: string;
  dedicatoria: string;
  size: string;
}

export interface ChefRecommendation {
  cakeName: string;
  description: string;
  whyItsPerfect: string;
  ribbonDetail: string;
  chefSecretTip: string;
}
