import { Product } from "./types";
import { CATERING_PRODUCTS } from "./cateringData";

const BASE_PRODUCTS: Product[] = [
  {
    id: "box-red-velvet",
    name: "Cake in the Box - Red Velvet",
    description: "El encanto incomparable de un tierno bizcocho aterciopelado con ligeras notas de cacao de primera calidad, humectado delicadamente y relleno en capas perfectas de nuestro insustituible frosting de queso crema premium.",
    price: 3500,
    category: "box",
    image: "/src/assets/images/red_velvet_box_closed_1782157927213.png",
    isNew: true,
    rating: 5.0,
    sizes: [
      { label: "Mini 8 oz", priceAdder: 0, servings: "1 persona" },
      { label: "Grande 32 oz", priceAdder: 11000, servings: "3-4 personas" }
    ],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Cinta Satinada Roja", "Lazo Blanco Sedoso"],
    features: ["Contenedor premium hermético", "Moño de seda premium atado a mano", "Tag de dedicatoria personalizado"]
  },
  {
    id: "box-vainilla",
    name: "Cake in the Box - Vainilla",
    description: "Húmedo y tierno bizcocho de vainilla gourmet, coronado con una cobertura sumamente suave con bellas chispas de colores pasteles y perlas del amor.",
    price: 3500,
    category: "box",
    image: "/src/assets/images/queques/vainilla/vainilla 1.png",
    isNew: true,
    rating: 4.8,
    sizes: [
      { label: "Mini 8 oz", priceAdder: 0, servings: "1 persona" },
      { label: "Grande 32 oz", priceAdder: 11000, servings: "3-4 personas" }
    ],
    ribbonOptions: ["Cinta Celeste Dulce", "Cinta Dorada de Raso Imperial", "Cinta Lila Pastel"],
    features: ["Contenedor premium hermético", "Lazo de raso atado a mano", "Chispitas y perlas de colores"]
  },
  {
    id: "box-german",
    name: "Cake in the Box - German Coco-Pecana",
    description: "Exponencial sabor de un bizcocho de chocolate de alta calidad con cobertura dulce tradicional, hilos de coco tostado y trozos de nueces pecanas seleccionadas.",
    price: 3500,
    category: "box",
    image: "/src/assets/images/queques/german/german 1.png",
    isNew: true,
    rating: 4.9,
    sizes: [
      { label: "Mini 8 oz", priceAdder: 0, servings: "1 persona" },
      { label: "Grande 32 oz", priceAdder: 11000, servings: "3-4 personas" }
    ],
    ribbonOptions: ["Cinta Café Mocha", "Cinta Dorada de Raso Imperial"],
    features: ["Nueces pecanas tostadas crujientes", "Hilos de coco tostado", "Moño de seda premium atado a mano"]
  },
  {
    id: "box-coco",
    name: "Cake in the Box - Coco",
    description: "Toque caribeño y delicado de finos copos de coco rallado sobre un tierno bizcocho sumamente esponjoso y humedecido en leche de coco real.",
    price: 3500,
    category: "box",
    image: "/src/assets/images/queques/coco/coco1.png",
    isNew: true,
    rating: 4.7,
    sizes: [
      { label: "Mini 8 oz", priceAdder: 0, servings: "1 persona" },
      { label: "Grande 32 oz", priceAdder: 11000, servings: "3-4 personas" }
    ],
    ribbonOptions: ["Cinta Blanca Nupcial", "Cinta Dorada de Raso Imperial"],
    features: ["Copos finos de coco real", "Suave humedecido de leche de coco", "Lazo atado a mano por nuestro pastelero"]
  },
  {
    id: "box-chocolate",
    name: "Cake in the Box - Chocolate",
    description: "Intenso y bizcocho húmedo de cacao de primera calidad, bañado con nuestro sedoso fudge de chocolate artesanal y chispas de chocolate belga.",
    price: 3500,
    category: "box",
    image: "/src/assets/images/queques/chocolate/choco1.png",
    isNew: true,
    rating: 4.9,
    sizes: [
      { label: "Mini 8 oz", priceAdder: 0, servings: "1 persona" },
      { label: "Grande 32 oz", priceAdder: 11000, servings: "3-4 personas" }
    ],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Cinta Satinada Roja", "Lazo Blanco Sedoso"],
    features: ["Contenedor premium hermético", "Bañado en fudge de chocolate artesanal", "Tag de dedicatoria personalizado"]
  },
  {
    id: "box-zanahoria",
    name: "Cake in the Box - Zanahoria",
    description: "Tierno y aromático queque de zanahoria con especias seleccionadas, nueces pecana de gran sabor y un exquisito frosting de queso crema premium.",
    price: 3500,
    category: "box",
    image: "/src/assets/images/queques/zanahoria/zana1.png",
    isNew: true,
    rating: 4.8,
    sizes: [
      { label: "Mini 8 oz", priceAdder: 0, servings: "1 persona" },
      { label: "Grande 32 oz", priceAdder: 11000, servings: "3-4 personas" }
    ],
    ribbonOptions: ["Cinta Naranja Dulce", "Cinta Dorada de Raso Imperial"],
    features: ["Nueces pecanas picadas crujientes", "Frosting ultrasuave de queso crema", "Hermoso lazo de raso hecho a mano"]
  },
  {
    id: "cumple-vainilla",
    name: "Cake de Cumpleaños Clásico de Vainilla",
    description: "Esponjoso bizcocho tradicional aromatizado con vainilla premium de Madagascar, relleno con nuestro exquisito dulce de leche repostero y decorado con un hermoso arcoíris de chispitas festivas y frosting sedoso.",
    price: 12500,
    category: "cumple",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Celeste Dulce", "Cinta Satinada de Raso Amarillo", "Cinta Fina de Seda Rosa Vintage", "Ninguna"],
    features: ["Chispas de colores festivos premium", "Perfecto para fotografías y soplar velas", "Humedecido en almíbar de vainilla natural"]
  },
  {
    id: "cumple-german",
    name: "Cake de Cumpleaños Suntuoso German",
    description: "Incomparable combinación de bizcocho húmedo de cacao con nuestro famoso relleno tradicional alemán de coco rallado tostado, pecanas tiernas y un toque acaramelado.",
    price: 12500,
    category: "cumple",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Cinta Satinada de Raso Rojo", "Ninguna"],
    features: ["Pecanas tostadas y coco rallado", "Doble capa de relleno alemán especial", "Perfecto para amantes del chocolate texturizado"]
  },
  {
    id: "cumple-velvet",
    name: "Tarta de Cumpleaños Red Velvet Luxury",
    description: "Incomparable bizcocho aterciopelado con ligeras notas de cacao puro, humectado delicadamente con almíbar de vainilla y coronado con capas de queso crema suntuoso de estilo artesanal y un fino decorado rojo.",
    price: 12500,
    category: "cumple",
    image: "https://images.unsplash.com/photo-1586985289688-ca9cf499194a?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Satinada de Raso Rojo", "Lazo Blanco Sedoso", "Ninguna"],
    features: ["Textura de terciopelo tradicional", "Crema de queso crema premium suave", "Lluvia fina de frambuesa liofilizada"]
  },
  {
    id: "cumple-belga",
    name: "Fantasía de Chocolate Belga & Fudge",
    description: "Intenso y esponjoso bizcocho húmedo elaborado con auténtico cacao belga al 70%, bañado en nuestro sedoso fudge de chocolate artesanal y decorado con virutas crujientes.",
    price: 12500,
    category: "cumple",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Cinta Satinada de Raso Rojo", "Ninguna"],
    features: ["Chocolate de cacao criollo al 70%", "Fudge artesanal de brillo espejo", "Textura ultra-húmeda de trufa"]
  },
  {
    id: "cumple-mocha",
    name: "Delicia de Café Mocha & Espresso",
    description: "Exquisita armonía entre un bizcocho impregnado de espresso de altura recién tostado de nuestra propia finca y una suave crema de cacao suizo con sutil toque de licor de café.",
    price: 12500,
    category: "cumple",
    image: "",
    noImage: true,
    rating: 4.7,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Satinada Café Imperial", "Cinta Dorada de Raso Imperial", "Ninguna"],
    features: ["Espresso premium de altura", "Crema de mocha fundida artesanalmente", "Decoración elegante y minimalista de café"]
  },
  {
    id: "cumple-coco",
    name: "Sabor Tropical Coco Imperial Cumpleaños",
    description: "Esponjosa masa infusionada con leche de coco natural, rellena de crema pastelera de coco artesanal y copos de coco recién tostados para un final crujiente sensacional.",
    price: 12500,
    category: "cumple",
    image: "",
    noImage: true,
    rating: 4.8,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Celeste Dulce", "Ninguna"],
    features: ["Coco tostado fresco rallado en casa", "Humedecido con elixir sutil de coco", "Exquisito relleno sedoso tropical"]
  },
  {
    id: "cumple-zanahoria",
    name: "Zanahoria & Nueces Caramelizadas Festivas",
    description: "Aromática y jugosa receta clásica de zanahoria con especias finas seleccionadas, nueces pecana picadas crujientes y nuestro inolvidable e insignia frosting de queso crema.",
    price: 12500,
    category: "cumple",
    image: "",
    noImage: true,
    rating: 4.9,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Naranja Dulce", "Cinta Dorada de Raso Imperial", "Ninguna"],
    features: ["Nueces pecanas seleccionadas crujientes", "Frosting sedoso de queso crema", "Aromas sutiles de canela y nuez moscada"]
  },
  {
    id: "cumple-sachertorte",
    name: "Sachertorte de Cumpleaños Estilo Vienés",
    description: "Doble capa de bizcocho denso de chocolate amargo de alta manufactura, unificado por un exquisito coulis de albaricoques artesanal y cubierto por un crocante baño brillante de chocolate oscuro.",
    price: 13500,
    category: "cumple",
    image: "",
    noImage: true,
    rating: 4.9,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Ninguna"],
    features: ["Tradición vienesa clásica", "Coulis premium de albaricoques", "Glaceado espejado de chocolate belga"]
  },
  {
    id: "cumple-banano",
    name: "Cake de Cumpleaños Delicia de Banano",
    description: "Esponjosa y húmeda masa artesanal elaborada con bananos maduros seleccionados, rellena de dulce de leche y cubierta con un frosting suave de queso crema y nueces tostadas.",
    price: 12500,
    category: "cumple",
    image: "",
    noImage: true,
    rating: 4.8,
    sizes: [
      { label: "Mini Cake (10 cm)", priceAdder: 0, servings: "4 porciones pequeñas" },
      { label: "Cake Individual (15 cm)", priceAdder: 6000, servings: "8 porciones pequeñas" },
      { label: "Cake Entero (21 cm)", priceAdder: 24000, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Cinta Celeste Dulce", "Ninguna"],
    features: ["Bananos 100% naturales maduros", "Frosting delicado de queso crema", "Topping de nueces pecana crujientes"]
  },
  {
    id: "cumple-fresa",
    name: "Cake de Cumpleaños Especial de Fresa",
    description: "Esponjosa masa de vainilla humedecida con almíbar artesanal de fresas silvestres, rellena de abundante jalea de fresas frescas natural hecha en casa y decorada con un frosting premium.",
    price: 40000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/fresa/fresa%20especial.png",
    rating: 4.9,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Cinta Celeste Dulce", "Ninguna"],
    features: ["Fresas 100% silvestres seleccionadas", "Relleno artesanal cocinado a mano", "Decoración premium fina"],
    isSpecial: true
  },
  {
    id: "cumple-german-mediano",
    name: "Cake de Cumpleaños Suntuoso German Especial (Mediano)",
    description: "Esponjoso y húmedo bizcocho de cacao con auténtico relleno tradicional alemán de coco rallado tostado, caramelo y nueces crujientes, adaptado en formato mediano.",
    price: 25000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/german_mediano/german%20cake%20especial.png",
    rating: 5.0,
    sizes: [
      { label: "Cake Individual (15 cm)", priceAdder: 0, servings: "8 porciones pequeñas" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Ninguna"],
    features: ["Pecanas tostadas y coco rallado", "Doble capa del suntuoso relleno tradicional", "Perfecto equilibrio de dulzura"],
    isSpecial: true
  },
  {
    id: "cumple-flan-caramelo",
    name: "Flan de Caramelo Cumpleaños Especial (Mediano)",
    description: "Un clásico y cremoso flan elaborado artesanalmente con el punto óptimo de dulce de leche y caramelo fundido a fuego lento, montado sobre una delicada y fina capa de bizcocho esponjoso.",
    price: 18000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/flan_caramelo/flan%20caramelo.png",
    rating: 4.9,
    sizes: [
      { label: "Cake Individual (15 cm)", priceAdder: 0, servings: "8 porciones pequeñas" }
    ],
    ribbonOptions: ["Cinta Celeste Dulce", "Ninguna"],
    features: ["Textura ultra cremosa artesanal", "Baño de caramelo brillante", "Base sutil de bizcocho tierno"],
    isSpecial: true
  },
  {
    id: "cumple-sandwich-mani",
    name: "Sándwich de Mantequilla de Maní Especial (Grande)",
    description: "Espectacular propuesta festiva con capas de bizcocho húmedo de vainilla y chocolate, alternadas con crema suave de mantequilla de maní artesanal y cubierto de un ganache de chocolate belga.",
    price: 36000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/sandwich_mani/sandwich%20mm.png",
    rating: 4.8,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Ninguna"],
    features: ["Mantequilla de maní 100% natural", "Fusión de chocolate belga y maní crujiente", "Diseño sofisticado vanguardista"],
    isSpecial: true
  },
  {
    id: "cumple-bundt-limon",
    name: "Bundt Cake Especial de Limón (Grande)",
    description: "Clásico pastel horneado en molde Bundt con ralladura fresca de limones seleccionados de nuestra huerta, bañado vigorosamente en almíbar cítrico y un cristalino glaseado real.",
    price: 28000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/bundt_limon/bundt%20limon.png",
    rating: 4.7,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Ninguna"],
    features: ["Zumo y ralladura de limones naturales", "Glaseado real impecable", "Textura aireada y súper húmeda"],
    isSpecial: true
  },
  {
    id: "cumple-bundt-naranja",
    name: "Bundt Cake Especial de Naranja & Chispas (Grande)",
    description: "Esponjosa y aromática masa Bundt elaborada con zumo puro de naranja premium, perfumada con notas cítricas y combinada con delicadas chispitas de chocolate oscuro al 60%.",
    price: 28000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/bundt_naranja/bundt%20naraanja.png",
    rating: 4.8,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Celeste Dulce", "Ninguna"],
    features: ["Jugo de naranja natural exprimido", "Chispas de cacao puro premium", "Perfecto contraste cítrico-chocolate"],
    isSpecial: true
  },
  {
    id: "cumple-bundt-chocolate",
    name: "Bundt Cake Especial de Chocolate & Nueces (Grande)",
    description: "Intenso y suntuoso pastel Bundt horneado con cacao belga de la más alta pureza, enriquecido con trozos crocantes de nueces seleccionadas y chispas de chocolate amargo gourmet.",
    price: 30000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/bundt_chocolate/bundt%20choc.png",
    rating: 4.9,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Ninguna"],
    features: ["Auténtico chocolate amargo belga", "Nueces pecana tostadas crujientes", "Glaseado caliente de chocolate fudge"],
    isSpecial: true
  },
  {
    id: "cumple-bundt-cafe",
    name: "Bundt Cake de Café Glaseado & Praliné (Grande)",
    description: "Sedoso pastel Bundt infusionado con espresso artesanal de altura de nuestra propia finca, bañado con un delicioso glaze tibio de caramelo salado y nueces praliné crujientes.",
    price: 35000,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/bundt_cafe/bundt%20cafe.png",
    rating: 5.0,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Ninguna"],
    features: ["Espresso premium de nuestra propia cosecha", "Salsa untuosa de caramelo salado", "Praliné crocante elaborado a mano"],
    isSpecial: true
  },
  {
    id: "cumple-tartaleta-pudin",
    name: "Tartaleta Especial con Pudín de Chocolate (Grande)",
    description: "Base de masa sablé crujiente y sumamente mantecosa, horneada a la perfección rústica y rellena con un indulgente y denso pudín artesanal de chocolate belga premium.",
    price: 38500,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/tartaleta_pudin/tartaleta%20pudimg.png",
    rating: 4.9,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Ninguna"],
    features: ["Masa sablé de pura mantequilla", "Relleno sedoso de chocolate importado", "Decoración minimalista de oro comestible"],
    isSpecial: true
  },
  {
    id: "cumple-tartaleta-pecanas",
    name: "Tartaleta Especial de Pecanas & Chocolate (Grande)",
    description: "Exquisito matrimonio de una masa sablé crocante con un relleno húmedo y meloso de pecanas premium tostadas caramelizadas con hilos decorativos de chocolate belga.",
    price: 38500,
    category: "cumple",
    image: "/src/assets/images/queques/cumple/especiales/tartaleta_pecana/tartaleta%20pecans.png",
    rating: 4.9,
    sizes: [
      { label: "Cake Entero (21 cm)", priceAdder: 0, servings: "16-20 porciones grandes" }
    ],
    ribbonOptions: ["Cinta Dorada Imperial", "Ninguna"],
    features: ["Abundantes pecanas tostadas premium", "Toffee de caramelo salado casero", "Detalles finos de cacao belga"],
    isSpecial: true
  },
  {
    id: "antojo-chocolate-belga",
    name: "Antojo de Chocolate Belga",
    description: "Suntuoso bizcocho de cacao premium con un baño sedoso de ganache trufado de puro chocolate belga al 70%. El placer supremo en porción personal.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/chocolate_belga/chocolate_belga_porcion_individual_8_cm.jpg",
    rating: 4.9,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Lazo Blanco Sedoso", "Ninguno"],
    features: ["Puro chocolate belga 70% cacao", "Ganache aterciopelado", "Perfecto para disfrutar de inmediato"]
  },
  {
    id: "antojo-mocha",
    name: "Antojo de Café Mocha",
    description: "Equilibrio perfecto de bizcocho esponjoso impregnado con almíbar de espresso artesanal de altura y capas de sedosa crema de cacao suizo.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/mocha/mocha_porcion_individual_8_cm.jpg",
    rating: 4.8,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Café Mocha", "Cinta Dorada de Raso Imperial", "Ninguno"],
    features: ["Infusión de espresso premium", "Crema untuosa de cacao", "Toque sutil de moka italiano"]
  },
  {
    id: "antojo-coco",
    name: "Antojo de Coco Imperial",
    description: "Nuestra tarta clásica adaptada en porción individual: bizcocho sumamente húmedo en leche de coco real y cubierto con crujientes copos tostados.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/coco/coco_porcion_individual_8_cm.jpg",
    rating: 4.7,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Celeste Dulce", "Cinta Dorada de Raso Imperial", "Ninguno"],
    features: ["Relleno cremoso de coco natural", "Copos de coco tostados a mano", "Humedecido en néctar de coco"]
  },
  {
    id: "antojo-zanahoria",
    name: "Antojo de Zanahoria & Nueces",
    description: "Bizcocho aromático y tierno, enriquecido con zanahoria rallada, nueces seleccionadas y una lujosa capa de frosting premium de queso crema.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/zanahoria/zanahoria_porcion_individual_8_cm.jpg",
    rating: 4.8,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Satinada de Raso Amarillo", "Cinta Lila Pastel", "Ninguno"],
    features: ["Frosting suave de queso crema", "Toques de canela y nuez moscada", "Nueces tostadas crujientes"]
  },
  {
    id: "antojo-sachertorte",
    name: "Antojo de Sachertorte Vienés",
    description: "Un clásico imperial europeo en formato personal: denso bizcocho de chocolate amargo, fina jalea de albaricoque y cobertura brillante de chocolate.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/sachertorte/sachertorte_porcion_individual_8_cm.jpg",
    rating: 4.9,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Lazo Negro Elegante", "Ninguno"],
    features: ["Receta tradicional vienesa", "Contraste cítrico de albaricoque", "Chocolate premium de alta pureza"]
  },
  {
    id: "antojo-chocolatine",
    name: "Antojo de Chocolatine Francés",
    description: "Espectacular masa hojaldrada hiper-crocante elaborada con pura mantequilla artesanal y un centro de exquisitas barras de chocolate belga amargo.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/chocolatine/chocolatine_porcion_individual_8_cm.jpg",
    rating: 4.8,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Satinada Roja", "Cinta Dorada de Raso Imperial", "Ninguno"],
    features: ["Hojaldre artesanal de mantequilla", "Centro fundido de chocolate belga", "Textura crujiente inigualable"]
  },
  {
    id: "antojo-german",
    name: "Antojo German Coco-Pecana",
    description: "Tierno pastel de chocolate de gran profundidad con la emblemática e irresistible cobertura tradicional de coco tostado, caramelo y nueces crujientes.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/german/german_porcion_individual_8_cm.jpg",
    rating: 4.9,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Café Mocha", "Cinta Dorada de Raso Imperial", "Ninguno"],
    features: ["Nueces pecanas seleccionadas", "Caramelo artesanal untuoso", "Hilos dorados de coco tostado"]
  },
  {
    id: "antojo-red-velvet",
    name: "Antojo Red Velvet Imperial",
    description: "Bocado aterciopelado con ligeras notas de cacao de primera calidad, relleno en capas impecables con nuestro inconfundible frosting de queso crema.",
    price: 3500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/red_velvet/red_velvet_porcion_individual_8_cm.jpg",
    rating: 4.9,
    sizes: [{ label: "Porción Individual (8 cm)", priceAdder: 0, servings: "1 persona" }],
    ribbonOptions: ["Cinta Satinada Roja", "Lazo Blanco Sedoso", "Ninguno"],
    features: ["Textura aterciopelada insuperable", "Frosting premium ultra cremoso", "Color rojo carmín vibrante"]
  },
  {
    id: "antojo-caja-5",
    name: "Caja de Antojos (5 Porciones)",
    description: "Elegante cofre de lujo con 5 porciones individuales de 8 cm. Podés elegir entre nuestros sabores premium: Red Velvet, German, Sachertorte, Coco, Vainilla, Chocolatine, Zanahoria, Mocha y Chocolate Belga.",
    price: 16000,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/caja_5/caja_con_5_porciones_de_8_cm.jpg",
    rating: 4.9,
    sizes: [{ label: "Caja Variada (5 porciones de 8 cm)", priceAdder: 0, servings: "5 personas" }],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Lazo Blanco Sedoso", "Ninguno"],
    features: ["Estuche gourmet de regalo", "Porciones generosas de 8 cm", "Surtido personalizado de sabores"]
  },
  {
    id: "antojo-caja-9",
    name: "Caja de Antojos (9 Porciones)",
    description: "La máxima suntuosidad para regalar o compartir. Caja variada con 9 generosas porciones individuales de 8 cm. Sabores elegidos: Red Velvet, German, Sachertorte, Coco, Vainilla, Chocolatine, Zanahoria, Mocha y Chocolate Belga.",
    price: 28800,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/caja_9/caja_con_9_porciones_de_8_cm.jpg",
    rating: 5.0,
    sizes: [{ label: "Caja Variada (9 porciones de 8 cm)", priceAdder: 0, servings: "9 personas" }],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Cinta Satinada Roja", "Ninguno"],
    features: ["Suntuoso cofre de presentación", "Perfecto para reuniones familiares o regalos corporativos", "Sabores completamente a tu elección"]
  },
  {
    id: "antojo-mini-9",
    name: "Caja Mini Gourmet (9 Unidades)",
    description: "Precioso estuche gourmet con 9 miniaturas de 6 cm. Sabores disponibles: Red Velvet, Coco, Mocha, Vainilla, Sachertorte, Chocolate Belga, Flan de Caramelo*, Chocolatine Francés, German y Zanahoria.",
    price: 16200,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/mini_9/caja_con_9_mini_gourmet_de_6_cm.jpg",
    rating: 4.9,
    sizes: [{ label: "Caja Mini Gourmet (9 unidades de 6 cm)", priceAdder: 0, servings: "9 personas (bocados)" }],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Lazo Blanco Sedoso", "Ninguno"],
    features: ["Bocados de 6 cm sumamente detallados", "Presentación de alta repostería", "*Especiales como Flan/Cheesecake de caramelo dependen de agenda (mín. 5 uds)"]
  },
  {
    id: "antojo-mini-16",
    name: "Caja Mini Gourmet (16 Unidades)",
    description: "Soberbio estuche con 16 miniaturas gourmet de 6 cm, perfecto para mesas de dulces o celebraciones selectas. Sabores disponibles: Red Velvet, Coco, Mocha, Vainilla, Sachertorte, Chocolate Belga, Flan de Caramelo*, Chocolatine Francés, German y Zanahoria.",
    price: 28800,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/mini_16/caja_con_16_mini_gourmet_de_6_cm.jpg",
    rating: 5.0,
    sizes: [{ label: "Caja Mini Gourmet (16 unidades de 6 cm)", priceAdder: 0, servings: "16 personas (bocados)" }],
    ribbonOptions: ["Cinta Dorada de Raso Imperial", "Cinta Satinada Roja", "Ninguno"],
    features: ["Ideal para mesas dulces o eventos", "16 piezas delicadas de 6 cm", "*Especiales como Flan/Cheesecake de caramelo dependen de agenda (mín. 5 uds)"]
  },
  {
    id: "galleta-pecanas",
    name: "Galletas de Pecanas",
    description: "Crujientes y doradas galletas horneadas artesanalmente, cargadas con pecanas seleccionadas y tostadas que aportan un sabor profundo a nuez.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/pecanas/01_galletas-de-pecanas.jpg",
    rating: 4.8,
    sizes: [{ label: "Horneada de 4 cm", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Pecanas tostadas prémium", "Mantequilla pura de pastura", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-veteadas",
    name: "Galletas Veteadas de Naranja con Chocolate y Pistachos",
    description: "Una sinfonía de texturas y sabores: delicada masa con notas frescas de ralladura de naranja, hilos veteados de chocolate belga y pistachos de Sicilia picados.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/veteadas/02_galletas-veteadas-de-naranja-con-chocolate-y-pistachos.jpg",
    rating: 4.9,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Pistachos sicilianos selectos", "Ralladura fresca de naranja real", "Pedido mínimo: 40 unidades"],
    isCookie: true,
    cookieMinimum: 40
  },
  {
    id: "galleta-chocolate-blanco",
    name: "Galletas de Chocolate con Chips de Chocolate Blanco",
    description: "Masa intensa de cacao belga de gran profundidad, repleta de abundantes chispas de chocolate blanco de leche súper cremoso.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/chocolate_blanco/03_galletas-de-chocolate-con-chips-de-chocolate-blanco.jpg",
    rating: 4.8,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Puro chocolate blanco cremoso", "Masa de cacao belga premium", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-chocochips-nueces",
    name: "Galletas de Choco Chips con Nueces",
    description: "La receta clásica perfeccionada. Galletas tiernas en el centro y crujientes en el borde, con trozos de nuez tostada y chips de chocolate semiamargo.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/chocochips_nueces/04_galletas-de-choco-chips-con-nueces.jpg",
    rating: 4.9,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Nueces crujientes seleccionadas", "Chips de chocolate semiamargo", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-avena",
    name: "Galletas de Avena con Chips de Chocolate y Arándanos",
    description: "Galletas rústicas y sustanciosas de avena entera, endulzadas de forma natural y combinadas con chips de chocolate y arándanos deshidratados jugosos.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/avena/05_galletas-de-avena-con-chips-de-chocolate-y-arandanos.jpg",
    rating: 4.8,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Avena integral de grano entero", "Arándanos rojos deshidratados", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-limon",
    name: "Galletas de Limón",
    description: "Galletas sumamente tiernas y ligeras, perfumadas con jugo y ralladura de limón amarillo, cubiertas con un glaseado fino y traslúcido.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/limon/06_galletas-de-limon.jpg",
    rating: 4.7,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Limón real 100% natural", "Glaseado fino de repostería", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-granola",
    name: "Galletas de Granola con Semillas",
    description: "Opción súper crujiente y nutritiva hecha con granola de la casa, semillas de girasol, calabaza y un toque de miel silvestre de abeja.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/granola/07_galletas-de-granola-con-semillas.jpg",
    rating: 4.8,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Semillas selectas ricas en nutrientes", "Endulzado con miel de abeja pura", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-menta",
    name: "Galletas Crujientes de Chocolate y Menta",
    description: "El maridaje elegante de la menta fresca y el chocolate amargo en una textura crocante que deleita el paladar con cada bocado.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/menta/08_galletas-crujientes-de-chocolate-y-menta.jpg",
    rating: 4.8,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Menta fresca infusionada", "Cacao belga de alta pureza", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-niditos-coco",
    name: "Galletas Niditos de Coco con Jalea de Frutos Rojos",
    description: "Preciosas galletas enrolladas en una costra crujiente de coco rallado tostado, con un centro rebosante de jalea coulis artesanal de frutos del bosque.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/niditos_coco/09_galletas-niditos-de-coco-con-jalea-de-frutos-rojos.jpg",
    rating: 4.9,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Coco rallado caramelizado", "Jalea coulis casera de moras y frambuesa", "Pedido mínimo: 30 unidades"],
    isCookie: true,
    cookieMinimum: 30
  },
  {
    id: "galleta-datiles-mani",
    name: "Bocadillos Crujientes de Dátiles y Maní",
    description: "Bocados rústicos e irresistibles que combinan la dulzura natural de los dátiles maduros picados con trozos crujientes de maní tostado y sal marina.",
    price: 1500,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/datiles_mani/10_bocadillos-crujientes-de-datiles-y-mani.jpg",
    rating: 4.8,
    sizes: [{ label: "Tamaño Estándar (Gourmet)", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Dátiles de calidad prémium", "Maní tostado crujiente", "Pedido mínimo: 20 unidades"],
    isCookie: true,
    cookieMinimum: 20
  },
  {
    id: "galleta-nutella",
    name: "Galletas de Avellanas rellenas con Nutella",
    description: "Masa exquisita elaborada con harina de avellanas tostadas y un corazón rebosante de Nutella cremosa que fluye al morder.",
    price: 1800,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/nutella/11_galletas-de-avellanas-rellenas-con-nutella.jpg",
    rating: 5.0,
    sizes: [{ label: "Horneada de 5 cm", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Avellana europea molida fina", "Corazón fluido de Nutella original", "Pedido mínimo: 20 unidades"],
    isCookie: true,
    cookieMinimum: 20
  },
  {
    id: "galleta-sandwich-mani",
    name: "Galletas Sándwich de Mantequilla de Maní y Chocolate",
    description: "Dos galletas finas y crujientes unidas por un generoso y terso relleno de mantequilla de maní y chocolate belga fundido. Opción Gluten Friendly.",
    price: 1800,
    category: "antojos",
    image: "/src/assets/images/queques/antojos/galletas/sandwich_mani/12_galletas-sandwich-de-mantequilla-de-mani-y-chocolate-gluten-friendly.jpg",
    rating: 4.9,
    sizes: [{ label: "Gluten Friendly", priceAdder: 0, servings: "1 unidad" }],
    ribbonOptions: ["Ninguno", "Cinta Dorada de Raso Imperial", "Cinta Satinada Roja"],
    features: ["Mantequilla de maní 100% natural", "Chocolate belga amargo fundido", "Pedido mínimo: 15 unidades"],
    isCookie: true,
    cookieMinimum: 15
  }
];

export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...CATERING_PRODUCTS];

export const SPONGE_BASES = [
  { id: "vainilla", name: "Vainilla Bourbon de Madagascar", description: "Básico y perfumado, tierno y húmedo", price: 0 },
  { id: "chocolate", name: "Chocolate Suizo Cacao Criollo 60%", description: "Intenso, húmedo estilo bizcochuelo belga", price: 2000 },
  { id: "pistacho", name: "Pistacho de Sicilia Molido", description: "Sabor refinado de frutos secos gourmet", price: 4000 },
  { id: "zanahoria", name: "Zanahoria Carrot & Avellana Crujiente", description: "Con especias finas e hilos de naranja", price: 2500 }
];

export const FILLINGS = [
  { id: "ddl", name: "Dulce de Leche Repostero Artesanal", description: "Típico sabor de antaño, sedoso y dulce", price: 0 },
  { id: "bariloche", name: "Crema Bariloche Premium", description: "Mezcla excelsa de dulce de leche con chocolate amargo", price: 3000 },
  { id: "frutos", name: "Jalea Coulis de Frutos del Bosque", description: "Frambuesa, mora y arándanos con toque ácido", price: 2500 },
  { id: "trufa", name: "Trufa Cremosa de Chocolate Blanco", description: "Chocolate belga infusionado con vainilla pura", price: 3500 }
];

export const RIBBON_STYLES = [
  { id: "oro", name: "Satinada de Raso Oro Imperial", description: "Un lazo de alta suntuosidad de color dorado vibrante", imageColor: "bg-amber-400" },
  { id: "rosa", name: "Seda Fina de Organza Rosa Vintage", description: "Brillo traslúcido delicado y romántico", imageColor: "bg-pink-300" },
  { id: "rustica", name: "Hilo de Yute Rústico y Encaje de Algodón", description: "Un toque orgánico, artesanal e idílico", imageColor: "bg-orange-100 border-dashed" },
  { id: "rojo", name: "Satinada Bordó Terciopelo", description: "Color de gran presencia, ideal para ocasiones románticas", imageColor: "bg-red-800" }
];
