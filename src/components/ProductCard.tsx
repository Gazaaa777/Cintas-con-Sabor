import React, { useState } from "react";
import { Product, CartItem } from "../types";
import { Star, ShieldAlert, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  defaultSizeLabel?: string;
  key?: React.Key | any;
}

export default function ProductCard({ product, onAddToCart, defaultSizeLabel }: ProductCardProps) {
  const availableSizes = product.category === "cumple"
    ? product.sizes.filter((sz) => {
        if (product.id === "cumple-german") {
          return sz.label.includes("10 cm") || sz.label.includes("Mini");
        }
        if (product.id === "cumple-zanahoria") {
          return !(sz.label.includes("15 cm") || sz.label.includes("Individual"));
        }
        if (product.id === "cumple-banano") {
          return sz.label.includes("21 cm") || sz.label.includes("Entero");
        }
        return true;
      })
    : product.sizes;

  const initialIndex = defaultSizeLabel 
    ? Math.max(0, availableSizes.findIndex(s => s.label.toLowerCase().includes(defaultSizeLabel.toLowerCase())))
    : 0;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(initialIndex);

  React.useEffect(() => {
    if (defaultSizeLabel) {
      const idx = availableSizes.findIndex(s => s.label.toLowerCase().includes(defaultSizeLabel.toLowerCase()));
      if (idx !== -1) {
        setSelectedSizeIndex(idx);
      }
    }
  }, [defaultSizeLabel]);

  const [selectedRibbon, setSelectedRibbon] = useState(
    product.ribbonOptions && product.ribbonOptions.length > 0
      ? product.ribbonOptions[0]
      : "Ninguna"
  );
  const [customText, setCustomText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentSizeObj = availableSizes[selectedSizeIndex] || availableSizes[0];
  const unitPrice = product.price + currentSizeObj.priceAdder;
  const totalPrice = unitPrice * quantity;

  const getProductImage = () => {
    if (product.isSpecial) return product.image;
    if (product.category === "box" && currentSizeObj.label.includes("Mini")) {
      if (product.id === "box-vainilla") return "/src/assets/images/queques/mini/vainilla/vainilla1peq.png";
      if (product.id === "box-german") return "/src/assets/images/queques/mini/german/german1peq.png";
      if (product.id === "box-coco") return "/src/assets/images/queques/mini/coco/coco1peq.png";
      if (product.id === "box-red-velvet") return "/src/assets/images/queques/mini/red_velvet/red1peq.png";
      if (product.id === "box-chocolate") return "/src/assets/images/queques/mini/chocolate/choc1peq.png";
      if (product.id === "box-zanahoria") return "/src/assets/images/queques/mini/zanahoria/zana%201%20peq.png";
    }
    if (product.category === "cumple" && currentSizeObj.label.includes("Mini")) {
      if (product.id === "cumple-vainilla") return "/src/assets/images/queques/cumple/mini/vainilla/vainilla%20cumple%208cm.png";
      if (product.id === "cumple-german") return "/src/assets/images/queques/cumple/mini/german/German%20cumple%208cm.png";
      if (product.id === "cumple-velvet") return "/src/assets/images/queques/cumple/mini/red_velvet/RV%20cumple%208cm.png";
      if (product.id === "cumple-belga") return "/src/assets/images/queques/cumple/mini/belga/Belga%208cm%20cumple.png";
    }
    if (product.category === "cumple" && (currentSizeObj.label.includes("15 cm") || currentSizeObj.label.includes("Individual"))) {
      if (product.id === "cumple-vainilla") return "/src/assets/images/queques/cumple/mediano/vainilla/vainilla%2015cm.png";
      if (product.id === "cumple-velvet") return "/src/assets/images/queques/cumple/mediano/red_velvet/RV%2015cm.png";
      if (product.id === "cumple-belga") return "/src/assets/images/queques/cumple/mediano/belga/Belga%2015cm.png";
      if (product.id === "cumple-mocha") return "/src/assets/images/queques/cumple/mediano/mocha/Mocha%2015cm.png";
      if (product.id === "cumple-coco") return "/src/assets/images/queques/cumple/mediano/coco/coco%2015cm.png";
      if (product.id === "cumple-sachertorte") return "/src/assets/images/queques/cumple/mediano/sacher/Saacher%2015cm.png";
    }
    if (product.category === "cumple" && (currentSizeObj.label.includes("21 cm") || currentSizeObj.label.includes("Entero"))) {
      if (product.id === "cumple-vainilla") return "/src/assets/images/queques/cumple/grande/vainilla/vainilla%20grnade.png";
      if (product.id === "cumple-velvet") return "/src/assets/images/queques/cumple/grande/red_velvet/RV%20grande.png";
      if (product.id === "cumple-belga") return "/src/assets/images/queques/cumple/grande/belga/Belga%20groand.png";
      if (product.id === "cumple-mocha") return "/src/assets/images/queques/cumple/grande/mocha/Mocha%20grande.png";
      if (product.id === "cumple-coco") return "/src/assets/images/queques/cumple/grande/coco/coco%20graande.png";
      if (product.id === "cumple-sachertorte") return "/src/assets/images/queques/cumple/grande/sacher/sacher%20grande.png";
      if (product.id === "cumple-banano") return "/src/assets/images/queques/cumple/grande/banano/banana%20grande.png";
      if (product.id === "cumple-zanahoria") return "/src/assets/images/queques/cumple/grande/zanahoria/zana%20grande.png";
    }
    return product.image;
  };

  const handleAdd = () => {
    // Call the parent function
    onAddToCart({
      product,
      quantity,
      selectedSize: currentSizeObj.label,
      selectedServings: currentSizeObj.servings,
      selectedRibbon,
      customText,
      customPrice: unitPrice
    });
    
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
    setIsCustomizing(false);
    // Reset temporary states
    setQuantity(1);
    setCustomText("");
  };

  return (
    <div id={`product-${product.id}`} className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full group">
      {/* Image container */}
      <div className="relative overflow-hidden aspect-square rounded-t-3xl bg-amber-50/30">
        {(product.noImage || imgError || !getProductImage()) ? (
          <div className="w-full h-full bg-gradient-to-br from-amber-50/60 to-rose-50/40 p-6 flex flex-col justify-between border-b border-amber-100/55 relative">
            {/* Background design accents */}
            <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            
            <div className="flex justify-between items-start z-10 relative">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#5C3A21] bg-amber-200/50 font-mono px-2 py-1 rounded">
                Receta de la Casa
              </span>
              <div className="text-[#35251F]/15">
                <svg className="w-12 h-12 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </div>

            <div className="z-10 relative space-y-2">
              <span className="text-4xl filter saturate-[0.8] opacity-90 block">
                {product.id.includes("mocha") ? "☕" : product.id.includes("coco") ? "🥥" : product.id.includes("zanahoria") ? "🥕" : product.id.includes("fresa") ? "🍓" : product.id.includes("german") ? "🍫" : product.id.includes("flan") ? "🍮" : product.id.includes("sandwich") ? "🥜" : product.id.includes("limon") ? "🍋" : product.id.includes("naranja") ? "🍊" : product.id.includes("chocolate") ? "🍩" : product.id.includes("cafe") ? "☕" : product.id.includes("pudin") ? "🥧" : product.id.includes("pecana") ? "🌰" : "🍰"}
              </span>
              <div>
                <h4 className="font-serif text-lg font-black text-amber-950 uppercase tracking-tight leading-tight">
                  {product.name.replace("Sabor Tropical ", "").replace("Cake de Cumpleaños ", "").replace("Tarta de ", "").replace(" de Cumpleaños", "")}
                </h4>
                <p className="text-[10px] text-amber-900/50 uppercase tracking-wider font-bold block mt-1 font-mono">
                  Solo por Encargo • {product.isSpecial ? "Especial" : "Sin Imagen"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={getProductImage()}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        )}
        
        {/* Animated Custom "NUEVO" Badge */}
        {product.isNew && (
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, -3, 3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-amber-500 text-amber-950 text-xs tracking-wider uppercase font-black px-4 py-1.5 rounded-full shadow-lg border border-white flex items-center gap-1 font-sans"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-900 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-950"></span>
              </span>
              NUEVO
            </motion.div>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-amber-50">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {product.rating.toFixed(1)}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-amber-950/80 backdrop-blur-sm text-yellow-100 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full">
          {product.category === "box" 
            ? "🎁 Cake in the Box" 
            : product.category === "gourmet" 
            ? "✨ Alta Pastelería" 
            : product.category === "cumple"
            ? "🎂 Cumpleaños"
            : product.category === "catering"
            ? "🥪 Catering & Menú"
            : "👑 Edición Nupcial"}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-sans font-semibold text-lg text-amber-950 leading-tight mb-2 min-h-[2.5rem] flex items-start">
          {product.name}
        </h3>

        {product.category === "box" && (
          <div className="flex gap-1.5 mb-3 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#5C3A21]/10 text-[#5C3A21] px-2 py-0.5 rounded-md font-mono">
              🧁 Mini 8 oz
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-900 px-2 py-0.5 rounded-md font-mono">
              🎁 Grande 32 oz
            </span>
          </div>
        )}
        
        <p className="text-sm text-amber-900/70 mb-4 line-clamp-3 leading-relaxed flex-grow">
          {product.description}
        </p>

        {product.category === "catering" && (
          <div className="mb-4 bg-amber-50/60 rounded-2xl p-3.5 border border-amber-100/50 space-y-2 text-2xs text-amber-950">
            {product.presentation && (
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-amber-800/80 font-mono">Presentación:</span>
                <span className="font-medium text-right text-amber-950">{product.presentation}</span>
              </div>
            )}
            {product.minimumOrder && (
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-amber-800/80 font-mono">Mínimo:</span>
                <span className="font-extrabold text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded-md">{product.minimumOrder}</span>
              </div>
            )}
            {product.pageNumber && (
              <div className="flex items-center justify-between text-[10px] text-amber-800/70 pt-1.5 border-t border-amber-100/40 font-medium">
                <span>Catálogo General</span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-100/60 font-semibold">Pág. {product.pageNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Highlight features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4 space-y-1.5 border-t border-amber-50 pt-3">
            {product.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-amber-900/80">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price & Action Section */}
        <div className="border-t border-amber-100 pt-4 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-amber-900/50 block font-mono">
              {product.category === "box" 
                ? (currentSizeObj?.label.includes("Grande") ? "Grande" : "Mini") 
                : (availableSizes && availableSizes.length > 1 ? "Desde" : "Precio")}
            </span>
            <span className="text-xl font-bold text-amber-950 font-serif">
              ¢{unitPrice.toLocaleString("es-CR")}
            </span>
          </div>

          <button
            onClick={() => setIsCustomizing(true)}
            id={`btn-customize-${product.id}`}
            className="bg-amber-950 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-md flex items-center gap-2 cursor-pointer transition-all hover:translate-x-1"
          >
            Personalizar
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customization slide-over overlay modal */}
      <AnimatePresence>
        {isCustomizing && (
          <div className="fixed inset-0 bg-amber-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative border border-amber-100"
            >
              {/* Close button */}
              <button
                onClick={() => setIsCustomizing(false)}
                className="absolute top-4 right-4 text-amber-950 hover:bg-amber-50 p-2 rounded-full transition-colors text-lg"
              >
                ✕
              </button>

              <h3 className="font-serif text-2xl text-amber-950 mb-2">{product.name}</h3>
              <p className="text-sm text-amber-900/60 mb-6">{product.description}</p>

              {/* 1. Size choice */}
              <div className="mb-6">
                <span className="block text-xs font-bold uppercase text-amber-900/50 mb-3 tracking-wider">
                  1. Seleccione el Tamaño
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSizes.map((sz, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedSizeIndex === idx
                          ? "border-amber-600 bg-amber-50/40 text-amber-950 shadow-sm"
                          : "border-amber-100 hover:border-amber-300 text-amber-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{sz.label}</span>
                        {selectedSizeIndex === idx && <Check className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="flex items-center justify-between text-xs text-amber-900/60">
                        <span>{sz.servings}</span>
                        <span className="font-semibold text-amber-900">
                          {sz.priceAdder > 0 ? `+¢${sz.priceAdder.toLocaleString("es-CR")}` : "Precio base"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Ribbon selection */}
              {product.ribbonOptions && product.ribbonOptions.length > 0 && (
                <div className="mb-6">
                  <span className="block text-xs font-bold uppercase text-amber-900/50 mb-3 tracking-wider">
                    2. Seleccione la Cinta / Lazo del Empaque
                  </span>
                  <div className="space-y-2">
                    {product.ribbonOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedRibbon(opt)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                          selectedRibbon === opt
                            ? "border-amber-600 bg-amber-50/30 text-amber-950 font-medium"
                            : "border-amber-100 hover:border-amber-200 text-amber-900/70"
                        }`}
                      >
                        <span className="text-sm">{opt}</span>
                        {selectedRibbon === opt && <div className="w-2 h-2 rounded-full bg-amber-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Personalized tag */}
              <div className="mb-6">
                <span className="block text-xs font-bold uppercase text-amber-900/50 mb-2 tracking-wider">
                  3. Dedicatoria Especial (Opcional)
                </span>
                <p className="text-[11px] text-amber-900/40 mb-2">
                  Escribiremos este mensaje a mano en una tarjeta atada a la cinta del pastel.
                </p>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Ej: 'Feliz Cumple Mamá!' o 'Con cariño, Sofía'"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-950 placeholder-amber-900/40 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quantity selector and Total Price */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-amber-100 pt-5 gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-amber-900/60">Cantidad:</span>
                  <div className="flex items-center bg-amber-50 rounded-full px-3 py-1.5 border border-amber-150">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(q => q - 1)}
                      className="w-8 text-center font-bold text-amber-900 hover:text-amber-600 cursor-pointer disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-amber-950 text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 text-center font-bold text-amber-900 hover:text-amber-600 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-amber-900/50 block font-mono">Total de Pedido</span>
                  <span className="text-2xl font-black text-amber-950 font-serif">
                    ¢{totalPrice.toLocaleString("es-CR")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className="px-6 py-3 rounded-full border border-amber-200 text-amber-900 hover:bg-amber-50 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-6 py-3 rounded-full bg-amber-950 hover:bg-amber-900 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Agregar al Carrito
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating success banner */}
      <AnimatePresence>
        {addedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-amber-950 text-white font-semibold text-sm px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-amber-800"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-amber-950 stroke-[3]" />
            </div>
            <span>¡Agregado al carrito de Cintas!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
