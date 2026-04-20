(function () {
    if (document.querySelector(".global-sidebar")) {
        return;
    }

    const body = document.body;
    if (!body) {
        return;
    }

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem("rrUsers")) || {};
        } catch (error) {
            return {};
        }
    }

    function getCurrentUser() {
        const users = getUsers();
        const currentUserEmail = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
        const fallbackName = localStorage.getItem("username") || "Account";
        const user = users[currentUserEmail];
        if (!user) {
            return {
                fullName: fallbackName,
                email: currentUserEmail || "",
                photo: "",
                language: localStorage.getItem("preferredLanguage") || "en",
                isLoggedIn: localStorage.getItem("isLoggedIn") === "1"
            };
        }
        return {
            fullName: user.fullName || fallbackName,
            email: user.email || currentUserEmail,
            photo: user.photo || "",
            language: user.language || localStorage.getItem("preferredLanguage") || "en",
            isLoggedIn: localStorage.getItem("isLoggedIn") === "1"
        };
    }

    function escapeHtml(text) {
        return String(text || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const supportedLanguages = ["en", "ar", "es", "fr"];

    function getPreferredLanguage(currentUserLanguage) {
        const stored = String(localStorage.getItem("preferredLanguage") || "").toLowerCase();
        const fallback = String(currentUserLanguage || "").toLowerCase();
        const selected = supportedLanguages.indexOf(stored) !== -1
            ? stored
            : (supportedLanguages.indexOf(fallback) !== -1 ? fallback : "en");
        localStorage.setItem("preferredLanguage", selected);
        return selected;
    }

    function saveUserLanguageIfLoggedIn(lang) {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "1";
        const currentUserEmail = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
        if (!isLoggedIn || !currentUserEmail) {
            return;
        }
        const users = getUsers();
        if (!users[currentUserEmail]) {
            return;
        }
        users[currentUserEmail].language = lang;
        localStorage.setItem("rrUsers", JSON.stringify(users));
    }

    const languagePack = {
        ar: {
            "RecipeRadar": "ريسيبي رادار",
            "Account": "الحساب",
            "My Account": "حسابي",
            "Upload Recipe": "رفع وصفة",
            "Customized Recipes": "وصفات مخصصة",
            "About Us": "من نحن",
            "Contact Us": "اتصل بنا",
            "Login": "تسجيل الدخول",
            "Logout": "تسجيل الخروج",
            "Language": "اللغة",
            "English": "الإنجليزية",
            "Arabic": "العربية",
            "Spanish": "الإسبانية",
            "French": "الفرنسية",
            "Home": "الرئيسية",
            "Open menu": "فتح القائمة",
            "Search recipes or categories...": "ابحث عن وصفات أو فئات...",
            "No matches found": "لا توجد نتائج",
            "Category": "الفئة",
            "Recipe": "الوصفة",
            "Categories": "الفئات",
            "Recipes": "وصفات",
            "Open Recipe": "فتح الوصفة",
            "Back to Main Dishes": "العودة إلى الأطباق الرئيسية",
            "Back to Pasta & Rice Categories": "العودة إلى فئات المكرونة والأرز",
            "Back to Soups & Stews Categories": "العودة إلى فئات الشوربات واليخنات",
            "Back to Protein Categories": "العودة إلى فئات البروتين",
            "Back to Vegetarian Categories": "العودة إلى الفئات النباتية",
            "Back to Breakfast Categories": "العودة إلى فئات الإفطار",
            "Back to Drinks Categories": "العودة إلى فئات المشروبات",
            "Choose a recipe card to open full ingredients and steps.": "اختر بطاقة وصفة لعرض المكونات والخطوات كاملة.",
            "Choose a category, then open a recipe card.": "اختر فئة ثم افتح بطاقة الوصفة.",
            "Ingredients": "المكونات",
            "Recipe Steps": "خطوات الوصفة",
            "Create Account": "إنشاء حساب",
            "Welcome Back": "مرحباً بعودتك",
            "Sign in to continue": "سجل الدخول للمتابعة",
            "Preferred Language": "اللغة المفضلة",
            "Select your language": "اختر لغتك",
            "Create Account": "إنشاء حساب",
            "No email": "لا يوجد بريد إلكتروني",
            "Account created successfully. Please login.": "تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول."
        },
        es: {
            "RecipeRadar": "RecipeRadar",
            "Account": "Cuenta",
            "My Account": "Mi cuenta",
            "Upload Recipe": "Subir receta",
            "Customized Recipes": "Recetas personalizadas",
            "About Us": "Sobre nosotros",
            "Contact Us": "Contáctanos",
            "Login": "Iniciar sesión",
            "Logout": "Cerrar sesión",
            "Language": "Idioma",
            "English": "Inglés",
            "Arabic": "Árabe",
            "Spanish": "Español",
            "French": "Francés",
            "Home": "Inicio",
            "Open menu": "Abrir menú",
            "Search recipes or categories...": "Buscar recetas o categorías...",
            "No matches found": "No se encontraron resultados",
            "Category": "Categoría",
            "Recipe": "Receta",
            "Categories": "Categorías",
            "Recipes": "Recetas",
            "Open Recipe": "Abrir receta",
            "Back to Main Dishes": "Volver a platos principales",
            "Back to Pasta & Rice Categories": "Volver a categorías de pasta y arroz",
            "Back to Soups & Stews Categories": "Volver a categorías de sopas y guisos",
            "Back to Protein Categories": "Volver a categorías de proteína",
            "Back to Vegetarian Categories": "Volver a categorías vegetarianas",
            "Back to Breakfast Categories": "Volver a categorías de desayuno",
            "Back to Drinks Categories": "Volver a categorías de bebidas",
            "Choose a recipe card to open full ingredients and steps.": "Elige una tarjeta de receta para ver ingredientes y pasos completos.",
            "Choose a category, then open a recipe card.": "Elige una categoría y luego abre una tarjeta de receta.",
            "Ingredients": "Ingredientes",
            "Recipe Steps": "Pasos de la receta",
            "Create Account": "Crear cuenta",
            "Welcome Back": "Bienvenido de nuevo",
            "Sign in to continue": "Inicia sesión para continuar",
            "Preferred Language": "Idioma preferido",
            "Select your language": "Selecciona tu idioma",
            "No email": "Sin correo",
            "Account created successfully. Please login.": "Cuenta creada correctamente. Inicia sesión."
            ,
            "Dessert Category": "Categoría de postres",
            "Main Dishes Category": "Categoría de platos principales",
            "Breakfast Category": "Categoría de desayuno",
            "Drinks Category": "Categoría de bebidas",
            "Protein Meals": "Comidas proteicas",
            "Pasta & Rice": "Pasta y arroz",
            "Soups & Stews": "Sopas y guisos",
            "Vegetarian": "Vegetariano",
            "Chicken Meals": "Comidas con pollo",
            "Seafood Meals": "Comidas de mariscos",
            "Beef Meals": "Comidas con carne",
            "Protein Bowls": "Bowls de proteína",
            "Veggie Bowls Recipes": "Recetas de bowls vegetales",
            "Plant Protein Recipes": "Recetas de proteína vegetal",
            "Vegetarian Pasta Recipes": "Recetas de pasta vegetariana",
            "Veggie Curries Recipes": "Recetas de curry vegetal",
            "Egg Meals Recipes": "Recetas con huevo",
            "Toast & Sandwiches Recipes": "Recetas de tostadas y sándwiches",
            "Oats & Bowls Recipes": "Recetas de avena y bowls",
            "Pancakes & Waffles Recipes": "Recetas de panqueques y waffles",
            "Hot Drinks Recipes": "Recetas de bebidas calientes",
            "Cold Drinks Recipes": "Recetas de bebidas frías",
            "Smoothies Recipes": "Recetas de smoothies",
            "Mocktails Recipes": "Recetas de mocktails"
        },
        fr: {
            "RecipeRadar": "RecipeRadar",
            "Account": "Compte",
            "My Account": "Mon compte",
            "Upload Recipe": "Ajouter une recette",
            "Customized Recipes": "Recettes personnalisées",
            "About Us": "À propos",
            "Contact Us": "Contactez-nous",
            "Login": "Connexion",
            "Logout": "Déconnexion",
            "Language": "Langue",
            "English": "Anglais",
            "Arabic": "Arabe",
            "Spanish": "Espagnol",
            "French": "Français",
            "Home": "Accueil",
            "Open menu": "Ouvrir le menu",
            "Search recipes or categories...": "Rechercher des recettes ou catégories...",
            "No matches found": "Aucun résultat trouvé",
            "Category": "Catégorie",
            "Recipe": "Recette",
            "Categories": "Catégories",
            "Recipes": "Recettes",
            "Open Recipe": "Ouvrir la recette",
            "Back to Main Dishes": "Retour aux plats principaux",
            "Back to Pasta & Rice Categories": "Retour aux catégories Pâtes et Riz",
            "Back to Soups & Stews Categories": "Retour aux catégories Soupes et Ragoûts",
            "Back to Protein Categories": "Retour aux catégories Protéines",
            "Back to Vegetarian Categories": "Retour aux catégories Végétariennes",
            "Back to Breakfast Categories": "Retour aux catégories Petit-déjeuner",
            "Back to Drinks Categories": "Retour aux catégories Boissons",
            "Choose a recipe card to open full ingredients and steps.": "Choisissez une carte recette pour ouvrir les ingrédients et étapes complets.",
            "Choose a category, then open a recipe card.": "Choisissez une catégorie puis ouvrez une carte recette.",
            "Ingredients": "Ingrédients",
            "Recipe Steps": "Étapes de la recette",
            "Create Account": "Créer un compte",
            "Welcome Back": "Bon retour",
            "Sign in to continue": "Connectez-vous pour continuer",
            "Preferred Language": "Langue préférée",
            "Select your language": "Choisissez votre langue",
            "No email": "Aucun e-mail",
            "Account created successfully. Please login.": "Compte créé avec succès. Veuillez vous connecter.",
            "Dessert Category": "Catégorie Desserts",
            "Main Dishes Category": "Catégorie Plats principaux",
            "Breakfast Category": "Catégorie Petit-déjeuner",
            "Drinks Category": "Catégorie Boissons",
            "Protein Meals": "Repas protéinés",
            "Pasta & Rice": "Pâtes et Riz",
            "Soups & Stews": "Soupes et Ragoûts",
            "Vegetarian": "Végétarien",
            "Chicken Meals": "Repas au poulet",
            "Seafood Meals": "Repas de fruits de mer",
            "Beef Meals": "Repas au bœuf",
            "Protein Bowls": "Bowls protéinés",
            "Veggie Bowls Recipes": "Recettes de bowls végétariens",
            "Plant Protein Recipes": "Recettes de protéines végétales",
            "Vegetarian Pasta Recipes": "Recettes de pâtes végétariennes",
            "Veggie Curries Recipes": "Recettes de curry végétarien",
            "Egg Meals Recipes": "Recettes à base d'œufs",
            "Toast & Sandwiches Recipes": "Recettes de toasts et sandwiches",
            "Oats & Bowls Recipes": "Recettes d'avoine et bowls",
            "Pancakes & Waffles Recipes": "Recettes de pancakes et gaufres",
            "Hot Drinks Recipes": "Recettes de boissons chaudes",
            "Cold Drinks Recipes": "Recettes de boissons froides",
            "Smoothies Recipes": "Recettes de smoothies",
            "Mocktails Recipes": "Recettes de mocktails"
        }
    };

    const termPack = {
        ar: {
            "recipe": "وصفة",
            "recipes": "وصفات",
            "ingredients": "المكونات",
            "steps": "الخطوات",
            "step": "خطوة",
            "category": "الفئة",
            "categories": "الفئات",
            "choose": "اختر",
            "open": "افتح",
            "back": "عودة",
            "search": "بحث",
            "soup": "شوربة",
            "soups": "شوربات",
            "stew": "يخنة",
            "stews": "يخنات",
            "pasta": "مكرونة",
            "rice": "أرز",
            "protein": "بروتين",
            "vegetarian": "نباتي",
            "breakfast": "فطور",
            "drinks": "مشروبات",
            "chicken": "دجاج",
            "beef": "لحم بقري",
            "seafood": "مأكولات بحرية",
            "bowl": "وعاء",
            "bowls": "أوعية",
            "cook": "اطبخ",
            "boil": "اغل",
            "mix": "اخلط",
            "add": "أضف",
            "serve": "قدّم",
            "hot": "ساخن",
            "cold": "بارد"
        },
        es: {
            "recipe": "receta",
            "recipes": "recetas",
            "ingredients": "ingredientes",
            "steps": "pasos",
            "step": "paso",
            "category": "categoría",
            "categories": "categorías",
            "choose": "elige",
            "open": "abrir",
            "back": "volver",
            "search": "buscar",
            "soup": "sopa",
            "soups": "sopas",
            "stew": "guiso",
            "stews": "guisos",
            "pasta": "pasta",
            "rice": "arroz",
            "protein": "proteína",
            "vegetarian": "vegetariano",
            "breakfast": "desayuno",
            "drinks": "bebidas",
            "chicken": "pollo",
            "beef": "carne",
            "seafood": "mariscos",
            "bowl": "bowl",
            "bowls": "bowls",
            "cook": "cocinar",
            "boil": "hervir",
            "mix": "mezclar",
            "add": "agregar",
            "serve": "servir",
            "hot": "caliente",
            "cold": "frío"
        },
        fr: {
            "recipe": "recette",
            "recipes": "recettes",
            "ingredients": "ingrédients",
            "steps": "étapes",
            "step": "étape",
            "category": "catégorie",
            "categories": "catégories",
            "choose": "choisir",
            "open": "ouvrir",
            "back": "retour",
            "search": "rechercher",
            "soup": "soupe",
            "soups": "soupes",
            "stew": "ragoût",
            "stews": "ragoûts",
            "pasta": "pâtes",
            "rice": "riz",
            "protein": "protéine",
            "vegetarian": "végétarien",
            "breakfast": "petit-déjeuner",
            "drinks": "boissons",
            "chicken": "poulet",
            "beef": "bœuf",
            "seafood": "fruits de mer",
            "bowl": "bol",
            "bowls": "bols",
            "cook": "cuire",
            "boil": "faire bouillir",
            "mix": "mélanger",
            "add": "ajouter",
            "serve": "servir",
            "hot": "chaud",
            "cold": "froid"
        }
    };

    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function replaceTerms(value, lang) {
        const terms = termPack[lang];
        if (!terms || !value) {
            return value;
        }
        let result = String(value);
        const keys = Object.keys(terms).sort(function (a, b) {
            return b.length - a.length;
        });
        keys.forEach(function (key) {
            const replacement = terms[key];
            const regex = new RegExp("\\b" + escapeRegExp(key) + "\\b", "gi");
            result = result.replace(regex, replacement);
        });
        return result;
    }

    function translateValue(value, lang) {
        if (!value || lang === "en") {
            return value;
        }
        const dict = languagePack[lang] || {};
        const trimmed = String(value).trim();
        if (dict[trimmed]) {
            return String(value).replace(trimmed, dict[trimmed]);
        }
        if (trimmed.indexOf("Account: ") === 0 && dict.Account) {
            return String(value).replace("Account: ", dict.Account + ": ");
        }
        if (trimmed.indexOf("Category: ") === 0 && dict.Category) {
            return String(value).replace("Category: ", dict.Category + ": ");
        }
        return replaceTerms(value, lang);
    }

    let translationObserver = null;

    function translateSubtree(root, lang) {
        if (!root || lang === "en") {
            return;
        }

        if (root.nodeType === Node.TEXT_NODE) {
            root.nodeValue = translateValue(root.nodeValue, lang);
            return;
        }

        const elementRoot = root.nodeType === Node.ELEMENT_NODE ? root : document.body;
        if (!elementRoot) {
            return;
        }

        const translatableAttrs = ["placeholder", "title", "aria-label"];
        if (elementRoot.hasAttribute) {
            translatableAttrs.forEach(function (attr) {
                if (elementRoot.hasAttribute(attr)) {
                    const current = elementRoot.getAttribute(attr);
                    const next = translateValue(current, lang);
                    if (current !== next) {
                        elementRoot.setAttribute(attr, next);
                    }
                }
            });
        }

        const attrsTargets = elementRoot.querySelectorAll ? elementRoot.querySelectorAll("[placeholder],[title],[aria-label]") : [];
        attrsTargets.forEach(function (element) {
            translatableAttrs.forEach(function (attr) {
                if (!element.hasAttribute(attr)) {
                    return;
                }
                const current = element.getAttribute(attr);
                const next = translateValue(current, lang);
                if (current !== next) {
                    element.setAttribute(attr, next);
                }
            });
        });

        const textWalker = document.createTreeWalker(elementRoot, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (!node.nodeValue || !node.nodeValue.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                const parent = node.parentElement;
                if (!parent) {
                    return NodeFilter.FILTER_REJECT;
                }
                if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE") {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        let textNode = textWalker.nextNode();
        while (textNode) {
            textNode.nodeValue = translateValue(textNode.nodeValue, lang);
            textNode = textWalker.nextNode();
        }
    }

    function applyLanguageToDocument(lang) {
        const rtl = lang === "ar";
        document.documentElement.lang = lang;
        document.documentElement.dir = rtl ? "rtl" : "ltr";
        body.dir = rtl ? "rtl" : "ltr";

        if (translationObserver) {
            translationObserver.disconnect();
            translationObserver = null;
        }

        if (lang === "en") {
            return;
        }

        const title = translateValue(document.title, lang);
        if (title) {
            document.title = title;
        }

        translateSubtree(document.body, lang);

        translationObserver = new MutationObserver(function (mutations) {
            if (!translationObserver) {
                return;
            }
            translationObserver.disconnect();
            mutations.forEach(function (mutation) {
                if (mutation.type === "characterData") {
                    mutation.target.nodeValue = translateValue(mutation.target.nodeValue, lang);
                    return;
                }
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(function (node) {
                        translateSubtree(node, lang);
                    });
                }
            });
            translationObserver.observe(document.body, {
                subtree: true,
                childList: true,
                characterData: true
            });
        });

        translationObserver.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true
        });

        setTimeout(function () {
            translateSubtree(document.body, lang);
        }, 150);
    }

    function applyLanguageToIcons(lang) {
        const isArabic = lang === "ar";
        const backButtons = document.querySelectorAll(".back-icon-btn:not(.icon-only-back-btn)");
        backButtons.forEach(function (button) {
            if (!button.dataset.defaultArrow) {
                button.dataset.defaultArrow = button.textContent.trim() || "\u2190";
            }
            button.textContent = isArabic ? "\u2192" : "\u2190";
        });
    }

    const currentUser = getCurrentUser();
    const preferredLanguage = getPreferredLanguage(currentUser.language);
    const firstName = (currentUser.fullName || "Account").split(/\s+/)[0] || "Account";
    const emailLabel = currentUser.email || "No email";
    const photoMarkup = currentUser.photo
        ? '<img class="global-sidebar-photo" src="' + escapeHtml(currentUser.photo) + '" alt="Profile photo">'
        : '<div class="global-sidebar-photo-fallback" aria-hidden="true">&#128100;</div>';
    const authLinkMarkup = currentUser.isLoggedIn
        ? '<li><a id="global-sidebar-logout" class="global-sidebar-link" href="#"><span class="global-sidebar-icon">&#128274;</span><span>Logout</span></a></li>'
        : '<li><a class="global-sidebar-link" href="login.html"><span class="global-sidebar-icon">&#128274;</span><span>Login</span></a></li>';

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "global-sidebar-toggle";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "&#9776;";

    const overlay = document.createElement("div");
    overlay.className = "global-sidebar-overlay";

    const sidebar = document.createElement("aside");
    sidebar.className = "global-sidebar";
    sidebar.setAttribute("aria-hidden", "true");
    sidebar.innerHTML = ""
        + '<div class="global-sidebar-account">'
        + photoMarkup
        + '<div class="global-sidebar-account-meta">'
        + '<div class="global-sidebar-account-name">' + escapeHtml(firstName) + "</div>"
        + '<div class="global-sidebar-account-email">' + escapeHtml(emailLabel) + "</div>"
        + "</div>"
        + "</div>"
        + '<ul class="global-sidebar-list">'
        + '  <li><a class="global-sidebar-link" href="account.html"><span class="global-sidebar-icon">&#128100;</span><span>My Account</span></a></li>'
        + '  <li><a class="global-sidebar-link" href="upload-recipe.html"><span class="global-sidebar-icon">&#10133;</span><span>Upload Recipe</span></a></li>'
        + '  <li><a class="global-sidebar-link" href="customizedrecipes.html"><span class="global-sidebar-icon">&#127859;</span><span>Customized Recipes</span></a></li>'
        + '  <li><a class="global-sidebar-link" href="about.html"><span class="global-sidebar-icon">&#8505;</span><span>About Us</span></a></li>'
        + '  <li><a class="global-sidebar-link" href="contact.html"><span class="global-sidebar-icon">&#9742;</span><span>Contact Us</span></a></li>'
        + '  <li class="global-sidebar-item"><span class="global-sidebar-icon">&#127760;</span><label for="global-language-select">Language</label><select id="global-language-select"><option value="en">English</option><option value="ar">Arabic</option><option value="es">Spanish</option><option value="fr">French</option></select></li>'
        + authLinkMarkup
        + "</ul>";

    function closeSidebar() {
        body.classList.remove("sidebar-open");
        toggle.setAttribute("aria-expanded", "false");
        sidebar.setAttribute("aria-hidden", "true");
    }

    function openSidebar() {
        body.classList.add("sidebar-open");
        toggle.setAttribute("aria-expanded", "true");
        sidebar.setAttribute("aria-hidden", "false");
    }

    toggle.addEventListener("click", function () {
        if (body.classList.contains("sidebar-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    sidebar.addEventListener("click", function (event) {
        const clickedLink = event.target.closest("a");
        if (!clickedLink) {
            return;
        }
        if (clickedLink.id === "global-sidebar-logout") {
            event.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUserEmail");
            window.location.href = "login.html";
            return;
        }
        closeSidebar();
    });

    body.appendChild(toggle);
    body.appendChild(overlay);
    body.appendChild(sidebar);

    const languageSelect = document.getElementById("global-language-select");
    if (languageSelect) {
        languageSelect.value = preferredLanguage;
        languageSelect.addEventListener("change", function () {
            const nextLanguage = supportedLanguages.indexOf(languageSelect.value) !== -1
                ? languageSelect.value
                : "en";
            localStorage.setItem("preferredLanguage", nextLanguage);
            saveUserLanguageIfLoggedIn(nextLanguage);
            window.location.reload();
        });
    }

    function getCurrentUserRecipes() {
        const users = getUsers();
        const currentUserEmail = (localStorage.getItem("currentUserEmail") || "").toLowerCase();
        const user = users[currentUserEmail];
        if (!user || !Array.isArray(user.recipes)) {
            return [];
        }
        return user.recipes;
    }

    function renderUploadedRecipesForCategory() {
        function isRecipeForCurrentPage(recipe) {
            const targetUrl = (recipe && recipe.subcategoryTargetUrl) || "";
            if (!targetUrl) {
                return false;
            }

            const currentUrl = new URL(window.location.href);
            const recipeUrl = new URL(targetUrl, window.location.href);
            const currentPath = currentUrl.pathname.split("/").pop().toLowerCase();
            const recipePath = recipeUrl.pathname.split("/").pop().toLowerCase();
            if (currentPath !== recipePath) {
                return false;
            }

            const requiredParams = Array.from(recipeUrl.searchParams.entries());
            return requiredParams.every(function (entry) {
                return currentUrl.searchParams.get(entry[0]) === entry[1];
            });
        }

        function toCategoryKey(value) {
            return String(value || "")
                .toLowerCase()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }

        function isLegacyRecipeForCurrentCategory(recipe) {
            const bodyCategoryMap = {
                "dessert-page": "dessert",
                "main-dishes-page": "main-dishes",
                "breakfast-page": "breakfast",
                "drinks-page": "drinks",
                "protein-meals-page": "protein-meals",
                "pasta-rice-page": "pasta-rice",
                "soups-stews-page": "soups-stews",
                "vegetarian-meals-page": "vegetarian-meals"
            };

            const matchedClass = Object.keys(bodyCategoryMap).find(function (className) {
                return body.classList.contains(className);
            });
            const currentCategory = matchedClass ? bodyCategoryMap[matchedClass] : "";
            if (!currentCategory) {
                return false;
            }
            const storedKey = recipe.categoryKey || toCategoryKey(recipe.category);
            return storedKey === currentCategory;
        }

        const recipes = getCurrentUserRecipes().filter(function (recipe) {
            return isRecipeForCurrentPage(recipe) || isLegacyRecipeForCurrentCategory(recipe);
        });

        if (!recipes.length) {
            return;
        }

        const mainPanel = document.querySelector("main.panel");
        if (!mainPanel || mainPanel.querySelector(".user-category-recipes")) {
            return;
        }

        const section = document.createElement("section");
        section.className = "dessert-card user-category-recipes";
        section.innerHTML = '<h2>Your Uploaded Recipes</h2><p class="subtitle picker-subtitle">Saved under this category</p><div class="uploaded-list user-category-list"></div>';

        const list = section.querySelector(".user-category-list");
        recipes.forEach(function (recipe) {
            const card = document.createElement("article");
            card.className = "uploaded-item";
            const imageMarkup = recipe.photo
                ? '<img class="uploaded-photo" src="' + escapeHtml(recipe.photo) + '" alt="' + escapeHtml(recipe.title || "Recipe") + '">'
                : "";
            card.innerHTML = ""
                + "<h3>" + escapeHtml(recipe.title || "Untitled Recipe") + "</h3>"
                + "<p><strong>Ingredients:</strong> " + escapeHtml(recipe.ingredients || "") + "</p>"
                + "<p><strong>Steps:</strong> " + escapeHtml(recipe.steps || "") + "</p>"
                + imageMarkup;
            list.appendChild(card);
        });

        mainPanel.appendChild(section);
    }

    renderUploadedRecipesForCategory();
    applyLanguageToDocument(preferredLanguage);
    applyLanguageToIcons(preferredLanguage);

    const searchablePageClasses = [
        "clickncook-page",
        "dessert-page",
        "main-dishes-page",
        "protein-meals-page",
        "pasta-rice-page",
        "soups-stews-page",
        "vegetarian-meals-page",
        "breakfast-page",
        "drinks-page"
    ];

    const canShowSearch = searchablePageClasses.some(function (className) {
        return body.classList.contains(className);
    });

    if (!canShowSearch) {
        return;
    }

    function buildRecipeDetailsUrl(options) {
        const params = new URLSearchParams();
        params.set("title", options.title);
        params.set("category", options.category);
        params.set("ingredients", JSON.stringify(options.ingredients || []));
        params.set("steps", JSON.stringify(options.steps || []));
        if (options.photo) {
            params.set("photo", options.photo);
        }
        if (options.back) {
            params.set("back", options.back);
        }
        return "recipe-details.html?" + params.toString();
    }

    const searchIndex = [
        { label: "Dessert Category", type: "Category", url: "dessert.html", keywords: "dessert cakes cookies chilled sweet bakes" },
        { label: "Main Dishes Category", type: "Category", url: "maindishes.html", keywords: "main dishes meals lunch dinner" },
        { label: "Breakfast Category", type: "Category", url: "breakfastmeals.html", keywords: "breakfast egg oats pancakes toast waffles" },
        { label: "Drinks Category", type: "Category", url: "drinksmeals.html", keywords: "drinks smoothies cold hot mocktails" },
        { label: "Customized Recipes", type: "Category", url: "customizedrecipes.html", keywords: "customized custom user uploaded community recipes" },
        { label: "Protein Meals", type: "Category", url: "proteinmeals.html", keywords: "protein chicken seafood beef bowls" },
        { label: "Pasta & Rice", type: "Category", url: "pastarice.html", keywords: "pasta rice creamy tomato fried bowls" },
        { label: "Soups & Stews", type: "Category", url: "soupsstews.html", keywords: "soups stews hearty creamy lentil bean" },
        { label: "Vegetarian", type: "Category", url: "vegetarianmeals.html", keywords: "vegetarian veggie curries bowls plant protein" },
        { label: "Chicken Meals", type: "Category", url: "chickenmeals.html", keywords: "chicken protein category" },
        { label: "Seafood Meals", type: "Category", url: "seafoodmeals.html", keywords: "seafood fish shrimp protein category" },
        { label: "Beef Meals", type: "Category", url: "beefmeals.html", keywords: "beef protein category" },
        { label: "Protein Bowls", type: "Category", url: "proteinbowls.html", keywords: "protein bowls quinoa tuna chicken" },
        { label: "Veggie Bowls Recipes", type: "Category", url: "vegetarianrecipes.html?category=veggieBowls", keywords: "veggie bowls vegetarian recipes" },
        { label: "Plant Protein Recipes", type: "Category", url: "vegetarianrecipes.html?category=plantProtein", keywords: "plant protein vegetarian recipes" },
        { label: "Vegetarian Pasta Recipes", type: "Category", url: "vegetarianrecipes.html?category=vegetarianPasta", keywords: "vegetarian pasta recipes" },
        { label: "Veggie Curries Recipes", type: "Category", url: "vegetarianrecipes.html?category=veggieCurries", keywords: "veggie curries recipes" },
        { label: "Egg Meals Recipes", type: "Category", url: "breakfastrecipes.html?category=eggMeals", keywords: "egg meals omelet scrambled breakfast recipes" },
        { label: "Toast & Sandwiches Recipes", type: "Category", url: "breakfastrecipes.html?category=toastSandwiches", keywords: "toast sandwiches avocado turkey breakfast recipes" },
        { label: "Oats & Bowls Recipes", type: "Category", url: "breakfastrecipes.html?category=oatsBowls", keywords: "oats bowls berry yogurt breakfast recipes" },
        { label: "Pancakes & Waffles Recipes", type: "Category", url: "breakfastrecipes.html?category=pancakesWaffles", keywords: "pancakes waffles breakfast recipes" },
        { label: "Hot Drinks Recipes", type: "Category", url: "drinksrecipes.html?category=hotDrinks", keywords: "hot drinks tea chocolate recipes" },
        { label: "Cold Drinks Recipes", type: "Category", url: "drinksrecipes.html?category=coldDrinks", keywords: "cold drinks cooler iced coffee recipes" },
        { label: "Smoothies Recipes", type: "Category", url: "drinksrecipes.html?category=smoothies", keywords: "smoothies mango banana berry yogurt recipes" },
        { label: "Mocktails Recipes", type: "Category", url: "drinksrecipes.html?category=mocktails", keywords: "mocktails mojito sunrise recipes" },
        {
            label: "Veggie Omelet",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Veggie Omelet",
                category: "Egg Meals",
                photo: "omlette.jpeg",
                ingredients: ["3 eggs", "40 g bell pepper", "35 g onion", "10 g parsley", "5 ml olive oil"],
                steps: ["Whisk eggs with a pinch of salt and pepper.", "Saute onion and bell pepper for 2 minutes.", "Pour eggs into the pan and cook on medium heat.", "Fold the omelet, garnish with parsley, and serve."],
                back: "breakfastrecipes.html?category=eggMeals"
            }),
            keywords: "egg breakfast omelette omlette veggie omlette veggie omelet"
        },
        {
            label: "Scrambled Eggs Toast",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Scrambled Eggs Toast",
                category: "Egg Meals",
                photo: "scram.jpeg",
                ingredients: ["3 eggs", "10 ml milk", "10 g butter", "2 slices whole wheat toast", "1 g black pepper"],
                steps: ["Whisk eggs with milk and a pinch of salt.", "Melt butter over low heat and add the eggs.", "Stir gently until softly scrambled.", "Serve immediately over toasted bread."],
                back: "breakfastrecipes.html?category=eggMeals"
            }),
            keywords: "scrambled eggs toast breakfast"
        },
        {
            label: "Avocado Toast",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Avocado Toast",
                category: "Toast & Sandwiches",
                photo: "avoc.jpeg",
                ingredients: ["2 slices sourdough bread", "1 ripe avocado", "10 ml lemon juice", "2 g chili flakes", "2 g salt"],
                steps: ["Toast bread slices until crisp and golden.", "Mash avocado with lemon juice and salt.", "Spread avocado mixture on warm toast.", "Top with chili flakes and serve."],
                back: "breakfastrecipes.html?category=toastSandwiches"
            }),
            keywords: "toast avocado breakfast sandwich"
        },
        {
            label: "Turkey Cheese Sandwich",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Turkey Cheese Sandwich",
                category: "Toast & Sandwiches",
                photo: "turkey.jpeg",
                ingredients: ["2 slices whole grain bread", "70 g turkey slices", "30 g cheese", "30 g lettuce", "15 g tomato"],
                steps: ["Toast bread lightly if desired.", "Layer turkey, cheese, lettuce, and tomato.", "Close sandwich and press gently.", "Slice in half and serve."],
                back: "breakfastrecipes.html?category=toastSandwiches"
            }),
            keywords: "turkey cheese sandwich breakfast"
        },
        {
            label: "Berry Oat Bowl",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Berry Oat Bowl",
                category: "Oats & Bowls",
                photo: "berry.jpeg",
                ingredients: ["60 g rolled oats", "220 ml milk", "70 g mixed berries", "10 ml honey", "8 g chia seeds"],
                steps: ["Cook oats in milk on low heat for 5 to 6 minutes.", "Transfer oats to a serving bowl.", "Top with berries and chia seeds.", "Drizzle honey and serve warm."],
                back: "breakfastrecipes.html?category=oatsBowls"
            }),
            keywords: "berry oats bowl breakfast"
        },
        {
            label: "Yogurt Granola Bowl",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Yogurt Granola Bowl",
                category: "Oats & Bowls",
                photo: "yogurt.jpeg",
                ingredients: ["180 g Greek yogurt", "45 g granola", "80 g banana slices", "50 g strawberries", "8 ml honey"],
                steps: ["Add Greek yogurt to a serving bowl.", "Top with granola, banana, and strawberries.", "Drizzle a little honey on top.", "Serve immediately."],
                back: "breakfastrecipes.html?category=oatsBowls"
            }),
            keywords: "yogurt granola bowl breakfast"
        },
        {
            label: "Classic Pancakes",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Classic Pancakes",
                category: "Pancakes & Waffles",
                photo: "classic.jpeg",
                ingredients: ["120 g flour", "1 egg", "160 ml milk", "8 g baking powder", "15 g butter"],
                steps: ["Whisk flour, baking powder, egg, and milk into a batter.", "Heat a non-stick pan and grease lightly with butter.", "Pour batter and cook each side until golden.", "Serve with syrup or fruit."],
                back: "breakfastrecipes.html?category=pancakesWaffles"
            }),
            keywords: "classic pancakes breakfast"
        },
        {
            label: "Cinnamon Waffles",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Cinnamon Waffles",
                category: "Pancakes & Waffles",
                photo: "cinnamon.jpeg",
                ingredients: ["130 g flour", "1 egg", "170 ml milk", "4 g cinnamon", "10 ml vanilla extract"],
                steps: ["Whisk all ingredients into a smooth batter.", "Preheat and grease waffle iron.", "Cook batter in waffle iron until crisp.", "Top with fruit or yogurt and serve."],
                back: "breakfastrecipes.html?category=pancakesWaffles"
            }),
            keywords: "cinnamon waffles breakfast"
        },
        {
            label: "Masala Tea",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Masala Tea",
                category: "Hot Drinks",
                photo: "masala.jpeg",
                ingredients: ["250 ml water", "150 ml milk", "5 g tea leaves", "3 g fresh ginger", "2 cardamom pods"],
                steps: ["Boil water with ginger and cardamom.", "Add tea leaves and simmer for 2 minutes.", "Pour in milk and bring to a gentle boil.", "Strain into a cup and serve hot."],
                back: "drinksrecipes.html?category=hotDrinks"
            }),
            keywords: "masala tea hot drinks"
        },
        {
            label: "Hot Chocolate",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Hot Chocolate",
                category: "Hot Drinks",
                photo: "hotchocolate.jpeg",
                ingredients: ["250 ml milk", "15 g cocoa powder", "12 g sugar", "15 g dark chocolate", "1 ml vanilla extract"],
                steps: ["Heat milk in a saucepan over medium heat.", "Whisk in cocoa powder and sugar until smooth.", "Add chocolate and stir until melted.", "Finish with vanilla and serve warm."],
                back: "drinksrecipes.html?category=hotDrinks"
            }),
            keywords: "hot chocolate drinks"
        },
        {
            label: "Lemon Mint Cooler",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Lemon Mint Cooler",
                category: "Cold Drinks",
                photo: "lemonmint.jpeg",
                ingredients: ["250 ml cold water", "30 ml lemon juice", "10 g sugar", "8 g fresh mint", "1 cup ice cubes"],
                steps: ["Stir lemon juice and sugar in cold water.", "Crush mint leaves lightly and add to the drink.", "Add ice cubes and mix well.", "Serve immediately."],
                back: "drinksrecipes.html?category=coldDrinks"
            }),
            keywords: "lemon mint cooler cold drinks"
        },
        {
            label: "Iced Coffee",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Iced Coffee",
                category: "Cold Drinks",
                photo: "ice.jpeg",
                ingredients: ["120 ml strong coffee", "140 ml cold milk", "8 g sugar", "1 cup ice cubes", "2 ml vanilla extract"],
                steps: ["Brew coffee and cool it completely.", "Blend coffee, milk, sugar, and vanilla.", "Fill a glass with ice and pour the mixture.", "Serve chilled."],
                back: "drinksrecipes.html?category=coldDrinks"
            }),
            keywords: "iced coffee cold drinks"
        },
        {
            label: "Mango Banana Smoothie",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Mango Banana Smoothie",
                category: "Smoothies",
                photo: "mangobanana.jpeg",
                ingredients: ["120 g mango chunks", "1 banana", "180 g yogurt", "100 ml milk", "8 ml honey"],
                steps: ["Add mango, banana, yogurt, and milk to blender.", "Blend until smooth and creamy.", "Taste and add honey if needed.", "Pour into a glass and serve cold."],
                back: "drinksrecipes.html?category=smoothies"
            }),
            keywords: "mango banana smoothie drinks"
        },
        {
            label: "Berry Yogurt Smoothie",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Berry Yogurt Smoothie",
                category: "Smoothies",
                photo: "berrysmo.jpeg",
                ingredients: ["100 g mixed berries", "170 g yogurt", "90 ml milk", "10 g chia seeds", "8 ml honey"],
                steps: ["Blend berries, yogurt, and milk.", "Add chia seeds and honey, then pulse briefly.", "Adjust thickness with a little extra milk if needed.", "Serve chilled."],
                back: "drinksrecipes.html?category=smoothies"
            }),
            keywords: "berry yogurt smoothie drinks"
        },
        {
            label: "Virgin Mojito",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Virgin Mojito",
                category: "Mocktails",
                photo: "moj.jpeg",
                ingredients: ["30 ml lime juice", "10 g sugar", "10 g mint leaves", "180 ml sparkling water", "1 cup ice cubes"],
                steps: ["Muddle mint leaves with sugar and lime juice.", "Add ice cubes to a serving glass.", "Pour sparkling water and stir gently.", "Garnish with mint and serve."],
                back: "drinksrecipes.html?category=mocktails"
            }),
            keywords: "virgin mojito mocktail drinks"
        },
        {
            label: "Sunrise Cooler",
            type: "Recipe",
            url: buildRecipeDetailsUrl({
                title: "Sunrise Cooler",
                category: "Mocktails",
                photo: "sunrise.jpeg",
                ingredients: ["180 ml orange juice", "25 ml pomegranate syrup", "15 ml lemon juice", "1 cup ice cubes", "1 orange slice"],
                steps: ["Fill glass with ice and pour orange juice.", "Add lemon juice and stir lightly.", "Slowly pour pomegranate syrup to create layers.", "Garnish with orange slice and serve."],
                back: "drinksrecipes.html?category=mocktails"
            }),
            keywords: "sunrise cooler mocktail drinks"
        }
    ];

    const searchWrap = document.createElement("div");
    searchWrap.className = "global-recipe-search-wrap";
    searchWrap.innerHTML = ""
        + '<input id="global-recipe-search-input" type="text" placeholder="' + escapeHtml(translateValue("Search recipes or categories...", preferredLanguage)) + '">'
        + '<div id="global-recipe-search-results" class="global-recipe-search-results hidden"></div>';

    const searchInput = searchWrap.querySelector("#global-recipe-search-input");
    const searchResults = searchWrap.querySelector("#global-recipe-search-results");

    function hideResults() {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
    }

    function renderResults(matches) {
        if (!matches.length) {
            searchResults.innerHTML = '<div class="global-recipe-search-empty">' + escapeHtml(translateValue("No matches found", preferredLanguage)) + "</div>";
            searchResults.classList.remove("hidden");
            return;
        }

        searchResults.innerHTML = matches.slice(0, 7).map(function (item) {
            return '<a class="global-recipe-search-item" href="' + item.url + '">'
                + '<span class="global-recipe-search-label">' + escapeHtml(translateValue(item.label, preferredLanguage)) + "</span>"
                + '<span class="global-recipe-search-type">' + escapeHtml(translateValue(item.type, preferredLanguage)) + "</span>"
                + "</a>";
        }).join("");
        searchResults.classList.remove("hidden");
    }

    function normalizeText(value) {
        return value.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
    }

    function getMatchScore(item, normalizedQuery) {
        const normalizedLabel = normalizeText(item.label);
        const normalizedKeywords = normalizeText(item.keywords || "");
        const localizedLabel = normalizeText(translateValue(item.label, preferredLanguage));
        const localizedType = normalizeText(translateValue(item.type, preferredLanguage));
        const isRecipe = item.type === "Recipe";

        if (normalizedLabel === normalizedQuery || localizedLabel === normalizedQuery) {
            return isRecipe ? 400 : 300;
        }
        if (normalizedLabel.indexOf(normalizedQuery) === 0 || localizedLabel.indexOf(normalizedQuery) === 0) {
            return isRecipe ? 260 : 200;
        }
        if (normalizedLabel.indexOf(normalizedQuery) !== -1 || localizedLabel.indexOf(normalizedQuery) !== -1) {
            return isRecipe ? 220 : 160;
        }
        if (normalizedKeywords.indexOf(normalizedQuery) !== -1) {
            return isRecipe ? 140 : 100;
        }
        if (localizedType.indexOf(normalizedQuery) !== -1) {
            return isRecipe ? 80 : 60;
        }
        return -1;
    }

    function getMatches(query) {
        const normalized = normalizeText(query);
        if (!normalized) {
            return [];
        }
        return searchIndex.map(function (item, index) {
            return {
                item: item,
                score: getMatchScore(item, normalized),
                index: index
            };
        }).filter(function (entry) {
            return entry.score >= 0;
        }).sort(function (left, right) {
            if (right.score !== left.score) {
                return right.score - left.score;
            }
            return left.index - right.index;
        }).map(function (entry) {
            return entry.item;
        });
    }

    function findExactRecipe(query) {
        const normalized = normalizeText(query);
        if (!normalized) {
            return null;
        }
        const recipeAliases = {
            "veggie omelet": ["veggie omlette", "veggie omelette"],
            "scrambled eggs toast": ["scramble eggs toast"],
            "cinnamon waffles": ["cinnamon waffels"],
            "berry yogurt smoothie": ["berry yougrt smoothie"]
        };
        return searchIndex.find(function (item) {
            if (item.type !== "Recipe") {
                return false;
            }
            const labelMatch = normalizeText(item.label) === normalized;
            if (labelMatch) {
                return true;
            }
            const aliases = recipeAliases[normalizeText(item.label)] || [];
            return aliases.indexOf(normalized) !== -1;
        }) || null;
    }

    let autoOpenTimer = null;

    searchInput.addEventListener("input", function () {
        const matches = getMatches(searchInput.value);
        renderResults(matches);
        if (autoOpenTimer) {
            clearTimeout(autoOpenTimer);
        }
        autoOpenTimer = setTimeout(function () {
            const exactRecipe = findExactRecipe(searchInput.value);
            if (exactRecipe) {
                window.location.href = exactRecipe.url;
            }
        }, 450);
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") {
            return;
        }
        event.preventDefault();
        const exactRecipe = findExactRecipe(searchInput.value);
        if (exactRecipe) {
            window.location.href = exactRecipe.url;
            return;
        }
        const matches = getMatches(searchInput.value);
        if (!matches.length) {
            return;
        }
        window.location.href = matches[0].url;
    });

    document.addEventListener("click", function (event) {
        if (!searchWrap.contains(event.target)) {
            hideResults();
        }
    });

    searchWrap.addEventListener("click", function (event) {
        const clickedItem = event.target.closest(".global-recipe-search-item");
        if (!clickedItem) {
            return;
        }
        hideResults();
    });

    const topNav = document.querySelector(".top-nav");
    if (topNav) {
        const menuInNav = topNav.querySelector(".menu");
        if (menuInNav) {
            topNav.insertBefore(searchWrap, menuInNav);
        } else {
            topNav.appendChild(searchWrap);
        }
    } else {
        body.appendChild(searchWrap);
    }

    applyLanguageToDocument(preferredLanguage);
    applyLanguageToIcons(preferredLanguage);
})();
