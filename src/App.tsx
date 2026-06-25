import React, { useState, useEffect } from "react";
import { PRODUCTS, SPONGE_BASES, FILLINGS, RIBBON_STYLES } from "./data";
import { Product, CartItem, CustomCakeState, ChefRecommendation } from "./types";
import ProductCard from "./components/ProductCard";
import AntojoCard from "./components/AntojoCard";
import { 
  Cake, 
  Gift, 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ShoppingBag, 
  ChefHat, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  X, 
  Menu, 
  ChevronRight, 
  Check,
  Award,
  HelpCircle,
  Search,
  User,
  ChevronDown,
  ArrowUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation active state
  const [activeCategory, setActiveCategory] = useState<"all" | "box" | "gourmet" | "bodas" | "cumple" | "catering">("all");
  const [activeSection, setActiveSection] = useState<"inicio" | "antojos" | "menus" | "catering" | "asistente" | "ubicacion">("inicio");
  const [activeCateringSubcategory, setActiveCateringSubcategory] = useState<"mini_gourmet_dulces" | "mini_gourmet_cookies" | "brigadeiros" | "dulces_especiales" | "mini_gourmet_salados">("mini_gourmet_dulces");
  const [selectedBoxIntroSize, setSelectedBoxIntroSize] = useState<"Grande" | "Mini">("Grande");
  
  // Birthday cake builder/showcase states
  const [selectedCumpleFlavor, setSelectedCumpleFlavor] = useState("cumple-vainilla");
  const [selectedCumpleSize, setSelectedCumpleSize] = useState<"Mini" | "Individual" | "Entero">("Mini");
  const [cumpleMenuTab, setCumpleMenuTab] = useState<"clasicas" | "especiales">("clasicas");
  const [selectedCumpleRibbon, setSelectedCumpleRibbon] = useState("Cinta Satinada de Raso Amarillo");
  const [selectedCumpleText, setSelectedCumpleText] = useState("");
  
  // Shopping cart slide-drawer state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Custom cake builder state
  const [customCake, setCustomCake] = useState<CustomCakeState>({
    baseSponge: "vainilla",
    filling: "ddl",
    ribbonStyle: "oro",
    dedicatoria: "",
    size: "6-8" // "6-8" personas o "12-14" personas
  });
  const [customCakeAddedCount, setCustomCakeAddedCount] = useState(0);
  const [customCakeSuccessMessage, setCustomCakeSuccessMessage] = useState(false);

  // Mobile navigation drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New premium interactive modal states
  const [activeLang, setActiveLang] = useState<"ES" | "EN" | "FR">("ES");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // Luxury loyalty user account states
  const [userName, setUserName] = useState("Santiago Constant");
  const [userEmail, setUserEmail] = useState("santiago.constant@grandgourmet.com");
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [activeFaqTab, setActiveFaqTab] = useState<string>("concept");

  // Premium toast notification system
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => curr === msg ? null : curr);
    }, 4000);
  };

  // Core Translation Helper for multi-language support (ES, EN, FR)
  const t = (es: string, en?: string, fr?: string): string => {
    if (activeLang === "EN") return en || es;
    if (activeLang === "FR") return fr || es;
    return es;
  };

  // Back to top & Scrolled header indicator
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AI Assistant Pastor / Chef states
  const [preferences, setPreferences] = useState("");
  const [dietary, setDietary] = useState("");
  const [eventType, setEventType] = useState("Cumpleaños");
  const [chefRecommendation, setChefRecommendation] = useState<ChefRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerating, setErrorGenerating] = useState(false);

  // WhatsApp contact number (configured easily in variables)
  const WHATSAPP_NUMBER = "50688517171"; // Costa Rica international format
  const WHATSAPP_LINK_SUPPORT = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Cintas%20con%20Sabor,%20deseo%20hacer%20una%20consulta%20sobre%20sus%20pasteles.`;

  // Calculated custom cake details
  const selectedSpongeObj = SPONGE_BASES.find(b => b.id === customCake.baseSponge)!;
  const selectedFillingObj = FILLINGS.find(f => f.id === customCake.filling)!;
  const selectedRibbonObj = RIBBON_STYLES.find(r => r.id === customCake.ribbonStyle)!;
  
  const customCakeBasePrice = customCake.size === "6-8" ? 35000 : 49000;
  const customCakeTotalPrice = customCakeBasePrice + selectedSpongeObj.price + selectedFillingObj.price;

  // Sync cart from/to localStorage for robust offline capability
  useEffect(() => {
    const savedCart = localStorage.getItem("cintas_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("No se pudo cargar el carrito", e);
      }
    }
  }, []);

  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cintas_cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (item: Omit<CartItem, "id">) => {
    const uniqueId = `${item.product.id}-${item.selectedSize}-${item.selectedRibbon}-${item.customText}`;
    const existingIndex = cart.findIndex(c => c.id === uniqueId);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += item.quantity;
      saveCartToStorage(updatedCart);
    } else {
      const newItem: CartItem = {
        ...item,
        id: uniqueId
      };
      saveCartToStorage([...cart, newItem]);
    }
  };

  const handleAddCustomCakeToCart = () => {
    const sizeLabel = customCake.size === "6-8" ? "Gourmet Personal (6-8 porciones)" : "Familiar Grande (12-14 porciones)";
    const customProductObj: Product = {
      id: `custom-cake-${Date.now()}`,
      name: `Pastel de ${selectedSpongeObj.name} con ${selectedFillingObj.name}`,
      description: `Creación artesanal personalizada en vivo por el cliente en el Diseñador Digital.`,
      price: customCakeTotalPrice,
      category: "gourmet",
      image: "/src/assets/images/hero_luxury_cake_1782151687947.jpg",
      rating: 5.0,
      sizes: [{ label: sizeLabel, priceAdder: 0, servings: customCake.size === "6-8" ? "6-8 personas" : "12-14 personas" }]
    };

    const cartItem: CartItem = {
      id: `custom-${Date.now()}`,
      product: customProductObj,
      quantity: 1,
      selectedSize: sizeLabel,
      selectedServings: customCake.size === "6-8" ? "6-8 personas" : "12-14 personas",
      selectedRibbon: `Cinta: ${selectedRibbonObj.name}`,
      customText: customCake.dedicatoria || "(Caja sin dedicatoria escrita)",
      customPrice: customCakeTotalPrice
    };

    saveCartToStorage([...cart, cartItem]);
    setCustomCakeSuccessMessage(true);
    setCustomCakeAddedCount(c => c + 1);
    
    // Reset notification trigger after some seconds
    setTimeout(() => {
      setCustomCakeSuccessMessage(false);
    }, 3000);
  };

  const handleRemoveFromCart = (itemId: string) => {
    const updated = cart.filter(item => item.id !== itemId);
    saveCartToStorage(updated);
  };

  const handleUpdateQuantity = (itemId: string, increment: boolean) => {
    const updated = cart.map(item => {
      if (item.id === itemId) {
        const nextQty = increment ? item.quantity + 1 : item.quantity - 1;
        return {
          ...item,
          quantity: Math.max(1, nextQty)
        };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  // Generate recommendation using server-side Gemini API
  const handleAskTheChef = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorGenerating(false);
    setChefRecommendation(null);

    try {
      const response = await fetch("/api/chef/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences,
          dietary,
          eventType
        })
      });

      if (!response.ok) {
        throw new Error("Respuesta de servidor fallida");
      }

      const data = await response.json();
      setChefRecommendation(data);
    } catch (err) {
      console.error("Error consultando al chef por el pastel perfecto:", err);
      setErrorGenerating(true);
      // Fallback
      setChefRecommendation({
        cakeName: "Cakes in the Box de Pistacho & Frambuesas",
        description: "Bizcocho tierno de pistacho bañado en almíbar de cítricos y crema de ganache blanco.",
        whyItsPerfect: "Combina lo sofisticado de los frutos secos con la acidez alegre de frambuesas silvestres, ideal para tus gustos premium.",
        ribbonDetail: "Cinta de Raso Verde Oliva Satinada y Moño de Seda Crema",
        chefSecretTip: "Acompáñalo de un espumoso brut muy frío para acentuar el pistacho."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Send Whatsapp Order
  const handleCheckoutViaWhatsApp = () => {
    if (cart.length === 0) return;

    let messageText = `✨ *NUEVO PEDIDO - CINTAS CON SABOR* ✨\n`;
    messageText += `Hola, deseo encargar los siguientes pasteles detallados desde el menú digital:\n\n`;

    cart.forEach((item, index) => {
      messageText += `*${index + 1}. ${item.product.name}*\n`;
      messageText += `   • *Tamaño:* ${item.selectedSize} (${item.selectedServings})\n`;
      messageText += `   • *Lazo:* ${item.selectedRibbon}\n`;
      if (item.customText.trim()) {
        messageText += `   • *Dedicatoria:* "${item.customText}"\n`;
      }
      messageText += `   • *Cantidad:* ${item.quantity} un.\n`;
      messageText += `   • *Subtotal:* ¢${(item.customPrice * item.quantity).toLocaleString("es-CR")}\n\n`;
    });

    const totalOrderPrice = cart.reduce((acc, curr) => acc + (curr.customPrice * curr.quantity), 0);
    const discountVal = Math.round(totalOrderPrice * (appliedDiscount / 100));
    const finalTotal = Math.max(0, totalOrderPrice - discountVal);

    if (appliedDiscount > 0) {
      messageText += `🎟️ *Descuento Club d'Or (${appliedDiscount}%):* -¢${discountVal.toLocaleString("es-CR")}\n`;
      messageText += `💵 *TOTAL ESTIMADO (Con Descuento):* ¢${finalTotal.toLocaleString("es-CR")}\n\n`;
    } else {
      messageText += `💵 *TOTAL ESTIMADO:* ¢${totalOrderPrice.toLocaleString("es-CR")}\n\n`;
    }
    messageText += `📍 *Por favor coordinar:* Método de retiro / entrega y fecha ideal.\n`;
    messageText += `¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.customPrice * curr.quantity), 0);
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // Filtered Products
  const filteredProducts = activeCategory === "all" 
    ? PRODUCTS.filter(p => p.category !== "antojos" && p.category !== "catering") 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#FAF6F0] min-h-screen text-amber-950 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden antialiased">
      {/* HEADER / NAVIGATION BAR (PIERRE HERMÉ LUXURY STYLE - OVERLAID & TRANSLATED TO SPANISH) */}
      <nav id="navbar-main" className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 text-white font-sans ${isScrolled ? "bg-[#35251F]/95 backdrop-blur-md border-b border-white/5 shadow-xl" : "bg-gradient-to-b from-black/85 via-black/40 to-transparent border-transparent"}`}>
        <div className="w-full max-w-none px-4 sm:px-8 lg:px-16">
          
          {/* Top Row: Luxury Brand, left logo spacer (desktop), right tools */}
          <div className="flex items-center justify-between h-24 border-b border-white/10 relative">
            
            {/* Left logo (esquina superior izquierda del navbar) */}
            <button 
              onClick={() => {
                setActiveSection("inicio");
              }}
              className="flex items-center justify-start focus:outline-none cursor-pointer group border-none bg-transparent"
            >
              <img 
                src="/src/assets/images/logo-cintas.jfif" 
                alt="Cintas con Sabor" 
                className="h-[38px] sm:h-[45px] lg:h-[60px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Center Level: Magnificent brand logo (Pierre Hermé style) */}
            <button 
              onClick={() => {
                setActiveSection("inicio");
              }}
              className="flex flex-col items-center justify-center text-center group cursor-pointer lg:absolute lg:left-1/2 lg:-translate-x-1/2 gap-0.5 border-none bg-transparent focus:outline-none"
            >
              <span className="font-serif text-xl sm:text-2xl lg:text-[28px] font-light tracking-[0.22em] text-white uppercase group-hover:text-amber-200 transition-colors">
                Cintas con Sabor
              </span>
              <span className="text-[9px] tracking-[0.38em] uppercase text-amber-200/90 font-medium font-serif mt-0.5">
                Miniaturas Gourmet
              </span>
            </button>

            {/* Right Level: Actions & Controls */}
            <div className="flex items-center space-x-4 sm:space-x-6 text-white/90">
              
              {/* Language Selector Dropdown */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1 text-xs font-semibold tracking-wider text-amber-200/90 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Cambiar Idioma / Change Language"
                >
                  <span>{activeLang}</span>
                  <ChevronDown className="w-3 h-3 text-amber-300 transition-transform duration-200" style={{ transform: isLangDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-40 rounded-xl bg-[#3f2a24] border border-white/10 shadow-2xl py-2.5 z-50 text-left"
                    >
                      {[
                        { code: "ES", label: "Español" },
                        { code: "EN", label: "English" },
                        { code: "FR", label: "Français" }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setActiveLang(lang.code as any);
                            setIsLangDropdownOpen(false);
                            showToast(
                              lang.code === "ES"
                                ? "Idioma configurado con éxito: Español 🇪🇸"
                                : lang.code === "EN"
                                ? "Language configured successfully: English 🇬🇧"
                                : "Langue configurée avec succès: Français 🇫🇷"
                            );
                          }}
                          className={`w-full px-4 py-2.5 text-xs font-semibold tracking-wider hover:bg-white/10 text-left transition-colors flex items-center justify-between ${
                            activeLang === lang.code ? "text-amber-300" : "text-white/80"
                          }`}
                        >
                          <span>{lang.label}</span>
                          {activeLang === lang.code && <Check className="w-3.5 h-3.5 text-amber-300" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Icon (Buscador Premium) */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 hover:text-amber-300 transition-all cursor-pointer hover:scale-110 active:scale-95" 
                title="Buscador Gourmet"
              >
                <Search className="w-4.5 h-4.5 stroke-[2.2]" />
              </button>

              {/* Cart Bag with badge count */}
              <button
                onClick={() => setIsCartOpen(true)}
                id="cart-trigger-btn"
                className="relative bg-amber-500 hover:bg-amber-400 p-2.5 rounded-full text-amber-950 transition-all shadow-md hover:scale-105 flex items-center justify-center cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-amber-950 text-[10px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-[#35251F] shadow-sm animate-bounce">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>

          {/* Bottom Row: Exquisite sub-navigation links */}
          <div className="hidden lg:flex items-center justify-center space-x-8 py-4 text-[11px] tracking-[0.16em] uppercase font-bold text-white/90">
            <button 
              onClick={() => {
                setActiveSection("ubicacion");
              }}
              className={`hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent ${activeSection === "ubicacion" ? "text-amber-400 font-extrabold" : ""}`}
            >
              {t("Retiro en Boutique", "Boutique Pickup", "Retrait en Boutique")} <ChevronDown className="w-2.5 h-2.5 text-white/40" />
            </button>

            <button 
              onClick={() => {
                setActiveSection("antojos");
              }}
              className={`hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer text-left font-bold border-none bg-transparent ${activeSection === "antojos" ? "text-amber-400 font-extrabold" : ""}`}
            >
              {t("Antojos Hogar", "Home Cravings", "Envies Maison")} <ChevronDown className="w-2.5 h-2.5 text-white/40" />
            </button>

            <button 
              onClick={() => {
                setActiveSection("menus");
                setActiveCategory("box");
              }}
              className={`hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer uppercase text-left border-none bg-transparent ${activeSection === "menus" && activeCategory === "box" ? "text-amber-400 font-extrabold" : ""}`}
            >
              {t("Cakes in the Box", "Cakes in the Box", "Gâteaux en Boîte")} <ChevronDown className="w-2.5 h-2.5 text-white/40" />
            </button>

            <button 
              onClick={() => {
                setActiveSection("menus");
                setActiveCategory("cumple");
              }}
              className={`hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer uppercase text-left border-none bg-transparent ${activeSection === "menus" && activeCategory === "cumple" ? "text-amber-400 font-extrabold" : ""}`}
            >
              {t("Cakes de Cumpleaños", "Birthday Cakes", "Gâteaux d'Anniversaire")} <ChevronDown className="w-2.5 h-2.5 text-white/40" />
            </button>

            <button 
              onClick={() => {
                setActiveSection("catering");
              }}
              className={`hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer uppercase text-left font-semibold border-none bg-transparent ${activeSection === "catering" ? "text-amber-300 font-extrabold" : "text-amber-300/80"}`}
            >
              {t("Catering & Menú General", "Catering & General Menu", "Traiteur & Menu Général")} <ChevronDown className="w-2.5 h-2.5 text-white/40" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-[#35251F] border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 font-medium text-sm">
                <button 
                  onClick={() => {
                    setActiveSection("inicio");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/5 ${activeSection === "inicio" ? "bg-white/10 font-bold" : ""}`}
                >
                  {t("La Casa / Inicio", "Welcome / Home", "Bienvenue / Accueil")}
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("antojos");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/5 font-semibold ${activeSection === "antojos" ? "bg-white/10 font-bold" : ""}`}
                >
                  {t("Antojos para el Hogar", "Gourmet Home Cravings", "Envies Gourmandes Maison")}
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("menus");
                    setActiveCategory("box");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/5 uppercase ${activeSection === "menus" && activeCategory === "box" ? "bg-white/10 font-bold" : ""}`}
                >
                  {t("Cakes in the Box", "Cakes in the Box", "Gâteaux en Boîte")}
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("menus");
                    setActiveCategory("cumple");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/5 uppercase ${activeSection === "menus" && activeCategory === "cumple" ? "bg-white/10 font-bold" : ""}`}
                >
                  {t("Cakes de Cumpleaños", "Birthday Cakes", "Gâteaux d'Anniversaire")}
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("catering");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-amber-300 hover:bg-white/10 uppercase font-semibold ${activeSection === "catering" ? "bg-white/10 font-bold" : "bg-white/5"}`}
                >
                  {t("Catering & Menú General", "Catering & General Menu", "Traiteur & Menu Général")}
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("asistente");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-[#211411] font-bold bg-amber-500 hover:bg-amber-400 ${activeSection === "asistente" ? "ring-2 ring-white" : ""}`}
                >
                  {t("✨ Asistente Chef AI", "✨ AI Pastry Chef Assistant", "✨ Assistant Chef IA")}
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("ubicacion");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/5 ${activeSection === "ubicacion" ? "bg-white/10 font-bold" : ""}`}
                >
                  {t("Ubicación & Despachos", "Location & Delivery", "Emplacement & Livraison")}
                </button>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2.5 text-center text-xs font-semibold">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 transition-all active:scale-95 text-left font-serif cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-amber-400" />
                    {t("Buscar", "Search", "Rechercher")}
                  </button>
                  <button
                    onClick={() => {
                      const next = activeLang === "ES" ? "EN" : activeLang === "EN" ? "FR" : "ES";
                      setActiveLang(next);
                      showToast(
                        next === "ES"
                          ? "Idioma cambiado a Español 🇪🇸"
                          : next === "EN"
                          ? "Language changed to English 🇬🇧"
                          : "Langue changée en Français 🇫🇷"
                      );
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 transition-all active:scale-95 font-serif focus:outline-none cursor-pointer"
                  >
                    <span>🌐 {activeLang}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {activeSection === "inicio" && (
        <>
          {/* IMMERSIVE LUXURY HERO SECTION */}
          <header id="hero" className="relative min-h-[90vh] md:min-h-screen flex items-center justify-start bg-zinc-950 overflow-hidden border-b border-amber-900/40">
        
        {/* Fullsize background image mimicking the screen background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_luxury_cake_1782151687947.jpg"
            alt="Creaciones Exquisitas de Pastelero Artesano"
            className="w-full h-full object-cover object-center filter scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Transparent dark amber tint overlay matching the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent md:bg-black/45" />
        </div>

        {/* Hero Interactive Elements Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-36 sm:pt-48 pb-20 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Magnificent Big Pierre Hermé Style Bold Text */}
            <div className="lg:col-span-12 flex flex-col justify-center space-y-8 text-left mt-8 md:mt-12">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 backdrop-blur-md rounded-full py-1 px-4.5 w-fit">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] text-amber-200 uppercase font-sans">
                  {t("Repostería que Regala Emociones", "Pastry that Gifts Emotions", "Pâtisserie qui Offre des Émotions")}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-normal tracking-wide text-white uppercase leading-[1.1] sm:leading-[1.05] select-none">
                  {t("Creaciones", "Creations", "Créations")}<br className="hidden sm:inline" />
                  <span className="font-light italic font-serif text-amber-100/90 tracking-normal block mt-2 sm:mt-1 capitalize">
                    {t("Exquisitas", "Exquisite", "Exquises")}
                  </span>
                </h1>
                
                {/* Underlined 'JE DÉCOUVRE' CTA translated perfectly to Spanish 'DESCUBRIR' */}
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setActiveSection("menus");
                      setActiveCategory("all");
                    }}
                    className="group inline-flex flex-col items-start tracking-[0.25em] text-white/95 font-sans font-bold text-xs uppercase cursor-pointer text-left border-none bg-transparent"
                  >
                    <span>{t("Descubrir la Colección", "Discover the Collection", "Découvrir la Collection")}</span>
                    <span className="h-0.5 w-24 bg-white mt-2 group-hover:w-full transition-all duration-300" />
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed max-w-xl font-sans font-light">
                {t(
                  "En Cintas con Sabor, vestimos los pasteles con la mayor solemnidad. Cada una de nuestras creaciones se envuelve primorosamente a mano con delicadas cintas de raso y seda, convirtiendo la alta pastelería en un obsequio inolvidable.",
                  "At Cintas con Sabor, we dress our cakes with the utmost solemnity. Each of our creations is meticulously wrapped by hand with delicate satin and silk ribbons, turning haute pâtisserie into an unforgettable gift.",
                  "Chez Cintas con Sabor, nous habillons nos gâteaux avec la plus grande solennité. Chacune de nos créations est méticuleusement enveloppée à la main avec de délicats rubans de satin et de soie, transformant la haute pâtisserie en un cadeau inoubliable."
                )}
              </p>

              {/* Call to action action layout */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button 
                  onClick={() => {
                    setActiveSection("menus");
                    setActiveCategory("all");
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-xl transition-all hover:scale-[1.02] text-center cursor-pointer"
                >
                  {t("Ver Menú de Colección", "View Collection Menu", "Voir le Menu de Collection")}
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection("asistente");
                  }}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full transition-all hover:scale-[1.02] text-center cursor-pointer"
                >
                  {t("Consultar Chef AI", "Consult AI Pastry Chef", "Consulter le Chef IA")}
                </button>
              </div>

            </div>

          </div>
        </div>

      </header>

      {/* FLYER SHOWCASE - CAKE IN THE BOX INTRO */}
      <section id="cake-in-the-box-intro" className="py-24 bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] border-b border-amber-100/50 relative overflow-hidden">
        {/* Background decorative circles or patterns */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100/20 rounded-full filter blur-3xl opacity-50 -translate-x-12 -translate-y-12 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100/20 rounded-full filter blur-3xl opacity-50 translate-x-12 translate-y-12 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Header containing brand signature */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 flex items-center justify-center text-amber-950 font-sans font-black text-xs uppercase shadow-md select-none border border-white tracking-widest relative"
            >
              <div className="absolute inset-0.5 border border-dashed border-amber-900/45 rounded-full" />
              NEW
            </motion.div>
            
            <p className="text-[10px] sm:text-xs tracking-[0.3em] font-bold text-amber-800 uppercase mt-4 block font-serif">
              CINTAS con SABOR®
            </p>
            <p className="text-[9px] tracking-[0.4em] font-medium text-amber-900/60 uppercase block font-serif mt-1">
              MINIATURAS GOURMET
            </p>
          </div>

          {/* Slogan with beautifully spaced letters and italics */}
          <div className="max-w-3xl mx-auto px-4 mb-4">
            <p className="font-serif text-lg sm:text-xl md:text-2xl italic font-light text-[#35251F] tracking-wide leading-relaxed">
              &ldquo;¡Disfrutá tu antojo dulce favorito sin necesidad de tener una ocasión especial!&rdquo;
            </p>
          </div>

          {/* Elegant Calligraphy Headline */}
          <h2 className="font-script text-7xl sm:text-8xl md:text-9xl text-amber-900 leading-none select-none my-1">
            Cakes in the Box
          </h2>
          <p className="text-sm font-medium text-amber-950 max-w-xl mx-auto mt-2 mb-6">
            Nuestros legendarios cakes húmedos premium, ahora disponibles tanto en versión <strong>Mini (8 oz)</strong> para antojo individual como en tamaño <strong>Grande (32 oz)</strong> para compartir.
          </p>
          
          <div className="w-24 h-[1px] bg-amber-200 mx-auto mt-6 mb-16" />

          {/* Sizing & Categories Selector Tabs */}
          <div className="border border-amber-100/80 bg-white/60 p-1.5 rounded-2xl w-fit mx-auto mb-16 flex items-center gap-1 shadow-xs backdrop-blur-md">
            <button
              onClick={() => setSelectedBoxIntroSize("Grande")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBoxIntroSize === "Grande"
                  ? "bg-amber-950 text-white shadow-xs"
                  : "text-amber-900/60 hover:bg-amber-50"
              }`}
            >
              🎁 Cake in the Box (Grande 32 oz)
            </button>
            <button
              onClick={() => setSelectedBoxIntroSize("Mini")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBoxIntroSize === "Mini"
                  ? "bg-amber-950 text-white shadow-xs"
                  : "text-amber-900/60 hover:bg-amber-50"
              }`}
            >
              🧁 Mini Cakes in the Box (¡Nuevo Lanzamiento!)
            </button>
          </div>

          {/* Interactive representations of the 6 premium flavors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Flavor 1: Vainilla */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 border border-amber-100/70 shadow-lg relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                {selectedBoxIntroSize === "Grande" ? "32 oz" : "8 oz"}
              </div>
              
              <div className="flex flex-col items-center">
                {/* Dual image hover transition for premium interactive experience! */}
                <div className="w-full h-32 rounded-2xl border border-amber-100 shadow-inner my-6 flex items-center justify-center relative overflow-hidden bg-amber-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/vainilla/vainilla 1.png" : "/src/assets/images/queques/mini/vainilla/vainilla1peq.png"}
                    alt="Cake in the Box Vainilla (Cerrado)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                  />
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/vainilla/vainilla 2.png" : "/src/assets/images/queques/mini/vainilla/vainilla1peq.png"}
                    alt="Cake in the Box Vainilla (Abierto)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-102 group-hover:scale-100"
                  />
                  {/* Subtle label in bottom-right corner to notice hover behavior */}
                  <div className="absolute bottom-2 right-2 bg-amber-950/80 text-[8px] text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-mono opacity-80 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                    Pasa el cursor
                  </div>
                </div>

                <h4 className="font-serif text-lg font-black text-amber-950 mt-2">Vainilla</h4>
                <p className="text-xs text-amber-900/60 leading-relaxed mt-2 text-center pb-4">
                  Húmedo y tierno bizcocho de vainilla gourmet, coronado con una cobertura sumamente suave con bellas chispas de colores pasteles y perlas del amor.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-50 flex items-center justify-between gap-4 w-full">
                <div>
                  <span className="text-[10px] text-amber-900/40 font-mono block">Precio</span>
                  <span className="text-sm font-bold text-amber-950">
                    {selectedBoxIntroSize === "Grande" ? "₡14.500" : "₡3.500"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const matchingProduct = PRODUCTS.find(p => p.id === "box-vainilla");
                    if (matchingProduct) {
                      const sizeObj = matchingProduct.sizes.find(s => s.label.includes(selectedBoxIntroSize === "Grande" ? "Grande" : "Mini"));
                      handleAddToCart({
                        product: matchingProduct,
                        quantity: 1,
                        selectedSize: sizeObj?.label || (selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"),
                        selectedServings: sizeObj?.servings || (selectedBoxIntroSize === "Grande" ? "3-4 personas" : "1 persona"),
                        selectedRibbon: matchingProduct.ribbonOptions?.[0] || "Ninguna",
                        customText: "",
                        customPrice: selectedBoxIntroSize === "Grande" ? 14500 : 3500
                      });
                      showToast(`¡Agregado ${matchingProduct.name} (${selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"}) al Carrito!`);
                    }
                  }}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </motion.div>

            {/* Flavor 2: German */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 border border-amber-100/70 shadow-lg relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                {selectedBoxIntroSize === "Grande" ? "32 oz" : "8 oz"}
              </div>

              <div className="flex flex-col items-center">
                {/* Dual image hover transition for premium interactive experience! */}
                <div className="w-full h-32 rounded-2xl border border-amber-100 shadow-inner my-6 flex items-center justify-center relative overflow-hidden bg-amber-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/german/german 1.png" : "/src/assets/images/queques/mini/german/german1peq.png"}
                    alt="Cake in the Box German (Cerrado)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                  />
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/german/germaan 2.png" : "/src/assets/images/queques/mini/german/german1peq.png"}
                    alt="Cake in the Box German (Abierto)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-102 group-hover:scale-100"
                  />
                  {/* Subtle label in bottom-right corner to notice hover behavior */}
                  <div className="absolute bottom-2 right-2 bg-amber-950/80 text-[8px] text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-mono opacity-80 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                    Pasa el cursor
                  </div>
                </div>

                <h4 className="font-serif text-lg font-black text-amber-950 mt-2">German</h4>
                <p className="text-xs text-amber-900/60 leading-relaxed mt-2 text-center pb-4">
                  Exponencial sabor de un bizcocho de chocolate de alta calidad con cobertura dulce tradicional, hilos de coco tostado y trozos de nueces pecanas seleccionadas.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-50 flex items-center justify-between gap-4 w-full">
                <div>
                  <span className="text-[10px] text-amber-900/40 font-mono block">Precio</span>
                  <span className="text-sm font-bold text-amber-950">
                    {selectedBoxIntroSize === "Grande" ? "₡14.500" : "₡3.500"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const matchingProduct = PRODUCTS.find(p => p.id === "box-german");
                    if (matchingProduct) {
                      const sizeObj = matchingProduct.sizes.find(s => s.label.includes(selectedBoxIntroSize === "Grande" ? "Grande" : "Mini"));
                      handleAddToCart({
                        product: matchingProduct,
                        quantity: 1,
                        selectedSize: sizeObj?.label || (selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"),
                        selectedServings: sizeObj?.servings || (selectedBoxIntroSize === "Grande" ? "3-4 personas" : "1 persona"),
                        selectedRibbon: matchingProduct.ribbonOptions?.[0] || "Ninguna",
                        customText: "",
                        customPrice: selectedBoxIntroSize === "Grande" ? 14500 : 3500
                      });
                      showToast(`¡Agregado ${matchingProduct.name} (${selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"}) al Carrito!`);
                    }
                  }}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </motion.div>

            {/* Flavor 3: Coco */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 border border-amber-100/70 shadow-lg relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                {selectedBoxIntroSize === "Grande" ? "32 oz" : "8 oz"}
              </div>

              <div className="flex flex-col items-center">
                {/* Dual image hover transition for premium interactive experience! */}
                <div className="w-full h-32 rounded-2xl border border-amber-100 shadow-inner my-6 flex items-center justify-center relative overflow-hidden bg-amber-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/coco/coco1.png" : "/src/assets/images/queques/mini/coco/coco1peq.png"}
                    alt="Cake in the Box Coco (Cerrado)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                  />
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/coco/coco2.png" : "/src/assets/images/queques/mini/coco/coco1peq.png"}
                    alt="Cake in the Box Coco (Abierto)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-102 group-hover:scale-100"
                  />
                  {/* Subtle label in bottom-right corner to notice hover behavior */}
                  <div className="absolute bottom-2 right-2 bg-amber-950/80 text-[8px] text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-mono opacity-80 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                    Pasa el cursor
                  </div>
                </div>

                <h4 className="font-serif text-lg font-black text-amber-950 mt-2">Coco</h4>
                <p className="text-xs text-amber-900/60 leading-relaxed mt-2 text-center pb-4">
                  Toque caribeño y delicado de finos copos de coco rallado sobre un tierno bizcocho sumamente esponjoso y humedecido en leche de coco real.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-50 flex items-center justify-between gap-4 w-full">
                <div>
                  <span className="text-[10px] text-amber-900/40 font-mono block">Precio</span>
                  <span className="text-sm font-bold text-amber-950">
                    {selectedBoxIntroSize === "Grande" ? "₡14.500" : "₡3.500"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const matchingProduct = PRODUCTS.find(p => p.id === "box-coco");
                    if (matchingProduct) {
                      const sizeObj = matchingProduct.sizes.find(s => s.label.includes(selectedBoxIntroSize === "Grande" ? "Grande" : "Mini"));
                      handleAddToCart({
                        product: matchingProduct,
                        quantity: 1,
                        selectedSize: sizeObj?.label || (selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"),
                        selectedServings: sizeObj?.servings || (selectedBoxIntroSize === "Grande" ? "3-4 personas" : "1 persona"),
                        selectedRibbon: matchingProduct.ribbonOptions?.[0] || "Ninguna",
                        customText: "",
                        customPrice: selectedBoxIntroSize === "Grande" ? 14500 : 3500
                      });
                      showToast(`¡Agregado ${matchingProduct.name} (${selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"}) al Carrito!`);
                    }
                  }}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </motion.div>

            {/* Flavor 4: Red Velvet */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 border border-amber-100/70 shadow-lg relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                {selectedBoxIntroSize === "Grande" ? "32 oz" : "8 oz"}
              </div>

              <div className="flex flex-col items-center">
                {/* Dual image hover transition for premium interactive experience! */}
                <div className="w-full h-32 rounded-2xl border border-amber-100 shadow-inner my-6 flex items-center justify-center relative overflow-hidden bg-amber-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/red_velvet_box_closed_1782157927213.png" : "/src/assets/images/queques/mini/red_velvet/red1peq.png"}
                    alt="Cake in the Box Red Velvet (Cerrado)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                  />
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/red_velvet_box_open_1782157943517.png" : "/src/assets/images/queques/mini/red_velvet/red1peq.png"}
                    alt="Cake in the Box Red Velvet (Abierto con cuchara)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-102 group-hover:scale-100"
                  />
                  {/* Subtle label in bottom-right corner to notice hover behavior */}
                  <div className="absolute bottom-2 right-2 bg-amber-950/80 text-[8px] text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-mono opacity-80 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                    Pasa el cursor
                  </div>
                </div>

                <h4 className="font-serif text-lg font-black text-amber-950 mt-2">Red Velvet</h4>
                <p className="text-xs text-amber-900/60 leading-relaxed mt-2 text-center pb-4">
                  El encanto incomparable de un bizcocho aterciopelado con ligeras notas de cacao de primera calidad, humectado delicadamente y relleno de queso crema.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-50 flex items-center justify-between gap-4 w-full">
                <div>
                  <span className="text-[10px] text-amber-900/40 font-mono block">Precio</span>
                  <span className="text-sm font-bold text-amber-950">
                    {selectedBoxIntroSize === "Grande" ? "₡14.500" : "₡3.500"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const matchingProduct = PRODUCTS.find(p => p.id === "box-red-velvet");
                    if (matchingProduct) {
                      const sizeObj = matchingProduct.sizes.find(s => s.label.includes(selectedBoxIntroSize === "Grande" ? "Grande" : "Mini"));
                      handleAddToCart({
                        product: matchingProduct,
                        quantity: 1,
                        selectedSize: sizeObj?.label || (selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"),
                        selectedServings: sizeObj?.servings || (selectedBoxIntroSize === "Grande" ? "3-4 personas" : "1 persona"),
                        selectedRibbon: matchingProduct.ribbonOptions?.[0] || "Ninguna",
                        customText: "",
                        customPrice: selectedBoxIntroSize === "Grande" ? 14500 : 3500
                      });
                      showToast(`¡Agregado ${matchingProduct.name} (${selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"}) al Carrito!`);
                    }
                  }}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </motion.div>

            {/* Flavor 5: Chocolate */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 border border-amber-100/70 shadow-lg relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                {selectedBoxIntroSize === "Grande" ? "32 oz" : "8 oz"}
              </div>

              <div className="flex flex-col items-center">
                {/* Dual image hover transition for premium interactive experience! */}
                <div className="w-full h-32 rounded-2xl border border-amber-100 shadow-inner my-6 flex items-center justify-center relative overflow-hidden bg-amber-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/chocolate/choco1.png" : "/src/assets/images/queques/mini/chocolate/choc1peq.png"}
                    alt="Cake in the Box Chocolate (Cerrado)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                  />
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/chocolate/choco2.png" : "/src/assets/images/queques/mini/chocolate/choc1peq.png"}
                    alt="Cake in the Box Chocolate (Abierto)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-102 group-hover:scale-100"
                  />
                  {/* Subtle label in bottom-right corner to notice hover behavior */}
                  <div className="absolute bottom-2 right-2 bg-amber-950/80 text-[8px] text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-mono opacity-80 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                    Pasa el cursor
                  </div>
                </div>

                <h4 className="font-serif text-lg font-black text-amber-950 mt-2">Chocolate</h4>
                <p className="text-xs text-amber-900/60 leading-relaxed mt-2 text-center pb-4">
                  Intenso y bizcocho húmedo de cacao de primera calidad, bañado con nuestro sedoso fudge de chocolate artesanal y chispas de cacao belga.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-50 flex items-center justify-between gap-4 w-full">
                <div>
                  <span className="text-[10px] text-amber-900/40 font-mono block">Precio</span>
                  <span className="text-sm font-bold text-amber-950">
                    {selectedBoxIntroSize === "Grande" ? "₡14.500" : "₡3.500"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const matchingProduct = PRODUCTS.find(p => p.id === "box-chocolate");
                    if (matchingProduct) {
                      const sizeObj = matchingProduct.sizes.find(s => s.label.includes(selectedBoxIntroSize === "Grande" ? "Grande" : "Mini"));
                      handleAddToCart({
                        product: matchingProduct,
                        quantity: 1,
                        selectedSize: sizeObj?.label || (selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"),
                        selectedServings: sizeObj?.servings || (selectedBoxIntroSize === "Grande" ? "3-4 personas" : "1 persona"),
                        selectedRibbon: matchingProduct.ribbonOptions?.[0] || "Ninguna",
                        customText: "",
                        customPrice: selectedBoxIntroSize === "Grande" ? 14500 : 3500
                      });
                      showToast(`¡Agregado ${matchingProduct.name} (${selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"}) al Carrito!`);
                    }
                  }}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </motion.div>

            {/* Flavor 6: Zanahoria */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-6 border border-amber-100/70 shadow-lg relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                {selectedBoxIntroSize === "Grande" ? "32 oz" : "8 oz"}
              </div>

              <div className="flex flex-col items-center">
                {/* Dual image hover transition for premium interactive experience! */}
                <div className="w-full h-32 rounded-2xl border border-amber-100 shadow-inner my-6 flex items-center justify-center relative overflow-hidden bg-amber-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/zanahoria/zana1.png" : "/src/assets/images/queques/mini/zanahoria/zana 1 peq.png"}
                    alt="Cake in the Box Zanahoria (Cerrado)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                  />
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedBoxIntroSize === "Grande" ? "/src/assets/images/queques/zanahoria/zana2.png" : "/src/assets/images/queques/mini/zanahoria/zana 1 peq.png"}
                    alt="Cake in the Box Zanahoria (Abierto)"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-102 group-hover:scale-100"
                  />
                  {/* Subtle label in bottom-right corner to notice hover behavior */}
                  <div className="absolute bottom-2 right-2 bg-amber-950/80 text-[8px] text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs font-mono opacity-80 uppercase tracking-widest group-hover:opacity-0 transition-opacity">
                    Pasa el cursor
                  </div>
                </div>

                <h4 className="font-serif text-lg font-black text-amber-950 mt-2">Zanahoria</h4>
                <p className="text-xs text-amber-900/60 leading-relaxed mt-2 text-center pb-4">
                  Tierno y aromático queque de zanahoria con especias seleccionadas, nueces pecana de gran sabor y un exquisito frosting de queso crema premium.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-amber-50 flex items-center justify-between gap-4 w-full">
                <div>
                  <span className="text-[10px] text-amber-900/40 font-mono block">Precio</span>
                  <span className="text-sm font-bold text-amber-950">
                    {selectedBoxIntroSize === "Grande" ? "₡14.500" : "₡3.500"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const matchingProduct = PRODUCTS.find(p => p.id === "box-zanahoria");
                    if (matchingProduct) {
                      const sizeObj = matchingProduct.sizes.find(s => s.label.includes(selectedBoxIntroSize === "Grande" ? "Grande" : "Mini"));
                      handleAddToCart({
                        product: matchingProduct,
                        quantity: 1,
                        selectedSize: sizeObj?.label || (selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"),
                        selectedServings: sizeObj?.servings || (selectedBoxIntroSize === "Grande" ? "3-4 personas" : "1 persona"),
                        selectedRibbon: matchingProduct.ribbonOptions?.[0] || "Ninguna",
                        customText: "",
                        customPrice: selectedBoxIntroSize === "Grande" ? 14500 : 3500
                      });
                      showToast(`¡Agregado ${matchingProduct.name} (${selectedBoxIntroSize === "Grande" ? "Grande 32 oz" : "Mini 8 oz"}) al Carrito!`);
                    }
                  }}
                  className="bg-amber-950 hover:bg-amber-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </motion.div>

          </div>

          {/* Slogan details and contact footer card */}
          <div className="mt-16 bg-[#35251F] text-white rounded-[32px] p-8 md:p-12 shadow-xl border border-white/10 text-left max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full font-serif">
                ¡Ordena tu Dulce Antojo!
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1.5 text-amber-100">Boutique de Miniaturas Gourmet</h3>
              <p className="text-xs text-amber-200/50 leading-relaxed max-w-lg">
                Hacemos entregas primorosas envueltas a mano con cintas de raso y seda finas. Escríbenos directamente o visítanos para coordinar tu sabor favorito.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-amber-100/70 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  📞 Ventas: +506 8851-7171
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  ✉️ cintasconsaborcostarica@gmail.com
                </div>
              </div>
            </div>
            
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Cintas%20con%20Sabor!%20Acabo%20de%20ver%20la%20introducción%2520general%20de%20los%20Cakes%20in%20the%20Box%20%2832oz%29%20y%20deseo%20ordenar%20mi%20sabor%20favorito.`}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs uppercase px-8 py-4.5 rounded-full shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2.5 whitespace-nowrap self-stretch md:self-auto justify-center"
            >
              <MessageCircle className="w-4 h-4 fill-amber-950 stroke-none" />
              Chatear sobre Cakes in a Box
            </a>
          </div>

        </div>
      </section>

      {/* SECTION: BIRTHDAY CAKES - LA GUÍA PERFECTA */}
      <section id="cumpleanos-guide" className="py-24 bg-white border-b border-amber-100/50 relative overflow-hidden">
        {/* Background decorative circles or patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50/30 rounded-full filter blur-3xl opacity-50 translate-x-12 -translate-y-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50/30 rounded-full filter blur-3xl opacity-50 -translate-x-12 translate-y-12 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Decorative Divider */}
          <div className="flex justify-center mb-6">
            <span className="text-amber-500 font-serif text-3xl font-light select-none tracking-widest flex items-center gap-3">
              <span className="text-xl">~</span> 
              <span className="font-semibold tracking-[0.15em] text-2xl">JC</span> 
              <span className="text-xl">~</span>
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-4xl sm:text-5xl font-black text-[#35251F] tracking-tight leading-tight mb-3">
            ¡LA GUÍA PERFECTA!
          </h2>
          <p className="text-sm sm:text-base text-amber-900/70 font-serif italic mb-16 max-w-2xl mx-auto">
            Varias presentaciones para todo tipo de actividades o antojos
          </p>

          {/* Size Comparison Flyer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto mb-20">
            
            {/* Size 1: Mini Cake (10 cm) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className={`bg-[#FAF6F0]/40 rounded-[32px] p-8 border border-amber-100/50 flex flex-col justify-between transition-all group hover:bg-[#FAF6F0]/70 cursor-pointer ${selectedCumpleSize === "Mini" ? "ring-2 ring-amber-500 bg-white" : ""}`}
              onClick={() => {
                setSelectedCumpleSize("Mini");
                if (selectedCumpleFlavor === "cumple-banano") {
                  setSelectedCumpleFlavor("cumple-vainilla");
                }
              }}
            >
              <div className="text-center">
                {/* Cake Silhouette Icon */}
                <div className="h-32 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 100 60" className="w-24 h-16 text-amber-950/80 mx-auto transition-transform group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M25,48 L75,48" strokeWidth="3" />
                    <path d="M28,48 L28,44 A2,2 0 0,1 30,42 L70,42 A2,2 0 0,1 72,44 L72,48 Z" fill="currentColor" fillOpacity="0.05" />
                    <rect x="32" y="20" width="36" height="22" rx="3" fill="none" />
                    <path d="M32,27 C34,25 36,25 38,27 C40,29 42,29 44,27 C46,25 48,25 50,27 C52,29 54,29 56,27 C58,25 60,25 62,27 C64,29 66,29 68,27" />
                  </svg>
                </div>
                {/* Diameter ruler label */}
                <div className="inline-block bg-amber-50 text-amber-900 border border-amber-100 text-[11px] font-mono px-3 py-1 rounded-full mb-6 font-bold">
                  10 cm
                </div>
                
                <h3 className="font-serif text-2xl font-black text-[#35251F] mb-2">Mini Cake</h3>
                <p className="text-sm text-amber-900/60 font-mono mb-4">4 porciones pequeñas</p>
              </div>
              <div className="mt-6 border-t border-amber-100/80 pt-6">
                <span className="text-2xl font-bold text-amber-950 font-serif text-amber-950">
                  ₡12.500
                </span>
              </div>
            </motion.div>

            {/* Size 2: Cake Individual (15 cm) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className={`bg-[#FAF6F0]/40 rounded-[32px] p-8 border border-amber-100/50 flex flex-col justify-between transition-all group hover:bg-[#FAF6F0]/70 cursor-pointer ${selectedCumpleSize === "Individual" ? "ring-2 ring-amber-500 bg-white" : ""}`}
              onClick={() => {
                setSelectedCumpleSize("Individual");
                const allowed = ["cumple-velvet", "cumple-belga", "cumple-mocha", "cumple-vainilla", "cumple-coco", "cumple-sachertorte"];
                if (!allowed.includes(selectedCumpleFlavor)) {
                  setSelectedCumpleFlavor("cumple-vainilla");
                }
              }}
            >
              <div className="text-center">
                {/* Cake Silhouette Icon */}
                <div className="h-32 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 100 60" className="w-28 h-20 text-amber-950/80 mx-auto transition-transform group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15,48 L85,48" strokeWidth="3.5" />
                    <path d="M18,48 L18,44 A2,2 0 0,1 20,42 L80,42 A2,2 0 0,1 82,44 L82,48 Z" fill="currentColor" fillOpacity="0.05" />
                    <rect x="22" y="18" width="56" height="24" rx="4" fill="none" />
                    <path d="M22,25 Q27,21 32,25 T42,25 T52,25 T62,25 T72,25 T82,25" />
                  </svg>
                </div>
                {/* Diameter ruler label */}
                <div className="inline-block bg-amber-50 text-amber-900 border border-amber-100 text-[11px] font-mono px-3 py-1 rounded-full mb-6 font-bold">
                  15 cm
                </div>

                <h3 className="font-serif text-2xl font-black text-[#35251F] mb-2">Cake Individual</h3>
                <p className="text-sm text-amber-900/60 font-mono mb-4">8 porciones pequeñas</p>
              </div>
              <div className="mt-6 border-t border-amber-100/80 pt-6">
                <span className="text-2xl font-bold text-amber-950 font-serif text-amber-950">
                  ₡18.500
                </span>
              </div>
            </motion.div>

            {/* Size 3: Cake Entero (21 cm) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className={`bg-[#FAF6F0]/40 rounded-[32px] p-8 border border-amber-100/50 flex flex-col justify-between transition-all group hover:bg-[#FAF6F0]/70 cursor-pointer ${selectedCumpleSize === "Entero" ? "ring-2 ring-amber-500 bg-white" : ""}`}
              onClick={() => {
                setSelectedCumpleSize("Entero");
                if (selectedCumpleFlavor === "cumple-german") {
                  setSelectedCumpleFlavor("cumple-vainilla");
                }
              }}
            >
              <div className="text-center">
                {/* Cake Silhouette Icon */}
                <div className="h-32 flex items-center justify-center mb-6">
                  <svg viewBox="0 0 100 60" className="w-32 h-22 text-amber-950/80 mx-auto transition-transform group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8,48 L92,48" strokeWidth="4" />
                    <path d="M11,48 L11,44 A2,2 0 0,1 13,42 L87,42 A2,2 0 0,1 89,44 L89,48 Z" fill="currentColor" fillOpacity="0.05" />
                    <rect x="14" y="16" width="72" height="26" rx="5" fill="none" />
                    <path d="M14,24 Q20,19 26,24 T38,24 T50,24 T62,24 T74,24 T86,24" />
                  </svg>
                </div>
                {/* Diameter ruler label */}
                <div className="inline-block bg-amber-50 text-amber-900 border border-amber-100 text-[11px] font-mono px-3 py-1 rounded-full mb-6 font-bold">
                  21 cm
                </div>

                <h3 className="font-serif text-2xl font-black text-[#35251F] mb-2">Cake Entero</h3>
                <p className="text-sm text-amber-900/60 font-mono mb-4">16-20 porciones grandes</p>
              </div>
              <div className="mt-6 border-t border-amber-100/80 pt-6">
                <span className="text-2xl font-bold text-amber-950 font-serif text-amber-950">
                  ₡36.500
                </span>
              </div>
            </motion.div>

          </div>

          {/* INTERACTIVE COMPOSER PANEL */}
          <div className="bg-[#FAF6F0] rounded-[40px] border border-amber-100 p-8 sm:p-12 max-w-5xl mx-auto shadow-xl text-left">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* LEFT SIDE: Flavor options */}
              <div className="flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-amber-800 text-[10px] uppercase tracking-widest font-black font-mono block mb-1">
                      Paso 1: Sabor de Cumpleaños
                    </span>
                    <h4 className="font-serif text-2xl font-black text-amber-950">Elija el Relleno y Bizcocho</h4>
                    <p className="text-xs text-amber-900/60 mt-1">Confeccionados con ingredientes 100% nobles importados</p>
                  </div>
                  
                  {/* Category Switcher Tab */}
                  <div className="flex p-0.5 bg-amber-100/50 rounded-xl border border-amber-200/40 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        setCumpleMenuTab("clasicas");
                        setSelectedCumpleFlavor("cumple-vainilla");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-3xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        cumpleMenuTab === "clasicas"
                          ? "bg-amber-950 text-white shadow-xs"
                          : "text-amber-900/80 hover:bg-amber-100/50"
                      }`}
                    >
                      Clásicos
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCumpleMenuTab("especiales");
                        setSelectedCumpleFlavor("cumple-fresa");
                        setSelectedCumpleSize("Entero");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-3xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        cumpleMenuTab === "especiales"
                          ? "bg-amber-950 text-white shadow-xs"
                          : "text-amber-900/80 hover:bg-amber-100/50"
                      }`}
                    >
                      Especiales & Extras
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cumpleMenuTab === "clasicas" ? (
                    [
                      { id: "cumple-vainilla", name: "Clásico Vainilla", emoji: "🎂", desc: "Vainilla Bourbon de Madagascar, dulce de leche repostero y chispitas festivas.", tag: "Con Imagen" },
                      { id: "cumple-german", name: "Suntuoso German", emoji: "🍫", desc: "Tradicional coco tostado, pecanas tiernas y un exquisito toque acaramelado.", tag: "Con Imagen" },
                      { id: "cumple-velvet", name: "Velvet Imperial", emoji: "🍓", desc: "La tradicional receta aterciopelada roja con frosting de queso crema suntuoso.", tag: "Con Imagen" },
                      { id: "cumple-belga", name: "Chocolate Belga", emoji: "🍫", desc: "Esponjoso bizcocho de chocolate al 70% de cacao belga y ganache trufado.", tag: "Con Imagen" },
                      { id: "cumple-mocha", name: "Café Mocha", emoji: "☕", desc: "Armonía entre bizcocho bañado de espresso fresco y crema de cacao suizo.", tag: "Solo Descripción" },
                      { id: "cumple-coco", name: "Coco Imperial", emoji: "🥥", desc: "Masa de coco con crema pastelera de coco artesanal y copos tostados.", tag: "Solo Descripción" },
                      { id: "cumple-zanahoria", name: "Zanahoria & Nueces", emoji: "🥕", desc: "Aromática masa jugosa de zanahoria con especias y crema de queso frosting.", tag: "Solo Descripción" },
                      { id: "cumple-sachertorte", name: "Sachertorte Vienés", emoji: "🍰", desc: "Bizcocho denso de chocolate amargo, coulis de albaricoques y glacé crocante.", tag: "Solo Descripción" },
                      { id: "cumple-banano", name: "Delicia de Banano", emoji: "🍌", desc: "Esponjosa y húmeda masa artesanal elaborada con bananos maduros seleccionados, con dulce de leche y nueces.", tag: "Solo Descripción" }
                    ].filter((flavor) => {
                      if (selectedCumpleSize === "Mini") {
                        return flavor.id !== "cumple-banano";
                      }
                      if (selectedCumpleSize === "Individual") {
                        return ["cumple-velvet", "cumple-belga", "cumple-mocha", "cumple-vainilla", "cumple-coco", "cumple-sachertorte"].includes(flavor.id);
                      }
                      if (selectedCumpleSize === "Entero") {
                        return flavor.id !== "cumple-german";
                      }
                      return true;
                    }).map((flavor) => {
                      let finalTag = flavor.tag;
                      if (selectedCumpleSize === "Individual") {
                        finalTag = "Con Imagen";
                      } else if (selectedCumpleSize === "Entero") {
                        finalTag = "Con Imagen";
                      } else if (selectedCumpleSize === "Mini") {
                        const hasMiniImg = ["cumple-vainilla", "cumple-german", "cumple-velvet", "cumple-belga"].includes(flavor.id);
                        finalTag = hasMiniImg ? "Con Imagen" : "Solo Descripción";
                      }
                      return (
                        <button
                          key={flavor.id}
                          onClick={() => setSelectedCumpleFlavor(flavor.id)}
                          className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-40 relative select-none cursor-pointer hover:shadow-md ${
                            selectedCumpleFlavor === flavor.id
                              ? "bg-white border-amber-500 shadow-md ring-1 ring-amber-500"
                              : "bg-white/65 hover:bg-white border-amber-100 text-amber-950"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl">{flavor.emoji}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded font-mono ${finalTag === "Con Imagen" ? "bg-emerald-50 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                {finalTag}
                              </span>
                              {selectedCumpleFlavor === flavor.id && (
                                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                                  ✓
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <h5 className="font-serif font-bold text-sm text-amber-950">{flavor.name}</h5>
                            <p className="text-[10px] text-amber-900/60 leading-tight mt-1 line-clamp-2">{flavor.desc}</p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    [
                      { id: "cumple-fresa", name: "Especial de Fresa", emoji: "🍓", desc: "Masa de vainilla con almíbar de fresas y exquisita jalea natural de la casa.", size: "Entero" },
                      { id: "cumple-german-mediano", name: "Suntuoso German Mediano", emoji: "🍫", desc: "De coco tostado, pecanas y caramelo. Formato mediano.", size: "Individual" },
                      { id: "cumple-flan-caramelo", name: "Flan de Caramelo", emoji: "🍮", desc: "Clásico flan cremoso con el punto óptimo de dulce de leche y caramelo.", size: "Individual" },
                      { id: "cumple-sandwich-mani", name: "Sándwich de Maní", emoji: "🥜", desc: "Bizcocho de chocolate y vainilla, crema de mantequilla de maní y ganache.", size: "Entero" },
                      { id: "cumple-bundt-limon", name: "Bundt de Limón", emoji: "🍋", desc: "Bundt cake húmedo con ralladura de limón natural y glaseado real.", size: "Entero" },
                      { id: "cumple-bundt-naranja", name: "Bundt Naranja & Chispas", emoji: "🍊", desc: "Masa cítrica con zumo puro de naranja premium y chispas de chocolate.", size: "Entero" },
                      { id: "cumple-bundt-chocolate", name: "Bundt Chocolate & Nueces", emoji: "🍩", desc: "Suntuoso Bundt de chocolate belga, enriquecido con trozos de nueces tostadas.", size: "Entero" },
                      { id: "cumple-bundt-cafe", name: "Bundt Café & Caramelo", emoji: "☕", desc: "Infusión con espresso de altura, bañado en caramelo salado y praliné.", size: "Entero" },
                      { id: "cumple-tartaleta-pudin", name: "Tartaleta Pudín Chocolate", emoji: "🥧", desc: "Masa sablé crujiente rellena con denso pudín de chocolate belga.", size: "Entero" },
                      { id: "cumple-tartaleta-pecanas", name: "Tartaleta de Pecanas", emoji: "🌰", desc: "Sablé crujiente con relleno meloso de pecanas y chocolate oscuro.", size: "Entero" }
                    ].map((flavor) => {
                      return (
                        <button
                          key={flavor.id}
                          onClick={() => {
                            setSelectedCumpleFlavor(flavor.id);
                            setSelectedCumpleSize(flavor.size as "Individual" | "Entero");
                          }}
                          className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-40 relative select-none cursor-pointer hover:shadow-md ${
                            selectedCumpleFlavor === flavor.id
                              ? "bg-white border-amber-500 shadow-md ring-1 ring-amber-500"
                              : "bg-white/65 hover:bg-white border-amber-100 text-amber-950"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl">{flavor.emoji}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded font-mono bg-[#EBF7FF] text-[#0066B3]">
                                {flavor.size === "Individual" ? "Mediano" : "Grande"}
                              </span>
                              {selectedCumpleFlavor === flavor.id && (
                                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                                  ✓
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <h5 className="font-serif font-bold text-sm text-amber-950 leading-tight">{flavor.name}</h5>
                            <p className="text-[10px] text-amber-900/60 leading-tight mt-1 line-clamp-2">{flavor.desc}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: Customizer options & price */}
              <div className="w-full lg:w-[400px] flex flex-col justify-between bg-white border border-amber-100 p-8 rounded-[32px] shadow-sm space-y-6 flex-shrink-0">
                <div className="space-y-5">
                  <div>
                    <span className="text-amber-800 text-[10px] uppercase tracking-widest font-black font-mono block mb-1">
                      Paso 2: Detalles Exclusivos
                    </span>
                    <h4 className="font-serif text-lg font-bold text-amber-950">Medida, Cinta y Escrito</h4>
                  </div>

                  {/* Vista Previa de la Decoración en Tiempo Real */}
                  <div className="w-full h-44 rounded-2xl bg-amber-50/50 border border-amber-100/60 overflow-hidden relative flex flex-col items-center justify-center">
                    {(() => {
                      const getCumplePreviewImage = () => {
                        const product = PRODUCTS.find(p => p.id === selectedCumpleFlavor);
                        if (product?.isSpecial) {
                          return product.image;
                        }
                        if (selectedCumpleSize === "Mini") {
                          if (selectedCumpleFlavor === "cumple-vainilla") return "/src/assets/images/queques/cumple/mini/vainilla/vainilla%20cumple%208cm.png";
                          if (selectedCumpleFlavor === "cumple-german") return "/src/assets/images/queques/cumple/mini/german/German%20cumple%208cm.png";
                          if (selectedCumpleFlavor === "cumple-velvet") return "/src/assets/images/queques/cumple/mini/red_velvet/RV%20cumple%208cm.png";
                          if (selectedCumpleFlavor === "cumple-belga") return "/src/assets/images/queques/cumple/mini/belga/Belga%208cm%20cumple.png";
                        } else if (selectedCumpleSize === "Individual") {
                          if (selectedCumpleFlavor === "cumple-vainilla") return "/src/assets/images/queques/cumple/mediano/vainilla/vainilla%2015cm.png";
                          if (selectedCumpleFlavor === "cumple-velvet") return "/src/assets/images/queques/cumple/mediano/red_velvet/RV%2015cm.png";
                          if (selectedCumpleFlavor === "cumple-belga") return "/src/assets/images/queques/cumple/mediano/belga/Belga%2015cm.png";
                          if (selectedCumpleFlavor === "cumple-mocha") return "/src/assets/images/queques/cumple/mediano/mocha/Mocha%2015cm.png";
                          if (selectedCumpleFlavor === "cumple-coco") return "/src/assets/images/queques/cumple/mediano/coco/coco%2015cm.png";
                          if (selectedCumpleFlavor === "cumple-sachertorte") return "/src/assets/images/queques/cumple/mediano/sacher/Saacher%2015cm.png";
                        } else if (selectedCumpleSize === "Entero") {
                          if (selectedCumpleFlavor === "cumple-vainilla") return "/src/assets/images/queques/cumple/grande/vainilla/vainilla%20grnade.png";
                          if (selectedCumpleFlavor === "cumple-velvet") return "/src/assets/images/queques/cumple/grande/red_velvet/RV%20grande.png";
                          if (selectedCumpleFlavor === "cumple-belga") return "/src/assets/images/queques/cumple/grande/belga/Belga%20groand.png";
                          if (selectedCumpleFlavor === "cumple-mocha") return "/src/assets/images/queques/cumple/grande/mocha/Mocha%20grande.png";
                          if (selectedCumpleFlavor === "cumple-coco") return "/src/assets/images/queques/cumple/grande/coco/coco%20graande.png";
                          if (selectedCumpleFlavor === "cumple-sachertorte") return "/src/assets/images/queques/cumple/grande/sacher/sacher%20grande.png";
                          if (selectedCumpleFlavor === "cumple-banano") return "/src/assets/images/queques/cumple/grande/banano/banana%20grande.png";
                          if (selectedCumpleFlavor === "cumple-zanahoria") return "/src/assets/images/queques/cumple/grande/zanahoria/zana%20grande.png";
                        }
                        return "";
                      };

                      const imgUri = getCumplePreviewImage();
                      
                      if (imgUri) {
                        return (
                          <>
                            <img
                              src={imgUri}
                              alt="Vista previa del queque de cumpleaños"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                            
                            {/* Medida Badge */}
                            <div className="absolute top-2 left-2 bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-yellow-100 uppercase tracking-widest font-black">
                              {selectedCumpleSize === "Mini" ? "Mini (10cm)" : selectedCumpleSize === "Individual" ? "Medio (15cm)" : "Entero (21cm)"}
                            </div>

                            {/* Live Ribbon Bow simulation badge */}
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-amber-950 flex items-center gap-1 font-mono font-bold max-w-[150px] truncate shadow-xs">
                              🎀 {selectedCumpleRibbon.replace("Cinta ", "").replace(" Satinada de Raso ", "").replace(" Lazo ", "")}
                            </div>

                            {/* Cursive text in the frosting simulation overlay */}
                            {selectedCumpleText.trim() && (
                              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs border border-amber-100 rounded-xl py-1.5 px-3 shadow-md text-center max-w-[90%] mx-auto">
                                <span className="block text-[8px] text-amber-800/60 uppercase font-black tracking-widest font-mono">Texto decorado:</span>
                                <span className="font-serif italic text-xs text-amber-950 font-bold block mt-0.5 truncate">
                                  " {selectedCumpleText} "
                                </span>
                              </div>
                            )}
                          </>
                        );
                      }

                      return (
                        <div className="text-center p-6 flex flex-col items-center justify-center space-y-2 h-full w-full">
                          <svg className="w-10 h-10 text-amber-950/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                          <span className="text-[10px] text-amber-950/50 font-black tracking-wider uppercase font-mono block">Receta de la Casa</span>
                          <span className="text-[9px] text-[#5C3A21]/75 font-mono italic max-w-xs">
                            {selectedCumpleFlavor === "cumple-mocha" 
                              ? "Decoración clásica con granas de cacao" 
                              : selectedCumpleFlavor === "cumple-coco" 
                              ? "Coco rallado tostado tropical artesanal" 
                              : selectedCumpleFlavor === "cumple-zanahoria" 
                              ? "Receta tradicional con nueces troceadas" 
                              : selectedCumpleFlavor === "cumple-banano"
                              ? "Confit de bananos seleccionados con dulce de leche"
                              : "Fachada clásica Sachertorte austriaca"}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Size toggles */}
                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-amber-900/70 block mb-2 font-mono">Presentación elegida (Guía):</label>
                    {(() => {
                      const selProd = PRODUCTS.find(p => p.id === selectedCumpleFlavor);
                      if (selProd?.isSpecial) {
                        return (
                          <div className="bg-amber-50/70 px-4 py-3 rounded-xl border border-amber-100/55 flex justify-between items-center select-none">
                            <span className="text-xs font-bold text-amber-950 font-sans">
                              {selProd.sizes[0].label} ({selProd.sizes[0].servings})
                            </span>
                            <span className="text-[9px] uppercase tracking-widest font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-100 font-extrabold">
                              Exclusivo
                            </span>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="grid grid-cols-3 gap-2 bg-amber-50/70 p-1 rounded-xl border border-amber-100/55">
                          {(["Mini", "Individual", "Entero"] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                setSelectedCumpleSize(sz);
                                if (sz === "Mini") {
                                  if (selectedCumpleFlavor === "cumple-banano") {
                                    setSelectedCumpleFlavor("cumple-vainilla");
                                  }
                                } else if (sz === "Individual") {
                                  const allowed = ["cumple-velvet", "cumple-belga", "cumple-mocha", "cumple-vainilla", "cumple-coco", "cumple-sachertorte"];
                                  if (!allowed.includes(selectedCumpleFlavor)) {
                                    setSelectedCumpleFlavor("cumple-vainilla");
                                  }
                                } else if (sz === "Entero") {
                                  if (selectedCumpleFlavor === "cumple-german") {
                                    setSelectedCumpleFlavor("cumple-vainilla");
                                  }
                                }
                              }}
                              className={`py-1.5 px-2 rounded-lg text-2xs font-bold transition-all text-center cursor-pointer ${
                                selectedCumpleSize === sz
                                  ? "bg-amber-950 text-white shadow-xs"
                                  : "text-amber-900/70 hover:bg-amber-100/50"
                              }`}
                            >
                              {sz === "Mini" ? "10 cm" : sz === "Individual" ? "15 cm" : "21 cm"}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Custom Ribbon selecting */}
                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-amber-900/70 block mb-2 font-mono">Cinta satinada de cortesía:</label>
                    <select
                      value={selectedCumpleRibbon}
                      onChange={(e) => setSelectedCumpleRibbon(e.target.value)}
                      className="w-full bg-amber-50/40 border border-amber-200/80 rounded-xl px-4 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-amber-500 font-sans font-medium"
                    >
                      <option value="Cinta Satinada de Raso Amarillo">Lazo Satinado Amarillo Festivo</option>
                      <option value="Cinta Celeste Dulce">Celeste Pastel Cumpleaños</option>
                      <option value="Cinta Fina de Seda Rosa Vintage">Seda Fina Rosa Vintage</option>
                      <option value="Cinta Dorada de Raso Imperial">Raso Oro Imperial Elegancia</option>
                      <option value="Cinta Satinada de Raso Rojo">Satinada Bordó Terciopelo</option>
                      <option value="Ninguna">Sin Cinta (Acento natural)</option>
                    </select>
                  </div>

                  {/* Dedicatoria input */}
                  <div>
                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-amber-900/70 block mb-2 font-mono flex items-center justify-between">
                      <span>Texto en el pastel o tag:</span>
                      <span className="text-[9px] text-amber-900/40 font-normal">Máx. 40 carácteres</span>
                    </label>
                    <input
                      type="text"
                      maxLength={40}
                      value={selectedCumpleText}
                      onChange={(e) => setSelectedCumpleText(e.target.value)}
                      placeholder="Ej: ¡Felicidades Mamá! ♥"
                      className="w-full bg-amber-50/40 border border-amber-200/80 rounded-xl px-4 py-2.5 text-xs text-amber-950 placeholder-amber-900/35 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>

                {/* COMPUTED SUB-TOTAL AND ADD ACTION */}
                <div className="border-t border-amber-100 pt-6 mt-6">
                  {(() => {
                    const selProd = PRODUCTS.find(p => p.id === selectedCumpleFlavor);
                    const isSpecial = selProd?.isSpecial;
                    const sizeObj = isSpecial 
                      ? selProd.sizes[0]
                      : selProd?.sizes[selectedCumpleSize === "Mini" ? 0 : selectedCumpleSize === "Individual" ? 1 : 2] || selProd?.sizes[0];
                    const priceVal = isSpecial 
                      ? (selProd?.price || 12500) 
                      : (selProd?.price || 12500) + (sizeObj?.priceAdder || 0);

                    return (
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-[10px] text-amber-900/50 block font-mono">Precio Final de Cumpleaños</span>
                          <span className="text-2xl font-black text-amber-950 font-serif">
                            ₡{priceVal.toLocaleString("de-DE")}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 font-mono">
                          {sizeObj?.servings ? sizeObj.servings.replace("personas", "pers.").replace("porciones", "porc.") : ""}
                        </span>
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => {
                      const selProd = PRODUCTS.find(p => p.id === selectedCumpleFlavor);
                      if (selProd) {
                        const sizeIndex = selectedCumpleSize === "Mini" ? 0 : selectedCumpleSize === "Individual" ? 1 : 2;
                        const sizeObj = selProd.isSpecial ? selProd.sizes[0] : selProd.sizes[sizeIndex];
                        const customProductPrice = selProd.isSpecial ? selProd.price : selProd.price + sizeObj.priceAdder;
                        
                        handleAddToCart({
                          product: selProd,
                          quantity: 1,
                          selectedSize: sizeObj.label,
                          selectedServings: sizeObj.servings,
                          selectedRibbon: selectedCumpleRibbon,
                          customText: selectedCumpleText || "(Sin dedicatoria especial)",
                          customPrice: customProductPrice
                        });
                        
                        showToast(`¡Agregado ${selProd.name} (${sizeObj.label}) al Carrito! 🎂`);
                      }
                    }}
                    className="w-full bg-amber-950 hover:bg-amber-900 text-white font-sans font-black text-xs uppercase py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Comprar Pastel de Cumpleaños
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>
        </>
      )}

      {/* SECTION: ANTOJOS PARA EL HOGAR */}
      {activeSection === "antojos" && (
        <section id="antojos-section" className="antojos-section py-24 bg-gradient-to-b from-white via-[#FAF6F0] to-white border-y border-amber-100/40 w-full relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/15 rounded-full filter blur-3xl opacity-40 translate-x-12 -translate-y-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100/15 rounded-full filter blur-3xl opacity-40 -translate-x-12 translate-y-12 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-2 font-mono">
              Placeres Diarios
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-amber-950 tracking-tight leading-tight mb-4">
              Antojos para el Hogar
            </h2>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-amber-900/80 uppercase mb-3 text-center">
              Pequeños placeres gourmet para compartir, regalar o disfrutar en casa.
            </p>
            <div className="w-12 h-0.5 bg-amber-500 rounded-full mb-6 opacity-40" />
            <p className="text-xs sm:text-sm text-amber-900/70 max-w-2xl text-center">
              Descubrí nuestras porciones individuales y cajas variadas, ideales para regalos, reuniones o antojos especiales.
            </p>
          </div>

          {/* Organizar los productos en 3 categorías visuales */}
          <div className="space-y-20">
            
            {/* CATEGORÍA 1: Porciones individuales */}
            <div className="antojos-category bg-[#FAF6F0]/45 p-6 sm:p-8 rounded-[40px] border border-amber-100/40 shadow-xs">
              <div className="mb-8 max-w-xl">
                <span className="text-[10px] tracking-widest uppercase text-amber-800 font-bold font-mono">Categoría I</span>
                <h3 className="font-serif text-2xl font-black text-amber-950 mt-1 mb-2">Porciones individuales</h3>
                <p className="text-xs text-amber-900/70">
                  Porciones de 8 cm, perfectas para disfrutar un antojo personal en cualquier momento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => p.category === "antojos" && !p.id.includes("caja") && !p.id.includes("mini") && !p.isCookie).map(prod => (
                  <AntojoCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    showToast={showToast}
                  />
                ))}
              </div>
            </div>

            {/* CATEGORÍA 2 & 3: Cajas de Porciones & Cajas Mini Gourmet */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* CATEGORÍA 2: Cajas de porciones */}
              <div className="antojos-category bg-[#FAF6F0]/45 p-6 sm:p-8 rounded-[40px] border border-amber-100/40 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <span className="text-[10px] tracking-widest uppercase text-amber-800 font-bold font-mono">Categoría II</span>
                    <h3 className="font-serif text-2xl font-black text-amber-950 mt-1 mb-2">Cajas de porciones</h3>
                    <p className="text-xs text-amber-900/70 mb-4">
                      Cajas variadas con porciones de 8 cm para compartir o regalar.
                    </p>
                    <div className="bg-amber-50/50 border border-amber-100/60 rounded-2xl p-4">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-950/70 block mb-1 font-mono">🍭 Sabores disponibles:</span>
                      <p className="text-2xs text-amber-900/80 leading-relaxed font-medium">
                        Red Velvet, German, Sachertorte, Coco, Vainilla, Chocolatine, Zanahoria, Mocha y Chocolate Belga.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {PRODUCTS.filter(p => p.category === "antojos" && p.id.includes("caja")).map(prod => (
                      <AntojoCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        showToast={showToast}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* CATEGORÍA 3: Cajas de Mini Gourmet */}
              <div className="antojos-category bg-[#FAF6F0]/45 p-6 sm:p-8 rounded-[40px] border border-amber-100/40 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="mb-6">
                    <span className="text-[10px] tracking-widest uppercase text-amber-800 font-bold font-mono">Categoría III</span>
                    <h3 className="font-serif text-2xl font-black text-amber-950 mt-1 mb-2">Cajas de Mini Gourmet</h3>
                    <p className="text-xs text-amber-900/70 mb-4">
                      Mini presentaciones gourmet de 6 cm, ideales para eventos, detalles o mesas dulces.
                    </p>
                    <div className="bg-amber-50/50 border border-amber-100/60 rounded-2xl p-4 space-y-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-950/70 block mb-1 font-mono">🍭 Sabores disponibles:</span>
                        <p className="text-2xs text-amber-900/80 leading-relaxed font-medium">
                          Red Velvet, Coco, Mocha, Vainilla, Sachertorte, Chocolate Belga, Flan de Caramelo, Chocolatine Francés, German y Zanahoria.
                        </p>
                      </div>
                      <div className="border-t border-amber-100/40 pt-2 text-[10px] text-amber-800 font-bold italic">
                        ⚠️ Nota importante: Especiales como Flan y Cheesecake de caramelo dependen de agenda y tienen mínimo de 5 unidades.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {PRODUCTS.filter(p => p.category === "antojos" && p.id.includes("mini")).map(prod => (
                      <AntojoCard
                        key={prod.id}
                        product={prod}
                        onAddToCart={handleAddToCart}
                        showToast={showToast}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* CATEGORÍA 4: Galletas Artesanales */}
            <div className="antojos-category bg-[#FAF6F0]/45 p-6 sm:p-8 rounded-[40px] border border-amber-100/40 shadow-xs">
              <div className="mb-8 max-w-xl">
                <span className="text-[10px] tracking-widest uppercase text-amber-800 font-bold font-mono">Categoría IV</span>
                <h3 className="font-serif text-2xl font-black text-amber-950 mt-1 mb-2">Galletas Artesanales</h3>
                <p className="text-xs text-amber-900/70 mb-4">
                  Recetas exclusivas elaboradas con ingredientes selectos y horneadas a la perfección para lograr la textura ideal.
                </p>
                <div className="bg-amber-50/50 border border-amber-100/60 rounded-2xl p-4">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-950/70 block mb-1 font-mono">🍪 Nota sobre pedidos:</span>
                  <p className="text-2xs text-amber-900/80 leading-relaxed font-medium">
                    Para asegurar la máxima frescura de nuestra pastelería fina, cada variedad de galletas cuenta con un pedido mínimo de unidades para su elaboración.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => p.category === "antojos" && p.isCookie).map(prod => (
                  <AntojoCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    showToast={showToast}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* CTA FINAL BUTTON ORDER BY WHATSAPP */}
          <div className="mt-16 flex flex-col items-center justify-center">
            <div className="max-w-lg text-center mb-6">
              <p className="text-xs text-amber-900/60 leading-relaxed">
                ¿Listo para enviar tu pedido? Podés armar tu carrito agregando tus antojos favoritos y luego dar clic abajo para enviar todo detallado por WhatsApp de forma instantánea.
              </p>
            </div>
            
            <button
              onClick={() => {
                if (cartItemCount > 0) {
                  handleCheckoutViaWhatsApp();
                } else {
                  const customText = encodeURIComponent("¡Hola Cintas con Sabor! Vengo de la sección 'Antojos para el Hogar' y me gustaría hacer una consulta para encargar unos antojos gourmet.");
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${customText}`, "_blank");
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-black text-xs uppercase tracking-widest py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5 stroke-[2]" />
              {cartItemCount > 0 ? "Ordenar Carrito por WhatsApp" : "Ordenar por WhatsApp"}
            </button>
          </div>

        </div>
      </section>
      )}

      {/* SECTION: SERVICIO DE CATERING & MENÚ GENERAL */}
      {activeSection === "catering" && (
        <section id="catering-section" className="py-24 bg-gradient-to-b from-[#FAF6F0] via-white to-[#F5EFE6] border-y border-amber-100/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/40 rounded-full filter blur-3xl opacity-60 translate-x-24 -translate-y-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50/30 rounded-full filter blur-3xl opacity-40 -translate-x-24 translate-y-24 pointer-events-none" />
        
        {/* Fine gold lines / elegant borders */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            {/* Elegant brand signature */}
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[1px] w-6 bg-amber-300" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-amber-800 font-bold font-mono">
                Catering y Eventos Luxe
              </span>
              <span className="h-[1px] w-6 bg-amber-300" />
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight leading-none uppercase">
              Catering & Menú General
            </h2>
            
            <div className="w-16 h-[2px] bg-amber-300 my-5" />
            
            <p className="font-serif text-sm sm:text-base italic font-light text-amber-900/80 tracking-wide leading-relaxed">
              &ldquo;Una exclusiva selección de bocados gourmet dulces y salados, diseñados meticulosamente para bodas, té de canastilla, corporativos y celebraciones selectas en Costa Rica.&rdquo;
            </p>
          </div>

          {/* Subcategory selection tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { id: "mini_gourmet_dulces", label: "🍰 Mini Dulces", count: 50 },
              { id: "mini_gourmet_cookies", label: "🍪 Cookies", count: 1 },
              { id: "brigadeiros", label: "🍫 Brigadeiros", count: 27 },
              { id: "dulces_especiales", label: "🍭 Especiales", count: 13 },
              { id: "mini_gourmet_salados", label: "🥪 Salados", count: 27 }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveCateringSubcategory(sub.id as any)}
                className={`px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeCateringSubcategory === sub.id
                    ? "bg-amber-950 text-white shadow-lg scale-105 font-sans"
                    : "bg-white hover:bg-amber-50 border border-amber-100/60 text-amber-900 font-sans"
                }`}
              >
                <span>{sub.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeCateringSubcategory === sub.id ? "bg-white/20 text-white" : "bg-amber-100 text-amber-950"
                }`}>
                  {sub.count}
                </span>
              </button>
            ))}
          </div>

          {/* Conditional helpful banner for salados */}
          {activeCateringSubcategory === "mini_gourmet_salados" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 max-w-2xl mx-auto bg-amber-50/75 border border-amber-200/60 p-5 rounded-2xl flex items-center gap-4 text-xs text-amber-950 leading-relaxed"
            >
              <div className="text-xl">🥪</div>
              <div>
                <strong>Nota sobre los Mini Salados:</strong> De acuerdo con nuestro catálogo general, las especialidades saladas no cuentan con fotografía individual. Se preparan frescos y a la medida de tu buffet bajo los más estrictos estándares culinarios gourmet.
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.filter(p => p.category === "catering" && p.subcategory === activeCateringSubcategory).map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Elegant Custom Catering CTA Prompt Box */}
          <div className="mt-16 bg-gradient-to-tr from-amber-950 to-amber-900 text-amber-50 rounded-[40px] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-800/50">
            {/* Elegant Background Circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none" />
            
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="text-[10px] tracking-widest uppercase font-black text-amber-400 font-mono bg-white/10 px-3 py-1 rounded-full">
                Servicio Exclusivo Club d'Or Catering
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight">¿Planeando un evento especial o mesa de postres?</h3>
              <p className="text-xs md:text-sm text-amber-100/80 leading-relaxed font-light">
                Brindamos asesoría culinaria personalizada completa. Coordiná con nuestra chef los detalles de tu evento, cantidades recomendadas de bocados por persona, y selección de sabores exquisitos.
              </p>
            </div>
            
            <button
              onClick={() => {
                const customText = encodeURIComponent(`¡Hola Cintas con Sabor! Estoy interesado en contratar el servicio de catering y menú general para un evento especial.`);
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${customText}`, "_blank");
              }}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-sans font-black text-xs uppercase tracking-widest py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 shrink-0 relative z-10 cursor-pointer"
            >
              Cotizar Evento en WhatsApp
            </button>
          </div>

        </div>
      </section>
      )}

      {/* SECTION: PRODUCT CATALOG / MENUS GOURMET */}
      {activeSection === "menus" && (
        <section id="menus" className="py-24 w-full max-w-none px-6 sm:px-12 lg:px-20">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-2 font-mono">
            Pastelería en Detalle
          </span>
          <h2 className="font-serif text-3.5xl sm:text-4.5xl font-black text-amber-950 tracking-tight leading-tight mb-4">
            Nuestros Menús Exclusivos
          </h2>
          <div className="w-12 h-1 bg-amber-500 rounded-full mb-4 opacity-50" />
          <p className="text-sm sm:text-base text-amber-900/70">
            Cada postre es confeccionado desde cero con ingredientes nobles importados, vainilla pura natural, cremas batidas frescas, y empaquetado con nuestra firma: una cinta satinada anudad de forma impecable.
          </p>
        </div>

        {/* Categories Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12" id="catalog-category-tabs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-amber-950 text-white shadow-md scale-105"
                : "bg-white hover:bg-amber-50 border border-amber-100/80 text-amber-900"
            }`}
          >
            🌟 Ver Todo
          </button>
          
          <button
            onClick={() => setActiveCategory("box")}
            id="menus-box"
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "box"
                ? "bg-amber-950 text-white shadow-md scale-105"
                : "bg-white hover:bg-amber-50 border border-amber-100/80 text-amber-900"
            }`}
          >
            🎁 Cakes in the Box (Mini & Grandes)
          </button>

          <button
            onClick={() => setActiveCategory("gourmet")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "gourmet"
                ? "bg-amber-950 text-white shadow-md scale-105"
                : "bg-white hover:bg-amber-50 border border-amber-100/80 text-amber-900"
            }`}
          >
            ✨ Alta Pastelería Gourmet
          </button>

          <button
            onClick={() => setActiveCategory("bodas")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "bodas"
                ? "bg-amber-950 text-white shadow-md scale-105"
                : "bg-white hover:bg-amber-50 border border-amber-100/80 text-amber-900"
            }`}
          >
            👑 Ediciones Especiales & Bodas
          </button>

          <button
            onClick={() => setActiveCategory("cumple")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "cumple"
                ? "bg-amber-950 text-white shadow-md scale-105"
                : "bg-white hover:bg-amber-50 border border-amber-100/80 text-amber-900"
            }`}
          >
            🎂 Cakes de Cumpleaños
          </button>

          <button
            onClick={() => setActiveCategory("catering")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "catering"
                ? "bg-amber-950 text-white shadow-md scale-105"
                : "bg-white hover:bg-amber-50 border border-amber-100/80 text-amber-900"
            }`}
          >
            🥪 Catering & Menú General
          </button>
        </div>

        {/* Sizing switcher specifically for Cakes in the Box category */}
        {activeCategory === "box" && (
          <div className="mb-10 text-center animate-fade-in">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5C3A21] mb-3">
              Selecciona el Tamaño de Cake in the Box a Mostrar:
            </p>
            <div className="inline-flex border border-amber-100 bg-white p-1.5 rounded-2xl shadow-xs gap-1">
              <button
                onClick={() => setSelectedBoxIntroSize("Mini")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedBoxIntroSize === "Mini"
                    ? "bg-[#5C3A21] text-white shadow-xs"
                    : "text-amber-900/60 hover:bg-amber-50"
                }`}
              >
                🧁 Versión Mini (8 oz)
              </button>
              <button
                onClick={() => setSelectedBoxIntroSize("Grande")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedBoxIntroSize === "Grande"
                    ? "bg-[#5C3A21] text-white shadow-xs"
                    : "text-amber-900/60 hover:bg-amber-50"
                }`}
              >
                🎁 Versión Grande (32 oz)
              </button>
            </div>
            <p className="text-[11px] text-amber-900/60 mt-3.5 max-w-md mx-auto">
              {selectedBoxIntroSize === "Grande" 
                ? "Mostrando versión de 32 oz (3-4 personas), empacado en estuche de lujo con cintas de raso finas y detalles premium." 
                : "Mostrando versión Mini de 8 oz (antojo individual), en contenedor elegante con lazo decorativo de raso atado a mano."}
            </p>
          </div>
        )}

        {/* Product Cards Layout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={handleAddToCart}
              defaultSizeLabel={prod.category === "box" ? selectedBoxIntroSize : undefined}
            />
          ))}
        </div>

        {/* Menu Notes Banner */}
        <div className="mt-12 text-center bg-white border border-amber-100 p-6 rounded-3xl max-w-xl mx-auto flex items-center gap-4">
          <HelpCircle className="w-8 h-8 text-amber-700 flex-shrink-0" />
          <p className="text-xs text-amber-900/70 text-left">
            <strong>¿Tienes un pedido urgente o de diseño único?</strong> Si deseas cambiar el color de una cinta, remover ingredientes alergénicos específicos o planear un buffet completo, conversemos directamente vía WhatsApp tocando el botón flotante lateral.
          </p>
        </div>
      </section>
      )}



      {/* SECTION: ASISTENTE AI - MAESTRO PASTELERO CON GEMINI API */}
      {activeSection === "asistente" && (
        <section id="asistente" className="py-24 bg-white relative w-full">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-50/20 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-none px-6 sm:px-12 lg:px-20 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-950 flex items-center justify-center mb-4">
              <ChefHat className="w-6 h-6 text-amber-800" />
            </div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-2 font-mono">
              Inteligente & Exclusivo
            </span>
            <h2 className="font-serif text-3xl sm:text-4.5xl font-black text-amber-950 tracking-tight leading-tight mb-4">
              Asistente Pastelero Inteligente
            </h2>
            <p className="text-sm text-amber-900/70">
              ¿No estás seguro de cuál es el pastel idóneo para tu evento o paladar? Cuéntale a nuestro Maestro Pastelero de Inteligencia Artificial tus gustos, y él te prescribirá una combinación sublime junto con consejos de cata.
            </p>
          </div>

          <div className="bg-[#FAF6F0] rounded-3xl p-6 md:p-10 border border-amber-100 shadow-xl">
            <form onSubmit={handleAskTheChef} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Preferences field */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-2">
                    🍒 ¿Qué Sabores te fascinan?
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    placeholder="Ej: Chocolate belga amargo, dulce de leche, frutas frescas tiernas, etc."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="px-4 py-3 bg-white rounded-xl border border-amber-100 focus:outline-none focus:border-amber-500 text-sm placeholder-amber-900/40 text-amber-950 shadow-xs"
                  />
                </div>

                {/* Event Type field */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-2">
                    🎈 ¿Cuál es la Ocasión especial?
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="px-4 py-3 bg-white rounded-xl border border-amber-100 focus:outline-none focus:border-amber-500 text-sm text-amber-950 shadow-xs cursor-pointer"
                  >
                    <option value="Aniversario Romántico">Aniversario Romántico extremadamente elegante</option>
                    <option value="Cumpleaños Sorpresa">Cumpleaños Sorpresa</option>
                    <option value="Cena de Gala con amigos">Cena de Gala / Banquete con amig@s</option>
                    <option value="Regalo Corporativo Lujoso">Regalo Corporativo Lujoso</option>
                    <option value="Boda de Ensueño">Boda de Ensueño / Compromiso</option>
                    <option value="Antojo Personal de fin de semana">Antojo Personal de fin de semana</option>
                  </select>
                </div>
              </div>

              {/* Dietary specifications and Allergies */}
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-900/80 mb-2">
                  🌾 Restricciones Alimenticias (Opcional)
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Ej: Evitar frutos secos, sin alcohol, bajo en azúcar, etc."
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="px-4 py-3 bg-white rounded-xl border border-amber-100 focus:outline-none focus:border-amber-500 text-sm placeholder-amber-900/40 text-amber-950 shadow-xs"
                />
              </div>

              {/* Call-to-action generate recommendations */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-amber-950 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ChefHat className="w-4.5 h-4.5 text-amber-400" />
                  {isGenerating ? "Consultando al Maestro Pastelero..." : "Obtener Recomendación Dulce"}
                </button>
              </div>
            </form>

            {/* AI Response recommendation readout */}
            <AnimatePresence>
              {chefRecommendation && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 border-t border-amber-200/60 pt-8"
                >
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-amber-150 shadow-md relative overflow-hidden">
                    
                    {/* Ribbon background design element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center opacity-30 transform translate-x-8 -translate-y-8">
                      <Award className="w-16 h-16 text-amber-900" />
                    </div>

                    <div className="relative z-10 space-y-4">
                      
                      <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Prescripción de Alta Pastelería</span>
                      </div>

                      <h3 className="font-serif text-2xl text-amber-950 font-black">
                        {chefRecommendation.cakeName}
                      </h3>

                      <p className="text-sm italic text-amber-950 font-medium">
                        "{chefRecommendation.description}"
                      </p>

                      <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed pt-2">
                        <strong>Razonamiento del Chef:</strong> {chefRecommendation.whyItsPerfect}
                      </p>

                      {/* Presentation & Ribbon tip */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-50">
                        <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                          <span className="text-[10px] text-amber-900/50 uppercase tracking-widest block font-bold mb-1">
                            Ajuste de Moño Recomendado
                          </span>
                          <span className="text-xs font-bold text-amber-950 block">
                            🎀 {chefRecommendation.ribbonDetail}
                          </span>
                        </div>
                        <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                          <span className="text-[10px] text-amber-900/50 uppercase tracking-widest block font-bold mb-1">
                            Secreto de Degustación
                          </span>
                          <span className="text-xs italic text-amber-950 block">
                            💡 {chefRecommendation.chefSecretTip}
                          </span>
                        </div>
                      </div>

                      {/* Quick order of the AI suggestion prompt */}
                      <div className="pt-4 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            // Find matching product or add a custom simulated recommendation box
                            const matchingProd = PRODUCTS.find(
                              p => p.name.toLowerCase().includes(chefRecommendation.cakeName.toLowerCase()) ||
                              chefRecommendation.cakeName.toLowerCase().includes(p.name.toLowerCase())
                            );

                            if (matchingProd) {
                              handleAddToCart({
                                product: matchingProd,
                                quantity: 1,
                                selectedSize: matchingProd.sizes[0].label,
                                selectedServings: matchingProd.sizes[0].servings,
                                selectedRibbon: chefRecommendation.ribbonDetail,
                                customText: `Sugerido por Chef AI (${eventType})`,
                                customPrice: matchingProd.price
                              });
                            } else {
                              // Custom placeholder creation
                              const virtualProduct: Product = {
                                id: `ai-suggest-${Date.now()}`,
                                name: chefRecommendation.cakeName,
                                description: chefRecommendation.description,
                                price: 39000,
                                category: "gourmet",
                                image: "/src/assets/images/hero_luxury_cake_1782151687947.jpg",
                                rating: 5.0,
                                sizes: [{ label: "Recomendado Especial", priceAdder: 0, servings: "8-10 personas" }]
                              };

                              handleAddToCart({
                                product: virtualProduct,
                                quantity: 1,
                                selectedSize: "Recomendado Especial",
                                selectedServings: "8-10 personas",
                                selectedRibbon: chefRecommendation.ribbonDetail,
                                customText: `Recetado por Asistente de IA para ${eventType}`,
                                customPrice: 39000
                              });
                            }
                            setIsCartOpen(true);
                          }}
                          className="bg-amber-950 hover:bg-amber-900 text-[#FAF6F0] font-bold text-xs uppercase px-5 py-3 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Agregar Recomendación al Carrito
                        </button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errorGenerating && (
              <div className="mt-4 text-center text-xs text-red-800 bg-red-50 p-3 rounded-xl border border-red-200">
                Hubo un inconveniente consultando al chef por internet, pero te hemos preparado nuestra tarta premium de temporada a modo de exquisita recomendación ideal.
              </div>
            )}
          </div>

        </div>
      </section>
      )}

      {/* SECTION: UBICACIÓN, HORARIOS Y CONTACTO EXPRESS */}
      {activeSection === "ubicacion" && (
        <section id="ubicacion" className="py-24 bg-gradient-to-b from-white via-[#FAF6F0] to-white w-full animate-fade-in">
          <div className="w-full max-w-none px-6 sm:px-12 lg:px-20">
            
            <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest text-[#5C3A21] font-black mb-2 font-mono">
                Atelier Repostería Fina
              </span>
              <h2 className="font-serif text-3.5xl sm:text-4.5xl font-black text-amber-950 tracking-tight leading-tight mb-4">
                Visitá nuestras ubicaciones
              </h2>
              <div className="w-12 h-[1px] bg-amber-300 mb-4" />
              <p className="text-sm sm:text-base text-amber-900/70 max-w-xl">
                Te esperamos en nuestros espacios gastronómicos para deleitar tus sentidos con la más alta pastelería artesanal y una atención personalizada incomparable.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Premium Location details */}
              <div className="md:col-span-7 bg-white rounded-[32px] border border-amber-100/80 p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-[#5C3A21]/5 border border-[#5C3A21]/10 rounded-full py-1 px-3.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5C3A21]" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#5C3A21] font-mono">
                      Puntos de Encuentro
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-amber-950 font-bold tracking-tight">
                    Nuestras Boutiques Gourmet
                  </h3>

                  <div className="space-y-6 pt-2">
                    {/* Location 1 */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-[#5C3A21]/5 border border-[#5C3A21]/10 flex items-center justify-center text-[#5C3A21] flex-shrink-0 group-hover:bg-[#5C3A21] group-hover:text-white transition-all duration-300">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#5C3A21] uppercase tracking-wider font-mono">Atelier Río Oro</h4>
                        <p className="text-sm font-medium text-amber-950 leading-snug">
                          Río Oro: C. 32, San José, Río Oro, 10904, Costa Rica
                        </p>
                      </div>
                    </div>

                    {/* Location 2 */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-[#5C3A21]/5 border border-[#5C3A21]/10 flex items-center justify-center text-[#5C3A21] flex-shrink-0 group-hover:bg-[#5C3A21] group-hover:text-white transition-all duration-300">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#5C3A21] uppercase tracking-wider font-mono">Atelier Avenida Escazú</h4>
                        <p className="text-sm font-medium text-amber-950 leading-snug">
                          Avenida Escazú, Costa Rica
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Beautiful Map representation to avoid raw telemetry indicators */}
                <div className="w-full h-40 bg-[#FAF6F0] rounded-2xl relative overflow-hidden border border-amber-200/40 flex items-center justify-center p-4 mt-8">
                  {/* Styled minimalist graphic representing street nodes */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="w-full h-0.5 bg-amber-900 absolute top-[40%]" />
                    <div className="w-full h-0.5 bg-amber-900 absolute top-[75%]" />
                    <div className="h-full w-0.5 bg-amber-900 absolute left-[30%]" />
                    <div className="h-full w-0.5 bg-amber-900 absolute left-[70%]" />
                  </div>

                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-amber-100 flex items-center gap-3 z-10 text-left max-w-[260px]">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                      <MapPin className="w-4 h-4 fill-red-100" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-[#5C3A21] uppercase tracking-wider font-mono">Cintas con Sabor</h4>
                      <p className="text-[10px] text-amber-900/70">San José & Escazú, Costa Rica</p>
                    </div>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 text-[9px] text-amber-900/40 uppercase font-mono tracking-widest bg-white/50 px-2 py-0.5 rounded">
                    Atelier Map View
                  </span>
                </div>

              </div>

              {/* Right Column: Hours & WhatsApp Contact (Premium Card layout) */}
              <div className="md:col-span-5 bg-[#35251F] text-[#FAF6F0] rounded-[32px] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border border-white/5">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full py-1 px-3.5 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-200 font-mono">
                      Horarios de Atención
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                    Nuestras Horas de Dulzura
                  </h3>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-amber-100">Lunes a sábado</span>
                      </div>
                      <span className="text-sm font-bold text-white font-mono">9:00 a.m. - 7:00 p.m.</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-amber-100">Domingo</span>
                      </div>
                      <span className="text-sm font-black text-amber-400/80 uppercase tracking-wider font-mono bg-white/5 px-2.5 py-0.5 rounded-md">
                        Cerrado
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 text-xs text-amber-200/60 leading-relaxed">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-amber-400 font-bold flex-shrink-0 text-[10px]">
                        ✓
                      </div>
                      <span>Pedidos especiales con mínimo 48 horas de anticipación.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-10 relative z-10">
                  <p className="text-[11px] text-amber-200/50 mb-3 text-center">
                    ¿Deseas realizar un pedido personalizado o cotizar para tu evento?
                  </p>
                  <a
                    href={WHATSAPP_LINK_SUPPORT}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-[#211411] font-bold text-xs uppercase tracking-widest py-4.5 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-lg text-center hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 fill-[#211411] stroke-[1.5]" />
                    Ordenar por WhatsApp
                  </a>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-amber-950 text-amber-100/75 py-12 border-t border-amber-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identification */}
          <div className="space-y-4 flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center select-none">
                <Cake className="w-4.5 h-4.5 text-amber-950" />
              </div>
              <span className="font-serif font-black tracking-wide text-white text-base">Cintas con Sabor</span>
            </div>
            <p className="text-xs text-amber-200/50 leading-relaxed font-sans">
              La marca original de repostería fina que entrega cada uno de sus pasteles húmedos premium listos para regalo, abrazados con un moño y cinta satinada.
            </p>
          </div>

          {/* Col 2: Navigation map */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAF6F0]">Navegación</h4>
            <div className="flex flex-col items-start space-y-1.5 text-xs">
              <button 
                onClick={() => {
                  setActiveSection("inicio");
                }}
                className="hover:text-amber-200 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-amber-100/75"
              >
                Inicio
              </button>
              <button 
                onClick={() => {
                  setActiveSection("antojos");
                }}
                className="hover:text-amber-200 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-amber-100/75"
              >
                Antojos para el Hogar
              </button>
              <button 
                onClick={() => {
                  setActiveSection("menus");
                  setActiveCategory("all");
                }}
                className="hover:text-amber-200 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-amber-100/75"
              >
                Menú de Colección
              </button>
              <button 
                onClick={() => {
                  setActiveSection("asistente");
                }}
                className="hover:text-amber-200 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-amber-100/75"
              >
                Asistente Chef AI
              </button>
              <button 
                onClick={() => {
                  setActiveSection("ubicacion");
                }}
                className="hover:text-amber-200 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-amber-100/75"
              >
                Ubicación & Despachos
              </button>
            </div>
          </div>

          {/* Col 3: Direct contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAF6F0]">Contacto</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-amber-200/60 font-sans">
              <span>📍 San José, Costa Rica</span>
              <span>📞 +506 8851-7171</span>
              <span>✉️ cintasconsaborcostarica@gmail.com</span>
            </div>
          </div>

          {/* Col 4: Redes Sociales */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAF6F0]">Nuestras Redes</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com/cintas_con_sabor"
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-white flex items-center justify-center transition-colors"
                title="Siguenos en Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/cintasconsaborcr"
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-white flex items-center justify-center transition-colors"
                title="Siguenos en Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={WHATSAPP_LINK_SUPPORT}
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-amber-200/40">Sigue nuestras publicaciones diarias para conocer cintas de edición limitada semanal.</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-amber-900/65 flex flex-col sm:flex-row items-center justify-between text-[11px] text-amber-200/40 gap-4">
          <span>&copy; {new Date().getFullYear()} Cintas con Sabor. Todos los derechos reservados. Repostería Fina.</span>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span>Esta página fue creada por <a href="https://mantaiweb.com" target="_blank" rel="noopener noreferrer" className="underline text-amber-300/80 hover:text-amber-300 transition-colors font-semibold">mantaiweb.com</a></span>
            <span className="font-mono hidden sm:inline">|</span>
            <span className="font-mono">Hecho con amor y cintas de seda. Atado a mano.</span>
          </div>
        </div>
      </footer>

      {/* FLOAT PERSISTENT CHAT SIDEBAR DRAWER - MOBILE & DESKTOP CART */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="floating-cart-drawer">
            {/* Dark overlay backdrop */}
            <div 
              className="absolute inset-0 bg-amber-950/45 backdrop-blur-xs transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="w-screen max-w-md bg-[#FAF6F0] text-amber-950 flex flex-col shadow-2xl relative border-l border-amber-100"
              >
                {/* Header of Drawer */}
                <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-[#F2EDE4]">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-900" />
                    <h3 className="font-serif text-lg font-black text-amber-950">Carrito de Cintas</h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full text-amber-900 hover:bg-amber-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Body with selected items list */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 text-amber-900/50">
                      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-amber-950 text-sm">Tu canasta está vacía</h4>
                        <p className="text-xs pt-1">Explora nuestro menú y añade tu pastel gourmet decorado hoy.</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          window.location.hash = "#menus";
                        }}
                        className="bg-amber-950 text-[#FAF6F0] font-bold text-xs uppercase px-4 py-2.5 rounded-full"
                      >
                        Ver Catálogo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs flex items-start gap-4">
                          
                          {/* Image mini product */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 flex items-center justify-center">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-2xl">🍰</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-grow">
                            <h4 className="text-xs font-bold text-amber-950 italic line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-amber-900/60 mt-0.5">
                              Tamaño: <span className="font-semibold text-amber-950">{item.selectedSize}</span>
                            </p>
                            <p className="text-[10px] text-amber-900/60 font-mono">
                              🍬 {item.selectedRibbon}
                            </p>

                            {/* Custom label dedicatory */}
                            {item.customText.trim() && (
                              <div className="mt-1 text-[9px] bg-amber-50 p-1.5 rounded text-amber-900 border border-amber-100 italic">
                                "{item.customText}"
                              </div>
                            )}

                            {/* Qty & delete row */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 bg-amber-50 rounded-full px-2 py-0.5 border border-amber-100">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, false)}
                                  className="text-[10px] font-bold text-amber-900 w-4 block text-center"
                                >
                                  -
                                </button>
                                <span className="text-[10px] font-bold text-amber-950 w-4 block text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, true)}
                                  className="text-[10px] font-bold text-amber-900 w-4 block text-center"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold font-serif text-amber-950">
                                  ¢{(item.customPrice * item.quantity).toLocaleString("es-CR")}
                                </span>
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-red-600 hover:text-red-700 p-1 rounded-sm hover:bg-red-50"
                                  title="Quitar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer of Drawer featuring Calculated Price & order on whatsapp */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-amber-100 bg-[#F2EDE4] space-y-4">
                    
                    {/* Sum of components */}
                    <div className="space-y-1.5 text-xs text-amber-950">
                      <div className="flex justify-between">
                        <span className="text-amber-900/70">Subtotal de pasteles</span>
                        <span className="font-semibold">¢{cartTotal.toLocaleString("es-CR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-900/70">Cinta de lazo & envoltura</span>
                        <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px]">¡INCLUIDO DE REGALO!</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-800 font-semibold">
                          <span>Descuento Club d'Or ({appliedDiscount}%)</span>
                          <span>-¢{Math.round(cartTotal * (appliedDiscount / 100)).toLocaleString("es-CR")}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-dashed border-amber-300 pt-2 text-sm font-bold text-amber-950">
                        <span>Total de Cotización</span>
                        <span className="text-base font-serif font-black">
                          ¢{Math.max(0, cartTotal - Math.round(cartTotal * (appliedDiscount / 100))).toLocaleString("es-CR")}
                        </span>
                      </div>
                    </div>

                    {/* Interactive inline Coupon Code field */}
                    <div className="bg-white/40 p-3.5 rounded-2xl border border-amber-200/60 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-amber-900 block">
                        ¿Tienes un cupón de regalo o Club d'Or?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Ej: CINTAS10"
                          className="bg-white/90 border border-amber-200 text-xs px-3 py-1.5 rounded-lg flex-grow uppercase font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-amber-900/30 text-amber-950"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const code = discountCode.trim().toUpperCase();
                            if (code === "CINTAS10" || code === "DOR10") {
                              setAppliedDiscount(10);
                              showToast("¡Código de 10% de descuento aplicado con éxito! 🎉");
                            } else if (code === "MINIATURES15" || code === "GOURMET15" || code === "CINTAS15") {
                              setAppliedDiscount(15);
                              showToast("¡Código Imperial de 15% de descuento aplicado! 🌟");
                            } else if (code === "") {
                              showToast("Por favor ingresa un código.");
                            } else {
                              showToast("Código de descuento no válido 🎟️");
                            }
                          }}
                          className="bg-amber-950 hover:bg-amber-900 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="text-[9px] text-emerald-800 font-bold flex items-center gap-1 pt-1 border-t border-amber-100/50">
                          ✓ Cupón activo: ¡{appliedDiscount}% de descuento aplicado!
                          <button 
                            type="button" 
                            onClick={() => {
                              setAppliedDiscount(0);
                              setDiscountCode("");
                              showToast("Descuento removido");
                            }}
                            className="text-red-500 underline ml-auto cursor-pointer focus:outline-none"
                          >
                            Quitar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-white/95 p-3 rounded-2xl border border-amber-200/50 text-[10px] text-amber-900/70">
                      ℹ️ <strong>¿Qué sucede al confirmar?</strong> Se armará automáticamente un mensaje con cada personalización (capas, dedicatorias y tamaño) y abrirá tu WhatsApp para coordinar el pago por transferencia, la hora y lugar de entrega directa.
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        onClick={handleCheckoutViaWhatsApp}
                        className="w-full bg-amber-950 hover:bg-amber-900 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                      >
                        <MessageCircle className="w-4.5 h-4.5 fill-white stroke-none" />
                        Enviar Pedido a WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setCart([])}
                        className="text-[10px] text-amber-900/50 hover:text-amber-900 text-center font-bold mt-2"
                      >
                        Limpiar todos los elementos
                      </button>
                    </div>

                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FIXED FLOATING WHATSAPP BUTTON AS ASKED */}
      <a
        href={WHATSAPP_LINK_SUPPORT}
        target="_blank"
        rel="noreferrer"
        id="whatsapp-floating-support-btn"
        className="fixed bottom-6 left-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-[0_8px_32px_rgba(16,185,129,0.3)] hover:scale-110 hover:-translate-y-1 transition-all z-40 flex items-center justify-center border-2 border-white/80 group"
        title="Contáctanos de inmediato por WhatsApp"
      >
        <span className="absolute left-14 bg-amber-950 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md border border-amber-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿En qué puedo ayudarte?
        </span>
        <MessageCircle className="w-6 h-6 fill-white stroke-none" />
        
        {/* Animated badge pulse on whatsapp floating */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </a>

      {/* SCROLL BACK TO TOP (PIERRE HERMÉ STYLE) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-[#35251F] hover:bg-amber-950 text-white p-3.5 rounded-lg shadow-xl hover:scale-105 transition-all z-40 border border-white/10 flex items-center justify-center cursor-pointer"
            title="Volver Arriba"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* GLOBAL TOAST SYSTEM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 30, x: "-50%" }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#35251F] border border-amber-300/40 text-[#FAF6F0] px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 font-serif text-xs tracking-wider"
          >
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH OVERLAY DIALOG */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:p-6 lg:p-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="bg-[#FAF6F0] rounded-3xl w-full max-w-3xl overflow-hidden border border-amber-900/10 shadow-2xl relative block text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute top-5 right-5 text-amber-900 hover:text-amber-950 p-1.5 bg-amber-100/50 hover:bg-amber-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#35251F] font-bold block mb-1">Buscador</span>
                  <h3 className="font-serif text-2xl font-light text-[#35251F]">Navegación & Catálogo Gourmet</h3>
                </div>

                {/* Input with autocomplete design */}
                <div className="relative">
                  <Search className="w-5 h-5 text-amber-700/60 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Escribe para buscar... (ej: Pistacho, Ópera, Macaron, Chocolate)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-2xl pl-12 pr-6 py-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-amber-900/30 text-amber-950 font-mono tracking-wider shadow-inner"
                  />
                </div>

                {/* Elegant Popular Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-900/70 mr-1">Sugeridos:</span>
                  {["Pistacho", "Fresa", "Espresso", "Chocolate", "Luxe", "Tarta", "Ópera"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 rounded-full text-[10px] uppercase font-bold font-mono tracking-wider bg-amber-100/80 hover:bg-amber-100 text-amber-950 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-red-100 text-red-900 hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Displaying Live Search results */}
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {searchQuery ? (
                    (() => {
                      const matches = PRODUCTS.filter(p =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      if (matches.length === 0) {
                        return (
                          <div className="text-center py-12 text-amber-900/60 font-serif">
                            No logramos ubicar creaciones gourmet con "{searchQuery}".
                            <p className="text-xs font-mono mt-1">Sugerencia: Revisa la ortografía o intenta buscar té, fresa o cacao.</p>
                          </div>
                        );
                      }
                      return matches.map((product) => (
                        <div
                          key={product.id}
                          className="bg-white p-4 rounded-2xl border border-amber-100 hover:border-amber-500/30 flex items-center justify-between gap-4 transition-all hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                                />
                              ) : (
                                <span className="text-xl">🍰</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-serif text-sm font-bold text-[#35251F] italic">{product.name}</h4>
                              <p className="text-[10px] text-amber-900/80 mt-0.5 line-clamp-1">{product.description}</p>
                              <span className="text-[10px] uppercase font-bold bg-amber-100 px-2 py-0.5 rounded text-amber-950 font-mono mt-1 inline-block">
                                {product.category === "box" ? "Cakes in the Box" : product.category === "gourmet" ? "Gourmet Dulce" : product.category === "cumple" ? "Cumpleaños" : "Boda & Eventos"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0 flex flex-col gap-1.5 items-end">
                            <span className="text-xs font-bold font-serif text-amber-950">¢{product.price.toLocaleString("es-CR")}</span>
                            <div className="flex gap-2">
                              {/* Jumps to Menu Anchor */}
                              <button
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                  setActiveCategory("all");
                                  setTimeout(() => {
                                    document.getElementById("menus")?.scrollIntoView({ behavior: "smooth" });
                                  }, 300);
                                }}
                                className="px-3 py-1 rounded-full text-[9px] uppercase font-bold border border-amber-950 text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                Ver Detalle
                              </button>
                              
                              {/* Auto Add with Default Ribbon / Size */}
                              <button
                                onClick={() => {
                                  handleAddToCart({
                                    product,
                                    quantity: 1,
                                    selectedSize: product.sizes[0].label,
                                    selectedServings: product.sizes[0].servings,
                                    selectedRibbon: product.ribbonOptions ? product.ribbonOptions[0] : "Lazo de Seda de la casa",
                                    customText: "",
                                    customPrice: product.price
                                  });
                                  showToast(`¡${product.name} añadido a tu bolsa! 🛍️`);
                                }}
                                className="px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-amber-950 hover:bg-amber-900 text-[#FAF6F0] transition-colors cursor-pointer"
                              >
                                Añadir
                              </button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-widest text-amber-900/65 font-bold block mb-1">Nuestras Recomendadas Populares</span>
                      {PRODUCTS.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          className="bg-white/60 p-3.5 rounded-2xl border border-amber-100 flex items-center justify-between gap-4 cursor-pointer hover:bg-white transition-colors"
                          onClick={() => setSearchQuery(product.name)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0 flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg">🍰</span>
                              )}
                            </div>
                            <div>
                              <h5 className="font-serif text-xs font-bold text-amber-950 italic">{product.name}</h5>
                              <p className="text-[9px] text-[#35251F]/70 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold font-serif text-amber-950">¢{product.price.toLocaleString("es-CR")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUPPORT & FAQ DIALOG */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF6F0] rounded-3xl w-full max-w-2xl overflow-hidden border border-amber-900/10 shadow-2xl relative block text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-5 right-5 text-amber-900 hover:text-amber-950 p-1.5 bg-amber-100/50 hover:bg-amber-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-[10px] font-black uppercase tracking-wider mb-2 font-mono">
                    <Check className="w-3 h-3 text-amber-700" /> Soporte Oficial Boutique
                  </div>
                  <h3 className="font-serif text-2xl font-light text-[#35251F]">Centro de Consultas & Guía de Compra</h3>
                  <p className="text-[11px] text-amber-900/70 font-sans mt-1">Respuestas directas para asegurar una experiencia de pastelería inolvidable.</p>
                </div>

                {/* Interactive Inner Tab Selector */}
                <div className="flex border-b border-amber-200">
                  {[
                    { id: "concept", label: "El Algoritmo de Lazo" },
                    { id: "delivery", label: "Logística & Boutique" },
                    { id: "ingredients", label: "Cuidado / Alérgenos" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFaqTab(tab.id)}
                      className={`flex-grow text-center py-2.5 text-[10px] uppercase tracking-wider font-bold transition-all relative cursor-pointer ${
                        activeFaqTab === tab.id ? "text-amber-950" : "text-amber-900/40 hover:text-amber-950"
                      }`}
                    >
                      {tab.label}
                      {activeFaqTab === tab.id && (
                        <motion.div layoutId="faqActiveTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-950" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content rendered with premium micro spacing */}
                <div className="bg-white p-5 rounded-2xl border border-amber-100 space-y-4">
                  {activeFaqTab === "concept" && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#35251F] font-serif">🎀 ¿Qué representan las cintas en la pastelería?</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                          Nuestra casa de alta pastelería rinde homenaje a un antiguo ritual parisino de envoltura de obsequios d'Or. Cada miniatura e imperial es atada a mano utilizando cintas de raso y seda francesa importada. Al desatar la cinta, el ritual de sabor y sabor explota de inmediato.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#35251F] font-serif">🎂 ¿Cómo personalizo el diseño en vivo?</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                          Sube al <span className="font-bold text-amber-905 text-xs">Diseñador Digital de Pasteles 3D (Sección Diseñador)</span>. Puedes elegir el bizcocho base de vainilla, naranja o cacao, el relleno de dulce de leche o trufa, y seleccionar de inmediato el color y textura de tu cinta.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeFaqTab === "delivery" && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#35251F] font-serif">📍 ¿Ofrecen retiro presencial y despachos a domicilio?</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                          Sí. Ofrecemos retiro premium en nuestra Boutique física o despachos a domicilio programados. Para mantener la integridad estructural, cada pastel se transporta en vehículos refrigerados equipados con soportes de suspensión hidráulica.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#35251F] font-serif">📅 ¿Con cuánto tiempo debo cotizar o agendar?</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                          Recomendamos realizar cotizaciones a través de WhatsApp con un mínimo de <strong>24 a 48 horas</strong> de anticipación. Para grandes eventos o bodas premium, sugerimos coordinar de 1 a 2 semanas de antemano.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeFaqTab === "ingredients" && (
                    <div className="space-y-4 text-xs font-sans">
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#35251F] font-serif">🥛 ¿Cómo deben conservarse los pasteles de Cintas con Sabor?</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                          Debido al uso exclusivo de mantequilla artesanal y crema natural belga sin conservantes químicos artificiales, sugerimos refrigerar inmediatamente la tarta y retirarla de 15 a 20 minutos antes de consumir para disfrutar de toda su textura sedosa.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#35251F] font-serif">🌾 ¿Tienen opciones libres de gluten o veganas?</h4>
                        <p className="text-amber-900/80 leading-relaxed">
                          Nuestra cocina opera con estrictas regulaciones y puede cotizar pasteles especiales con harina de almendras y sustitutos orgánicos. Consúltale directamente en la sección del <span className="font-bold text-amber-950 font-serif">Chef AI Asistente</span> para recibir sugerencias a tu medida.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-center text-xs font-bold uppercase tracking-wider">
                  <a
                    href={WHATSAPP_LINK_SUPPORT}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-grow py-3 rounded-full bg-[#1b1c1e] hover:bg-[#282a2e] text-amber-300 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-amber-300 stroke-none" /> Chat WhatsApp Directo
                  </a>
                  <button
                    onClick={() => {
                      setIsHelpOpen(false);
                      setTimeout(() => {
                        document.getElementById("asistente")?.scrollIntoView({ behavior: "smooth" });
                      }, 200);
                    }}
                    className="py-3 px-5 rounded-full bg-amber-500/90 hover:bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Preguntar a Chef AI
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MI CUENTA LOYALTY CLUB DIALOG */}
      <AnimatePresence>
        {isAccountOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF6F0] rounded-3xl w-full max-w-md overflow-hidden border border-amber-900/10 shadow-2xl relative block text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAccountOpen(false)}
                className="absolute top-5 right-5 text-amber-900 hover:text-amber-950 p-1.5 bg-amber-100/50 hover:bg-amber-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#35251F] font-bold block mb-1">Membresía d'Or</span>
                  <h3 className="font-serif text-2xl font-light text-[#35251F]">Cintas con Sabor Club</h3>
                </div>

                {/* Magnificent loyalty gold card layout */}
                <div className="bg-gradient-to-br from-[#4e3c32] via-[#2f1f1a] to-[#1d110d] rounded-2xl p-5 border border-amber-300/30 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/10 rounded-full filter blur-2xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300/75 block">CONNOTADO SOCIO ELITE</span>
                      {isUserEditing ? (
                        <div className="mt-1 flex flex-col gap-1.5">
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-white/10 border border-amber-300/35 rounded px-2 py-1 text-xs font-serif font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="bg-white/10 border border-amber-300/35 rounded px-2 py-0.5 text-[10px] font-mono text-white/80 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      ) : (
                        <h4 className="font-serif text-lg font-bold text-amber-200 mt-1">{userName}</h4>
                      )}
                      
                      {!isUserEditing && (
                        <p className="text-[10px] text-white/60 font-mono italic">{userEmail}</p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-200/10 border border-amber-300/35 text-amber-300 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-end">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-white/50 block">PUNTOS ACUMULADOS</span>
                      <span className="text-xl font-bold font-mono text-amber-300">1.450 PTS</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-widest text-white/50 block">CATEGORÍA DE CLUB</span>
                      <span className="text-xs font-bold uppercase tracking-widest bg-amber-200/20 px-2 py-1 rounded text-amber-300 border border-amber-300/20 inline-block mt-0.5">
                        Membresía d'Or
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Edit Toggle Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (isUserEditing) {
                        showToast("¡Perfil gourmet actualizado correctamente! ✨");
                      }
                      setIsUserEditing(!isUserEditing);
                    }}
                    className="text-xs text-amber-900 border-b border-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer focus:outline-none"
                  >
                    {isUserEditing ? "✓ Guardar Cambios" : "✎ Modificar Perfil"}
                  </button>
                </div>

                {/* Elite Reward coupon generator logic */}
                <div className="bg-white p-4 rounded-xl border border-amber-100 space-y-2">
                  <div className="flex gap-2 items-center text-xs font-bold text-amber-950">
                    <span className="text-amber-750">🎁</span>
                    <span>¿Socio registrado? Código del mes activo:</span>
                  </div>
                  <p className="text-[10px] text-amber-900/60 leading-relaxed">
                    Para celebrar el nuevo diseño premium de nuestra pastelería, usa tu código de cupón de obsequio de bienvenida.
                  </p>
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-amber-950 tracking-widest">CINTAS10</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountCode("CINTAS10");
                        setAppliedDiscount(10);
                        showToast("¡Cupón CINTAS10 copiado y cargado de inmediato! 🎉");
                      }}
                      className="text-[9px] uppercase font-bold tracking-wider bg-amber-950 hover:bg-amber-900 text-white px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                    >
                      Copiar y Cargar
                    </button>
                  </div>
                </div>

                {/* Past Orders list mockup for incredible completion feeling */}
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase tracking-widest text-amber-900/65 font-bold block">Historial de Compras Recientes</span>
                  <div className="space-y-1.5">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100 text-[10px] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-amber-950 font-serif">1x Cake in the Box - Pistacho & Frambuesa</span>
                        <p className="text-[8px] text-amber-900/50">21 de Junio, 2026 • Retiro Presencial</p>
                      </div>
                      <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">Entregado</span>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100 text-[10px] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-amber-950 font-serif">1x Tarta Imperial de Chocolate Suizo</span>
                        <p className="text-[8px] text-amber-900/50">14 de Mayo, 2026 • En Boutique</p>
                      </div>
                      <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">Entregado</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
