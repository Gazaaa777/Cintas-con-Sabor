import React, { useState } from "react";
import { Product, CartItem } from "../types";
import { Star, ShoppingBag, Check, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AntojoCardProps {
  product: Product;
  onAddToCart: (item: Omit<CartItem, "id">) => void;
  showToast: (msg: string) => void;
  key?: React.Key | any;
}

export default function AntojoCard({ product, onAddToCart, showToast }: AntojoCardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const defaultQuantity = product.cookieMinimum || 1;
  const [quantity, setQuantity] = useState(defaultQuantity);
  const [selectedRibbon, setSelectedRibbon] = useState(
    product.ribbonOptions && product.ribbonOptions.length > 0 
      ? product.ribbonOptions[0] 
      : "Ninguno"
  );
  const [customText, setCustomText] = useState("");
  const [imgError, setImgError] = useState(false);

  // Sync quantity with product.cookieMinimum when modal is opened or product changes
  React.useEffect(() => {
    setQuantity(product.cookieMinimum || 1);
  }, [product, isCustomizing]);

  const handleAdd = () => {
    onAddToCart({
      product,
      quantity,
      selectedSize: product.sizes[0].label,
      selectedServings: product.sizes[0].servings,
      selectedRibbon,
      customText: customText.trim() || (product.isCookie ? "(Sin especificaciones)" : "(Sin dedicatoria especial)"),
      customPrice: product.price
    });
    
    showToast(`¡Agregado ${product.name} al Carrito! 🍪`);
    setIsCustomizing(false);
    setQuantity(product.cookieMinimum || 1);
    setCustomText("");
  };

  const isBox = product.id.includes("caja") || product.id.includes("mini");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="antojos-card group bg-white rounded-3xl border border-amber-100/70 overflow-hidden flex flex-col h-full shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-56 bg-amber-50/40 overflow-hidden flex-shrink-0">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-amber-50 to-pink-50/30 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-4xl mb-2 select-none">
              {product.id.includes("galleta") ? "🍪" :
               product.id.includes("chocolate") ? "🍫" : 
               product.id.includes("mocha") ? "☕" :
               product.id.includes("coco") ? "🥥" :
               product.id.includes("zanahoria") ? "🥕" :
               product.id.includes("sachertorte") ? "🍰" :
               product.id.includes("chocolatine") ? "🥐" :
               product.id.includes("german") ? "🌰" :
               product.id.includes("red-velvet") ? "🍓" :
               product.id.includes("caja-5") ? "📦" :
               product.id.includes("caja-9") ? "🎁" :
               product.id.includes("mini-9") ? "✨" : "👑"}
            </span>
            <span className="text-[10px] tracking-wider uppercase font-bold text-amber-800/40 font-mono">
              Cintas con Sabor
            </span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-amber-950 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-amber-50 select-none">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {product.rating.toFixed(1)}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-sans font-semibold text-base text-amber-950 leading-snug">
            {product.name}
          </h3>
          <span className="antojos-size text-3xs uppercase tracking-wider text-amber-800/60 font-bold block mt-1 font-mono">
            📏 {product.sizes[0].label}
          </span>
        </div>

        <p className="text-xs text-amber-900/70 leading-relaxed mb-6 flex-grow">
          {product.description}
        </p>

        {/* Highlight features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-6 space-y-1.5 border-t border-amber-50 pt-4">
            {product.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-3xs text-amber-900/60 font-mono">
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price & Action Footer */}
        <div className="border-t border-amber-100/70 pt-4 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-amber-900/40 block font-mono">Precio</span>
            <span className="antojos-price text-base font-black text-amber-950 font-serif">
              ₡{(product.price).toLocaleString("de-DE")}
            </span>
          </div>

          <button
            onClick={() => setIsCustomizing(true)}
            className="bg-amber-950 hover:bg-amber-900 text-white text-3xs uppercase tracking-widest font-bold px-4 py-2.5 rounded-full shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
            Añadir
          </button>
        </div>
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {isCustomizing && (
          <div className="fixed inset-0 bg-amber-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative border border-amber-100"
            >
              <button
                onClick={() => setIsCustomizing(false)}
                className="absolute top-4 right-4 text-amber-950 hover:bg-amber-50 p-1.5 rounded-full transition-colors text-sm"
              >
                ✕
              </button>

              <h3 className="font-serif text-xl text-amber-950 mb-1">{product.name}</h3>
              <span className="text-3xs uppercase tracking-wider text-amber-800/60 font-bold block mb-4 font-mono">
                {product.sizes[0].label}
              </span>

              {/* Quantity */}
              <div className="mb-5 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                <span className="block text-3xs font-bold uppercase text-amber-900/50 mb-2 tracking-wider font-mono">
                  {product.isCookie 
                    ? `1. Cantidad de galletas (Mínimo: ${product.cookieMinimum})` 
                    : "1. Cantidad de cajas / porciones"}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(prev => Math.max(product.cookieMinimum || 1, prev - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-950 font-bold hover:bg-amber-100 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-serif text-lg font-bold text-amber-950 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-950 font-bold hover:bg-amber-100 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Ribbon */}
              {product.ribbonOptions && product.ribbonOptions.length > 0 && (
                <div className="mb-5">
                  <span className="block text-3xs font-bold uppercase text-amber-900/50 mb-2 tracking-wider font-mono">
                    2. Cinta de Empaque Premium
                  </span>
                  <div className="space-y-1.5">
                    {product.ribbonOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedRibbon(opt)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedRibbon === opt
                            ? "border-amber-600 bg-amber-50/30 text-amber-950 font-semibold"
                            : "border-amber-100 hover:border-amber-200 text-amber-900/70"
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedRibbon === opt && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes or flavors selection */}
              <div className="mb-6">
                <span className="block text-3xs font-bold uppercase text-amber-900/50 mb-1.5 tracking-wider font-mono">
                  {product.isCookie 
                    ? "3. Especificaciones adicionales (Opcional)"
                    : isBox ? "3. Sabores de preferencia (Opcional)" : "3. Dedicatoria de Regalo (Opcional)"}
                </span>
                <p className="text-[10px] text-amber-900/40 mb-2">
                  {product.isCookie
                    ? "Agregá cualquier detalle o solicitud especial para tus galletas."
                    : isBox 
                      ? "Indicá tus sabores preferidos para surtir la caja. Dejalo en blanco para un surtido gourmet de la casa."
                      : "Escribiremos este mensaje en una delicada tarjeta manuscrita para acompañar tu postre."}
                </p>
                <textarea
                  rows={2}
                  maxLength={120}
                  placeholder={product.isCookie
                    ? "Ej: Empacar por separado, sin azúcar espolvoreada, etc."
                    : isBox 
                      ? "Ej: 2 Red Velvet, 2 Chocolate Belga, 1 Coco"
                      : "Ej: ¡Feliz Cumpleaños Mamá!"}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-amber-100 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-amber-50/10 placeholder-amber-900/30 text-amber-950"
                />
              </div>

              {/* Confirm button */}
              <button
                onClick={handleAdd}
                className="w-full bg-amber-950 hover:bg-amber-900 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                Confirmar y Agregar • ₡{(product.price * quantity).toLocaleString("de-DE")}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
