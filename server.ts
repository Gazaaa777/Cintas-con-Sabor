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
    if (prefs.includes("vainilla") || prefs.includes("vanilla") || prefs.includes("blanco") || prefs.includes("crema") || prefs.includes("flan")) {
      theme = "vainilla";
    } else if (prefs.includes("red") || prefs.includes("velvet") || prefs.includes("rojo")) {
      theme = "red_velvet";
    } else if (prefs.includes("alem") || prefs.includes("german") || prefs.includes("coco tostado") || prefs.includes("pecana")) {
      theme = "german";
    } else if (prefs.includes("coco")) {
      theme = "coco";
    } else if (prefs.includes("zanahoria") || prefs.includes("carrot") || prefs.includes("nuez") || prefs.includes("especias")) {
      theme = "zanahoria";
    } else if (prefs.includes("pistacho") || prefs.includes("seco")) {
      theme = "pistacho";
    } else if (prefs.includes("fresa") || prefs.includes("fruta") || prefs.includes("limon") || prefs.includes("lemon") || prefs.includes("fruto") || prefs.includes("acid") || prefs.includes("mora") || prefs.includes("frambuesa") || prefs.includes("cítrico") || prefs.includes("citrico") || prefs.includes("naranja")) {
      theme = "frutal";
    } else if (prefs.includes("dulce de leche") || prefs.includes("manjar") || prefs.includes("arequipe") || prefs.includes("cajeta") || prefs.includes("bariloche")) {
      theme = "dulce_de_leche";
    } else if (prefs.includes("choc") || prefs.includes("cacao") || prefs.includes("negro") || prefs.includes("fudge") || prefs.includes("belga") || prefs.includes("trufa") || prefs.includes("sacher") || prefs.includes("mocha")) {
      theme = "chocolate";
    }

    // Adjust for dietary restrictions
    let dietaryNote = "";
    if (diet.includes("gluten") || diet.includes("celiac") || diet.includes("celíac")) {
      dietaryNote = " en su versión Gluten-Friendly (elaborada con harinas alternativas e insumos certificados)";
    } else if (diet.includes("azucar") || diet.includes("sugar") || diet.includes("diabet") || diet.includes("keto") || diet.includes("azúcar")) {
      dietaryNote = " en su versión Sin Azúcar Añadida (endulzada delicadamente con alulosa de alta repostería)";
    } else if (diet.includes("vegan") || diet.includes("leche") || diet.includes("lact") || diet.includes("huevo")) {
      dietaryNote = " en su versión Especial Libre de Lácteos";
    }

    // Generate custom recommendation fields
    let recommendation = {
      cakeName: "",
      description: "",
      whyItsPerfect: "",
      ribbonDetail: "",
      chefSecretTip: ""
    };

    switch (theme) {
      case "chocolate":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Chocolate Belga Supremo${dietaryNote}`,
          description: "Bizcocho húmedo de cacao premium con generosas capas de ganache de chocolate belga semi-amargo y fudge sedoso artesanal.",
          whyItsPerfect: `Como indicaste tu preferencia por el chocolate, esta recomendación es perfecta para vos. Ofrece la intensidad idónea del cacao de origen, proporcionando un perfil suntuoso y elegante que se adapta maravillosamente a tu celebración.`,
          ribbonDetail: "Cinta Satinada de Raso color Marrón Chocolate y detalles en Oro Viejo",
          chefSecretTip: "Para una experiencia culinaria insuperable, sírvelo a temperatura ambiente acompañado de una taza de café espresso doble."
        };
        break;
      case "vainilla":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Vainilla Bourbon & Frutos del Bosque${dietaryNote}`,
          description: "Bizcocho tierno y húmedo perfumado con extracto puro de vainilla Bourbon de Madagascar, relleno de jalea coulis artesanal de frutos del bosque.",
          whyItsPerfect: `Es ideal para vos porque se alinea con tu preferencia por sabores suaves, aromáticos y frutales. El sutil balance entre el dulzor de la vainilla y la acidez de las frambuesas y moras es un clásico refinado.`,
          ribbonDetail: "Cinta de Organza translúcida color Crema Marfil con hilos dorados",
          chefSecretTip: "Disfrútalo ligeramente frío para acentuar las notas frutales y la frescura de la crema."
        };
        break;
      case "red_velvet":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' Red Velvet Sublime${dietaryNote}`,
          description: "Bizcocho aterciopelado con un toque sutil de cacao fino de aroma, relleno y cubierto de nuestro exclusivo frosting de queso crema gourmet.",
          whyItsPerfect: `Tu preferencia por el toque Red Velvet es ideal para ocasiones memorables. Su icónico color carmesí y textura esponjosa garantizan una presentación deslumbrante y un sabor balanceado de ensueño.`,
          ribbonDetail: "Cinta Ancha Satinada de Raso color Rojo Borgoña Imperial",
          chefSecretTip: "Marida de manera sublime con una copa de vino espumoso o champaña semi-seco para festejar por todo lo alto."
        };
        break;
      case "german":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' Alemán de Chocolate, Coco & Pecanas${dietaryNote}`,
          description: "Bizcocho húmedo de cacao belga cubierto y relleno con caramelo de mantequilla artesanal, coco tostado rallado y pecanas crujientes troceadas.",
          whyItsPerfect: `Es una elección maravillosa gracias a tu inclinación por las texturas crujientes y dulces. La combinación rústica del coco tostado y la nuez pecana sobre la base de chocolate es insuperable.`,
          ribbonDetail: "Cinta Satinada de Raso color Bronce Metálico",
          chefSecretTip: "Sírvelo a temperatura ambiente para permitir que el caramelo y los aceites naturales de las pecanas se suavicen y desplieguen su aroma."
        };
        break;
      case "coco":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Coco Imperial${dietaryNote}`,
          description: "Suave y tierno bizcocho de coco humedecido en leche de coco y sutil ron añejo, relleno con crema untuosa de coco tostado.",
          whyItsPerfect: `Satisface tu gusto por los sabores exóticos y cremosos. El coco aporta una ligereza y frescura tropical exquisita que deleita con distinción.`,
          ribbonDetail: "Cinta de Raso color Blanco Níveo con bordes satinados",
          chefSecretTip: "Añadir unos hilos de ralladura fresca de limón sobre la tarta al momento de servir realza majestuosamente su perfil tropical."
        };
        break;
      case "zanahoria":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Zanahoria & Avellana Crujiente${dietaryNote}`,
          description: "Bizcocho rústico de zanahoria sumamente húmedo, enriquecido con especias finas orientales, avellanas europeas tostadas y suave frosting de queso crema.",
          whyItsPerfect: `Combina de forma magnífica con tus preferencias. Las notas cálidas de la canela, jengibre y nuez moscada junto con el crujiente de la avellana crean una experiencia de confort inigualable.`,
          ribbonDetail: "Cinta de Organza color Cobre y Terracota",
          chefSecretTip: "Es el compañero perfecto para una infusión de té chai caliente o un capuchino espumoso por la tarde."
        };
        break;
      case "pistacho":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Pistacho & Frambuesas${dietaryNote}`,
          description: "Bizcocho tierno de auténtico pistacho de Sicilia finamente molido, relleno de ganache de chocolate blanco belga y jalea artesanal de frambuesas frescas.",
          whyItsPerfect: `Cumple a la perfección con tu preferencia por el pistacho, ofreciendo un balance entre el toque salado-cremoso del fruto seco y la refrescante acidez de la frambuesa.`,
          ribbonDetail: "Cinta de Raso Verde Oliva con un lazo en Oro Brillante",
          chefSecretTip: "Retíralo del refrigerador unos 15 minutos antes de degustar para liberar todos los aromas y aceites del pistacho siciliano."
        };
        break;
      case "frutal":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Limón Real e Hilos de Naranja${dietaryNote}`,
          description: "Bizcocho cítrico muy esponjoso embebido en almíbar de limón natural y relleno de un suave lemon curd imperial artesanal.",
          whyItsPerfect: `Si buscás una experiencia cítrica, fresca y refrescante, este pastel de limón real es ideal. Su acidez balanceada limpia el paladar con suma distinción.`,
          ribbonDetail: "Cinta de Organza color Amarillo Sol y Crema Pastel",
          chefSecretTip: "Degústalo bien frío junto a un té de menta helado para potenciar la frescura en días cálidos."
        };
        break;
      case "dulce_de_leche":
        recommendation = {
          cakeName: `Cofre 'Cake in the Box' de Dulce de Leche & Crema Bariloche${dietaryNote}`,
          description: "Bizcocho húmedo relleno de dulce de leche artesanal premium y crema Bariloche (exquisito dulce de leche fundido con chocolate amargo).",
          whyItsPerfect: `Cumple magistralmente con tu gusto por lo dulce y tradicional. La crema Bariloche y el dulce de leche evocan los sabores más queridos de nuestra repostería clásica.`,
          ribbonDetail: "Cinta Satinada de Raso color Caramelo y Oro",
          chefSecretTip: "Disfrútalo con un café negro recién hecho y sin azúcar para contrastar la gloriosa dulzura artesanal."
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

      const prompt = `Como el legendario Maestro Pastelero de "Cintas con Sabor", tu objetivo es recomendar la combinación perfecta de tartas premium, coberturas, y decoraciones de cintas satinadas de acuerdo con la información provista por el cliente.
      
      Detalles del Evento/Cliente:
      - Preferencias de sabores del cliente: ${preferences || "Cualquier sabor premium"}
      - Restricciones alimenticias: ${dietary || "Ninguna"}
      - Tipo de Evento / Ocasión: ${eventType || "Celebración personal o antojo sofisticado"}
      
      CRÍTICO - REGLA DE PERSONALIZACIÓN DE SABOR:
      Debes sugerir una recomendación que sea ALTAMENTE ACORDE a las preferencias de sabores expresadas por el cliente. 
      - Si el cliente menciona "chocolate", "cacao", "fudge", "amargo" o similares, debes recomendar obligatoriamente un pastel enfocado en Chocolate (como Chocolate Belga o Pastel Alemán de Chocolate). NO recomiendes pistacho, vainilla o limón en este caso.
      - Si el cliente menciona "frutas", "ácido", "limón", "fresa", "mora" o "frambuesa", recomiéndale una combinación frutal o cítrica.
      - Si el cliente menciona "dulce de leche" o "manjar", recomiéndale Dulce de Leche o Crema Bariloche.
      - Si el cliente menciona "zanahoria", recomiéndale Pastel de Zanahoria Gourmet.
      - Solo si el cliente no tiene preferencia alguna, puedes sugerir nuestro famoso y aclamado "Cake in the Box de Pistacho con Frambuesas".
      
      Por favor proporciona una recomendación sumamente tentadora y detallada redactada en un tono sofisticado, cálido y elegante en español. Incluye:
      1. El Pastel Recomendado de nuestro catálogo: (Elige uno que se adapte estrictamente a sus gustos, como "Cofre 'Cake in the Box' de Chocolate Belga Supremo", "Cofre 'Cake in the Box' Red Velvet Sublime", "Cofre 'Cake in the Box' de Vainilla Bourbon & Frutos del Bosque", "Cofre 'Cake in the Box' de Pistacho & Frambuesas", "Cofre 'Cake in the Box' de Zanahoria & Avellana Crujiente", etc. Adapta el nombre si el cliente tiene restricciones alimenticias).
      2. Una combinación sugerida de decoración con nuestra emblemática cinta (cinta de raso dorado, cinta de seda color crema, cinta de organza verde oliva, o cinta de raso marrón chocolate).
      3. Una nota del Chef sobre por qué esta combinación es perfecta para su ocasión y preferencias de sabor.
      
      Responde estrictamente en formato JSON con la siguiente estructura exacta:
      {
        "cakeName": "Nombre del Pastel sugerido",
        "description": "Una frase corta muy apetitosa sobre sus notas de sabor",
        "whyItsPerfect": "Explicación muy detallada y amigable de por qué es el pastel ideal según sus preferencias y el evento",
        "ribbonDetail": "Color y estilo de la cinta elegante sugerida para el lazo del empaque",
        "chefSecretTip": "Un consejo del maestro pastelero para realzar la experiencia gastronómica"
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
