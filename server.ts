import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup server logs securely without cluttering browser console
  app.use((req, res, next) => {
    next();
  });

  // Google GenAI initialization
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey 
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      })
    : null;

  // Helper function to generate highly personalized recommendations locally when Gemini API is unavailable/overloaded
  function getLocalRecommendation(preferences: string = "", dietary: string = "", eventType: string = "") {
    const prefs = (preferences || "").toLowerCase();
    const diet = (dietary || "").toLowerCase();
    const event = (eventType || "").toLowerCase();

    // Identify taste theme based on keywords
    let theme = "chocolate"; // default elegant choice
    let matchedIds: string[] = [];

    if (prefs.includes("vainilla") || prefs.includes("vanilla") || prefs.includes("blanco") || prefs.includes("crema") || prefs.includes("flan")) {
      theme = "vainilla";
      matchedIds = ["box-vainilla", "cumple-vainilla", "cumple-flan-caramelo"];
    } else if (prefs.includes("red") || prefs.includes("velvet") || prefs.includes("rojo")) {
      theme = "red_velvet";
      matchedIds = ["box-red-velvet", "cumple-velvet", "antojo-red-velvet"];
    } else if (prefs.includes("alem") || prefs.includes("german") || prefs.includes("coco tostado") || prefs.includes("pecana")) {
      theme = "german";
      matchedIds = ["box-german", "cumple-german", "antojo-german", "galleta-pecanas"];
    } else if (prefs.includes("coco")) {
      theme = "coco";
      matchedIds = ["box-coco", "cumple-coco", "antojo-coco", "galleta-niditos-coco"];
    } else if (prefs.includes("zanahoria") || prefs.includes("carrot") || prefs.includes("nuez") || prefs.includes("especias")) {
      theme = "zanahoria";
      matchedIds = ["box-zanahoria", "cumple-zanahoria", "antojo-zanahoria"];
    } else if (prefs.includes("fresa") || prefs.includes("fruta") || prefs.includes("limon") || prefs.includes("lemon") || prefs.includes("fruto") || prefs.includes("acid") || prefs.includes("mora") || prefs.includes("frambuesa") || prefs.includes("cítrico") || prefs.includes("citrico") || prefs.includes("naranja")) {
      theme = "frutal";
      matchedIds = ["cumple-fresa", "cumple-bundt-limon", "cumple-bundt-naranja", "galleta-limon"];
    } else if (prefs.includes("dulce de leche") || prefs.includes("manjar") || prefs.includes("arequipe") || prefs.includes("cajeta") || prefs.includes("bariloche")) {
      theme = "dulce_de_leche";
      matchedIds = ["cumple-banano", "cumple-flan-caramelo", "cumple-sandwich-mani"];
    } else if (prefs.includes("choc") || prefs.includes("cacao") || prefs.includes("negro") || prefs.includes("fudge") || prefs.includes("belga") || prefs.includes("trufa") || prefs.includes("sacher") || prefs.includes("mocha")) {
      theme = "chocolate";
      matchedIds = ["box-chocolate", "cumple-belga", "antojo-chocolate-belga", "cumple-german"];
    } else {
      // Default / general search fallback
      theme = "chocolate";
      matchedIds = ["box-chocolate", "box-vainilla", "box-red-velvet"];
    }

    // Filter by dietary restrictions if specified
    if (diet.includes("gluten") || diet.includes("celiac") || diet.includes("celíac") || diet.includes("sin tacc") || diet.includes("tacc")) {
      // Prioritize gluten-friendly product
      matchedIds = ["galleta-sandwich-mani", ...matchedIds.filter(id => id !== "galleta-sandwich-mani")].slice(0, 4);
    }

    // Adjust for dietary restrictions naming
    let dietaryNote = "";
    if (diet.includes("gluten") || diet.includes("celiac") || diet.includes("celíac") || diet.includes("sin tacc") || diet.includes("tacc")) {
      dietaryNote = " en su versión Gluten-Friendly (elaborada con harinas alternativas e insumos certificados)";
    } else if (diet.includes("azucar") || diet.includes("sugar") || diet.includes("diabet") || diet.includes("keto") || diet.includes("azúcar") || diet.includes("sin azucar")) {
      dietaryNote = " en su versión Sin Azúcar Añadida (endulzada delicadamente con alulosa de alta repostería)";
    } else if (diet.includes("vegan") || diet.includes("leche") || diet.includes("lact") || diet.includes("huevo") || diet.includes("sin lactosa")) {
      dietaryNote = " en su versión Especial Libre de Lácteos";
    }

    // Generate custom recommendation fields
    let recommendation = {
      cakeName: "",
      description: "",
      whyItsPerfect: "",
      ribbonDetail: "",
      chefSecretTip: "",
      matchingProductIds: matchedIds
    };

    switch (theme) {
      case "chocolate":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Chocolate Belga Supremo${dietaryNote}`,
          description: "Bizcocho húmedo de cacao premium con generosas capas de ganache de chocolate belga semi-amargo y fudge sedoso artesanal.",
          whyItsPerfect: `Como indicaste tu preferencia por el chocolate, esta recomendación es perfecta para vos. Ofrece la intensidad idónea del cacao de origen, proporcionando un perfil suntuoso y elegante que se adapta maravillosamente a tu celebración.`,
          ribbonDetail: "Cinta Satinada de Raso color Marrón Chocolate y detalles en Oro Viejo",
          chefSecretTip: "Para una experiencia culinaria insuperable, sírvelo a temperatura ambiente acompañado de una taza de café espresso doble.",
          matchingProductIds: matchedIds
        };
        break;
      case "vainilla":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Vainilla Bourbon & Frutos del Bosque${dietaryNote}`,
          description: "Bizcocho tierno y húmedo perfumado con extracto puro de vainilla Bourbon de Madagascar, relleno de jalea coulis artesanal de frutos del bosque.",
          whyItsPerfect: `Es ideal para vos porque se alinea con tu preferencia por sabores suaves, aromáticos y frutales. El sutil balance entre el dulzor de la vainilla y la acidez de las frambuesas y moras es un clásico refinado.`,
          ribbonDetail: "Cinta de Organza translúcida color Crema Marfil con hilos dorados",
          chefSecretTip: "Disfrútalo ligeramente frío para acentuar las notas frutales y la frescura de la crema.",
          matchingProductIds: matchedIds
        };
        break;
      case "red_velvet":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' Red Velvet Sublime${dietaryNote}`,
          description: "Bizcocho aterciopelado con un toque sutil de cacao fino de aroma, relleno y cubierto de nuestro exclusivo frosting de queso crema gourmet.",
          whyItsPerfect: `Tu preferencia por el toque Red Velvet es ideal para ocasiones memorables. Su icónico color carmesí y textura esponjosa garantizan una presentación deslumbrante y un sabor balanceado de ensueño.`,
          ribbonDetail: "Cinta Ancha Satinada de Raso color Rojo Borgoña Imperial",
          chefSecretTip: "Marida de manera sublime con una copa de vino espumoso o champaña semi-seco para festejar por todo lo alto.",
          matchingProductIds: matchedIds
        };
        break;
      case "german":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' Alemán de Chocolate, Coco & Pecanas${dietaryNote}`,
          description: "Bizcocho húmedo de cacao belga cubierto y relleno con caramelo de mantequilla artesanal, coco tostado rallado y pecanas crujientes troceadas.",
          whyItsPerfect: `Es una elección maravillosa gracias a tu inclinación por las texturas crujientes y dulces. La combinación rústica del coco tostado y la nuez pecana sobre la base de chocolate es insuperable.`,
          ribbonDetail: "Cinta Satinada de Raso color Bronce Metálico",
          chefSecretTip: "Sírvelo a temperatura ambiente para permitir que el caramelo y los aceites naturales de las pecanas se suavicen y desplieguen su aroma.",
          matchingProductIds: matchedIds
        };
        break;
      case "coco":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Coco Imperial${dietaryNote}`,
          description: "Suave y tierno bizcocho de coco humedecido en leche de coco y sutil ron añejo, relleno con crema untuosa de coco tostado.",
          whyItsPerfect: `Satisface tu gusto por los sabores exóticos y cremosos. El coco aporta una ligereza y frescura tropical exquisita que deleita con distinción.`,
          ribbonDetail: "Cinta de Raso color Blanco Níveo con bordes satinados",
          chefSecretTip: "Añadir unos hilos de ralladura fresca de limón sobre la tarta al momento de servir realza majestuosamente su perfil tropical.",
          matchingProductIds: matchedIds
        };
        break;
      case "zanahoria":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Zanahoria & Avellana Crujiente${dietaryNote}`,
          description: "Bizcocho rústico de zanahoria sumamente húmedo, enriquecido con especias finas orientales, avellanas europeas tostadas y suave frosting de queso crema.",
          whyItsPerfect: `Combina de forma magnífica con tus preferencias. Las notas cálidas de la canela, jengibre y nuez moscada junto con el crujiente de la avellana crean una experiencia de confort inigualable.`,
          ribbonDetail: "Cinta de Organza color Cobre y Terracota",
          chefSecretTip: "Es el compañero perfecto para una infusión de té chai caliente o un capuchino espumoso por la tarde.",
          matchingProductIds: matchedIds
        };
        break;
      case "frutal":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Limón Real e Hilos de Naranja${dietaryNote}`,
          description: "Bizcocho cítrico muy esponjoso embebido en almíbar de limón natural y relleno de un suave lemon curd imperial artesanal.",
          whyItsPerfect: `Si buscás una experiencia cítrica, fresca y refrescante, este pastel de limón real es ideal. Su acidez balanceada limpia el paladar con suma distinción.`,
          ribbonDetail: "Cinta de Organza color Amarillo Sol y Crema Pastel",
          chefSecretTip: "Degústalo bien frío junto a un té de menta helado para potenciar la frescura en días cálidos.",
          matchingProductIds: matchedIds
        };
        break;
      case "dulce_de_leche":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Dulce de Leche & Crema Bariloche${dietaryNote}`,
          description: "Bizcocho húmedo relleno de dulce de leche artesanal premium y crema Bariloche (exquisito dulce de leche fundido con chocolate amargo).",
          whyItsPerfect: `Cumple magistralmente con tu gusto por lo dulce y tradicional. La crema Bariloche y el dulce de leche evocan los sabores más queridos de nuestra repostería clásica.`,
          ribbonDetail: "Cinta Satinada de Raso color Caramelo y Oro",
          chefSecretTip: "Disfrútalo con un café negro recién hecho y sin azúcar para contrastar la gloriosa dulzura artesanal.",
          matchingProductIds: matchedIds
        };
        break;
    }

    // Add extra personalized touch based on the event type
    if (event.includes("cumple") || event.includes("birth")) {
      recommendation.whyItsPerfect += " Además, su presentación con nuestro lazo emblemático hará que el momento del soplado de velas sea sumamente emotivo y fotogénico.";
    } else if (event.includes("boda") || event.includes("casam") || event.includes("wed")) {
      recommendation.whyItsPerfect += " Su sobriedad estética y la delicadeza de sus texturas aportarán el toque de refinamiento ideal para sellar una velada romántica de ensueño.";
    } else if (event.includes("aniver") || event.includes("anniv")) {
      recommendation.whyItsPerfect += " Una elección de alta repostería ideal para festejar el amor y el tiempo compartido con la elegancia gourmet que se merece.";
    } else if (event.includes("regalo") || event.includes("obsequ") || event.includes("gift")) {
      recommendation.whyItsPerfect += " Pensado para deslumbrar: abrir este cofre sellado con un lazo impecable genera una ilusión única desde el primer segundo.";
    } else if (event.includes("corpor") || event.includes("reun") || event.includes("offic") || event.includes("trab")) {
      recommendation.whyItsPerfect += " Su formato sofisticado y prolijo es ideal para eventos corporativos, permitiéndote deleitar a tus colegas o clientes con un estándar estelar.";
    }

    return recommendation;
  }

  // API Route for AI Pastry Chef
  app.post("/api/chef/recommend", async (req, res) => {
    const { preferences, dietary, eventType } = req.body;
    try {
      if (!ai) {
        const localRec = getLocalRecommendation(preferences, dietary, eventType);
        return res.json(localRec);
      }

      const prompt = `Como el legendario Maestro Pastelero de "Cintas con Sabor", tu objetivo es recomendar la combinación perfecta de tartas premium, coberturas, y decoraciones de cintas satinadas de acuerdo con la información provista por el cliente, junto con una lista de productos reales de nuestro catálogo que coinciden con su búsqueda y sus restricciones.
      
      INFORMACIÓN DEL NEGOCIO ("Cintas con Sabor"):
      - Somos una repostería artesanal de altísimo nivel. Vestimos y atamos cada pastel meticulosamente a mano con delicadas cintas de raso y seda, haciendo de la pastelería fina un regalo inolvidable.
      - Ubicados en Barrio Escalante, San José, Costa Rica. Solo ofrecemos retiro presencial en nuestra boutique física para garantizar la integridad estructural y la perfecta presentación de las cintas y moños; no contamos con entregas o servicios a domicilio.
      - Ofrecemos cuatro grandes categorías de productos:
        1) "Cakes in the Box" (cofres herméticos individuales de 8 oz o grandes de 32 oz perfectos para regalo).
        2) "Cakes de Cumpleaños" (pasteles festivos suntuosos con velitas finas y empaque soberbio).
        3) "Antojos para el Hogar" (porciones gourmet individuales de 8 cm y deliciosas galletas artesanales).
        4) "Catering & Menú General" (mini bocados dulces y salados de la mayor solemnidad).
      
      CATÁLOGO DE PRODUCTOS DISPONIBLES (Usa ESTOS IDs exactos para poblar el array 'matchingProductIds'):
      - 'box-red-velvet' (Cake in the Box - Red Velvet)
      - 'box-vainilla' (Cake in the Box - Vainilla)
      - 'box-german' (Cake in the Box - German Coco-Pecana, coco tostado y pecanas)
      - 'box-coco' (Cake in the Box - Coco humedecido)
      - 'box-chocolate' (Cake in the Box - Chocolate con fudge belga)
      - 'box-zanahoria' (Cake in the Box - Zanahoria con especias)
      - 'cumple-vainilla' (Cake de Cumpleaños Clásico de Vainilla con dulce de leche)
      - 'cumple-german' (Cake de Cumpleaños Suntuoso German)
      - 'cumple-velvet' (Tarta de Cumpleaños Red Velvet Luxury)
      - 'cumple-belga' (Fantasía de Chocolate Belga & Fudge)
      - 'cumple-mocha' (Delicia de Café Mocha & Espresso)
      - 'cumple-coco' (Cake de Cumpleaños Coco Imperial)
      - 'cumple-zanahoria' (Cake de Cumpleaños Zanahoria & Especias)
      - 'cumple-sachertorte' (Cake de Cumpleaños Sachertorte Tradicional con chabacano)
      - 'cumple-banano' (Cake de Cumpleaños Banano con Dulce de Leche)
      - 'cumple-fresa' (Cake de Cumpleaños Especial de Fresa con chantilly de pastura)
      - 'cumple-bundt-limon' (Cake de Cumpleaños Especial Bundt Limón, ideal cítrico)
      - 'cumple-bundt-naranja' (Cake de Cumpleaños Especial Bundt Naranja)
      - 'cumple-bundt-chocolate' (Cake de Cumpleaños Especial Bundt Chocolate)
      - 'cumple-bundt-cafe' (Cake de Cumpleaños Especial Bundt Café)
      - 'antojo-chocolate-belga' (Porción Individual de 8 cm - Chocolate Belga)
      - 'antojo-mocha' (Porción Individual de 8 cm - Mocha)
      - 'antojo-coco' (Porción Individual de 8 cm - Coco)
      - 'antojo-zanahoria' (Porción Individual de 8 cm - Zanahoria)
      - 'antojo-sachertorte' (Porción Individual de 8 cm - Sachertorte)
      - 'antojo-chocolatine' (Porción Individual de 8 cm - Chocolatine)
      - 'antojo-german' (Porción Individual de 8 cm - German)
      - 'antojo-red-velvet' (Porción Individual de 8 cm - Red Velvet)
      - 'galleta-pecanas' (Galletas de Pecanas Gourmet)
      - 'galleta-veteadas' (Galletas Veteadas Naranja-Chocolate-Pistacho)
      - 'galleta-limon' (Galletas de Limón Real)
      - 'galleta-nutella' (Galletas de Avellana Rellenas con Nutella)
      - 'galleta-sandwich-mani' (Galletas Sándwich de Mantequilla de Maní y Chocolate - CRÍTICO: ¡Esta es nuestra opción destacada Gluten-Friendly / Sin Gluten!)

      Detalles del Pedido del Cliente:
      - Preferencias de sabores del cliente: ${preferences || "Cualquier tarta gourmet fina"}
      - Restricciones alimenticias especificadas: ${dietary || "Ninguna"}
      - Tipo de Evento / Ocasión: ${eventType || "Celebración elegante"}
      
      CRÍTICO - REGLA DE PERSONALIZACIÓN Y FILTRADO:
      1. Si el cliente tiene restricciones de Gluten o Celíaquía, DEBES priorizar 'galleta-sandwich-mani' (nuestra galleta estrella gluten-friendly) y sugerir adaptaciones Gluten-Friendly para los otros productos seleccionados.
      2. Si el cliente tiene restricciones de Azúcar o Diabetes, debes sugerir que el pastel se puede preparar en su versión "Sin Azúcar Añadida" usando alulosa de alta calidad.
      3. Sugiere de 1 a 4 IDs de productos reales de la lista anterior que coincidan con la búsqueda en el array 'matchingProductIds'. Por ejemplo, si busca chocolate, pon ['box-chocolate', 'cumple-belga', 'antojo-chocolate-belga']. Si busca coco, pon ['box-coco', 'cumple-coco', 'galleta-niditos-coco'].
      
      Responde estrictamente en formato JSON con la siguiente estructura exacta:
      {
        "cakeName": "Nombre del pastel principal sugerido (ej: 'Cofre Cake in the Box de Chocolate Belga Supremo')",
        "description": "Una frase corta muy apetitosa sobre sus notas de sabor",
        "whyItsPerfect": "Explicación muy detallada, experta y amigable de por qué esta sugerencia se adapta perfectamente a sus preferencias, tipo de evento y restricciones alimenticias",
        "ribbonDetail": "Color y estilo elegante del lazo de seda/raso recomendado para envolver su tarta",
        "chefSecretTip": "Un consejo experto de maridaje o servicio para realzar la experiencia culinaria",
        "matchingProductIds": ["id-producto-1", "id-producto-2", "id-producto-3"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const recommendation = JSON.parse(responseText.trim());
      res.json(recommendation);
    } catch (error: any) {
      console.log("Nota: El servicio de Chef AI no está disponible temporalmente (usando recomendación dinámica personalizada localmente).");
      const localRec = getLocalRecommendation(preferences, dietary, eventType);
      res.status(200).json(localRec);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
