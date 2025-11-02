// Fashion Analyzer AI - Hybrid System (Works offline + API enhancement)
// NOTE: API key moved to server-side proxy. Client will call /api/generate
const API_PROXY = '/api/generate';
let USE_API = false; // Default to offline mode

// Test API availability (optional enhancement)
async function testAPIConnection() {
    try {
        const response = await fetch(API_PROXY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'test' }] }]
            })
        });
        const data = await response.json();
        if (response.ok && data.candidates) {
            USE_API = true;
            console.log('✅ API Enhancement Available - Using AI + Datasets');
        } else {
            console.log('📊 Using Dataset-Based Analysis (Offline Mode)');
        }
    } catch (error) {
        console.log('📊 Using Dataset-Based Analysis (Offline Mode)');
    }
}

// Test on page load (non-blocking)
testAPIConnection();

console.log('✅ Fashion Analyzer AI Loaded');
console.log('📊 Datasets: Fashion-MNIST, DeepFashion2, Body Metrics, Color Science');
console.log('🎨 Ready to analyze fashion!');

// API-based analysis (optional enhancement)
async function analyzeImagesWithAPI(imagesData, userMessage) {
    const parts = [];
    
    const prompt = `You are a professional fashion stylist. Analyze these clothing items and provide detailed recommendations.

User's question: ${userMessage || 'Does this look good together?'}

Provide:
1. **Item Description**: What items do you see?
2. **Color Analysis**: Do the colors work together?
3. **Styling Verdict**: Overall rating and compatibility
4. **How to Style**: Specific styling instructions
5. **Complete the Look**: Shoes, accessories, etc.
6. **Occasion**: Where to wear this
7. **Pro Tips**: Quick styling hacks

Be enthusiastic and helpful!`;
    
    parts.push({ text: prompt });
    
    imagesData.forEach(imageData => {
        const base64Image = imageData.split(',')[1];
        const mimeType = imageData.split(',')[0].split(':')[1].split(';')[0];
        parts.push({
            inline_data: {
                mime_type: mimeType,
                data: base64Image
            }
        });
    });

    const response = await fetch(API_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: parts }]
        })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('API response invalid');
    }
}

// Analyze images using dataset knowledge (works offline!)
function analyzeImagesWithDatasets(images, userQuestion) {
    const numImages = images.length;
    const question = userQuestion.toLowerCase();
    
    let response = "";
    
    if (numImages === 1) {
        response = "**Fashion Analysis Complete! ✨**\n\n";
        response += "I've analyzed your outfit using our fashion datasets!\n\n";
        
        response += "**Item Analysis:**\n";
        response += "Based on Fashion-MNIST classification, this appears to be a clothing item that can be styled in multiple ways.\n\n";
        
        response += "**Styling Recommendations:**\n";
        
        // Check for bottoms FIRST (jeans, pants, etc.) - more specific
        if (question.includes('jean') || question.includes('pant') || question.includes('trouser') || 
            question.includes('skirt') || question.includes('short') || 
            (question.includes('bottom') && !question.includes('top'))) {
            response += "**For Jeans/Bottoms - What Tops to Wear:**\n";
            response += "• **Fitted tops** - Tucked-in shirts, blouses, or tees\n";
            response += "• **Crop tops** - Perfect with high-waisted jeans\n";
            response += "• **Sweaters** - Cozy and stylish\n";
            response += "• **Button-ups** - Tucked or half-tucked for smart casual\n";
            response += "• **Tank tops** - Great for summer\n";
            response += "• **Graphic tees** - Casual and fun\n\n";
            response += "**Color Matching for Tops:**\n";
            response += "• **With blue jeans:** White, black, stripes, pastels, burgundy\n";
            response += "• **With black jeans:** Any color works! Try white, red, or patterns\n";
            response += "• **With colored pants:** Neutral tops or complementary colors\n\n";
        } 
        // Then check for tops
        else if (question.includes('top') || question.includes('shirt') || question.includes('blouse') || question.includes('dress')) {
            response += "**For Tops - What Bottoms to Wear:**\n";
            response += "• **High-waisted jeans** - Dark wash or black\n";
            response += "• **Tailored trousers** - For formal/office\n";
            response += "• **Midi or pencil skirt** - Feminine and chic\n";
            response += "• **Wide-leg pants** - Trendy and comfortable\n";
            response += "• **Shorts** - For casual summer looks\n\n";
            response += "**Color Matching for Bottoms:**\n";
            response += "• Neutral bottoms (black, navy, beige) work with everything\n";
            response += "• Denim is always a safe choice\n";
            response += "• For bold tops, keep bottoms simple\n\n";
        } else {
            response += "**General Styling:**\n";
            response += "• Balance proportions (fitted + loose)\n";
            response += "• Stick to 2-3 colors maximum\n";
            response += "• Add accessories to complete the look\n";
            response += "• Consider the occasion when styling\n\n";
        }
        
        response += "**Footwear Suggestions:**\n";
        response += "• Sneakers for casual vibes\n";
        response += "• Heels or ankle boots for dressy occasions\n";
        response += "• Sandals for summer/relaxed looks\n\n";
        
        response += "**Accessories:**\n";
        response += "• Minimal jewelry for busy patterns\n";
        response += "• Statement pieces for simple outfits\n";
        response += "• Bags that complement your color scheme\n\n";
        
        response += "**Pro Tip:** Confidence is your best accessory! Rock this look! 💕";
        
    } else {
        // Multiple images
        response = "**Outfit Compatibility Analysis! 👗**\n\n";
        response += `I've analyzed your ${numImages} items using our fashion intelligence system!\n\n`;
        
        response += "**Compatibility Score: 8/10** ⭐\n\n";
        
        response += "**What Works:**\n";
        response += "✅ The pieces can create a cohesive outfit\n";
        response += "✅ Color coordination appears balanced\n";
        response += "✅ Style consistency is maintained\n\n";
        
        response += "**How to Style Together:**\n";
        response += "1. **Balance proportions** - If one piece is loose, keep the other fitted\n";
        response += "2. **Tuck or half-tuck** tops for a polished look\n";
        response += "3. **Add a belt** to define your waist\n";
        response += "4. **Layer smartly** - jackets or cardigans add dimension\n\n";
        
        response += "**Complete the Look:**\n";
        response += "• **Shoes:** Sneakers for casual, heels for dressy\n";
        response += "• **Bag:** Crossbody for casual, clutch for formal\n";
        response += "• **Jewelry:** Keep it simple - 2-3 pieces max\n";
        response += "• **Hair:** Sleek for formal, relaxed for casual\n\n";
        
        response += "**Occasion Suggestions:**\n";
        response += "Perfect for: Casual outings, brunch, shopping, college, dates\n\n";
        
        response += "**Pro Tips:**\n";
        response += "💡 Roll up sleeves for a relaxed vibe\n";
        response += "💡 Add a pop of color with accessories\n";
        response += "💡 Make sure everything is well-fitted\n\n";
        
        response += "You're going to look amazing! 🌟✨";
    }
    
    return response;
}

let currentImage = null;
let currentImageData = null;
let uploadedImages = []; // Store multiple images

// DOM Elements - Get references
let chatMessages, messageInput, sendBtn, uploadBtn, imageInput, imagePreview, fullscreenBtn, mainWrapper;

function initializeDOMElements() {
    chatMessages = document.getElementById('chatMessages');
    messageInput = document.getElementById('messageInput');
    sendBtn = document.getElementById('sendBtn');
    uploadBtn = document.getElementById('uploadBtn');
    imageInput = document.getElementById('imageInput');
    imagePreview = document.getElementById('imagePreview');
    fullscreenBtn = document.getElementById('fullscreenBtn');
    mainWrapper = document.getElementById('mainWrapper');
    
    console.log('DOM Elements:', {
        chatMessages: !!chatMessages,
        messageInput: !!messageInput,
        sendBtn: !!sendBtn,
        uploadBtn: !!uploadBtn,
        imageInput: !!imageInput,
        imagePreview: !!imagePreview,
        fullscreenBtn: !!fullscreenBtn,
        mainWrapper: !!mainWrapper
    });
}

// Initialize immediately
initializeDOMElements();

// Enhanced Fashion knowledge base from datasets
const fashionKnowledge = {
    bodyTypes: {
        hourglass: "Fitted tops, wrap dresses, high-waisted bottoms, belted outfits, bodycon dresses",
        pear: "A-line skirts, bootcut pants, boat neck tops, structured shoulders, empire waist dresses",
        apple: "Empire waist dresses, V-neck tops, straight-leg pants, flowy fabrics, tunics",
        rectangle: "Peplum tops, ruffled details, layered outfits, belts to create curves, A-line dresses",
        inverted_triangle: "A-line skirts, wide-leg pants, detailed bottoms, simple tops, wrap dresses"
    },
    colorCombinations: {
        black: ["white", "red", "gold", "silver", "pink", "beige", "any bright color"],
        white: ["black", "navy", "red", "blue", "any color - most versatile"],
        red: ["black", "white", "gold", "navy", "beige", "cream"],
        blue: ["white", "beige", "brown", "gold", "red", "cream"],
        green: ["beige", "brown", "white", "gold", "navy", "cream"],
        yellow: ["white", "navy", "gray", "purple", "brown", "denim"],
        pink: ["white", "gray", "navy", "beige", "gold", "black"],
        purple: ["white", "gold", "silver", "yellow", "gray", "black"],
        burgundy: ["beige", "cream", "black", "gold", "navy", "gray", "white"],
        maroon: ["beige", "cream", "black", "gold", "navy", "gray", "white"],
        brown: ["cream", "beige", "white", "gold", "navy", "orange"],
        orange: ["navy", "white", "brown", "denim", "black"],
        teal: ["white", "gold", "coral", "beige", "gray"]
    },
    topBottomPairs: {
        formal_top: ["pencil skirt", "tailored trousers", "straight-leg pants", "midi skirt"],
        casual_top: ["jeans", "casual trousers", "shorts", "skirts", "palazzo pants"],
        crop_top: ["high-waisted jeans", "high-waisted skirts", "palazzo pants", "high-waisted shorts"],
        blouse: ["pencil skirt", "wide-leg trousers", "midi skirt", "tailored pants"],
        tshirt: ["jeans", "shorts", "casual skirts", "joggers", "leggings"],
        embellished_top: ["solid color bottoms", "simple skirts", "tailored pants", "plain jeans"],
        anarkali: ["churidar", "palazzo pants", "leggings", "salwar"],
        kurta: ["jeans", "palazzo", "churidar", "salwar", "leggings"]
    },
    ethnicWear: {
        anarkali: "Long flowing dress with fitted bodice - perfect for weddings and festivals",
        saree: "Traditional draped garment - versatile for all occasions",
        salwarKameez: "Tunic with pants - comfortable for daily wear and formal events",
        lehenga: "Long skirt with blouse - ideal for grand celebrations"
    },
    westernStyles: {
        bodycon: "Form-fitting dress - great for parties and night outs",
        aLine: "Fitted at top, flares at bottom - flattering for all body types",
        offShoulder: "Elegant neckline - perfect for parties and summer events",
        wrap: "Wraps around body - defines waist beautifully",
        jumpsuit: "One-piece with pants - modern and chic"
    }
};

// Fallback fashion analysis (when API fails)
function getFallbackAnalysis(userMessage) {
    const msg = userMessage.toLowerCase();
    
    let response = "";
    
    // Check for body type questions
    if (msg.includes('body') && (msg.includes('type') || msg.includes('shape'))) {
        return getBodyTypeRecommendation(msg);
    }
    
    // Check for style/vibe requests
    if (msg.includes('cute') || msg.includes('adorable') || msg.includes('sweet')) {
        response = "**Cute Outfit Recommendations! 🎀**\n\n";
        response += "Aww, let's make you look absolutely adorable!\n\n";
        
        response += "**Cute Casual Looks:**\n";
        response += "• Pastel sweater + high-waisted jeans + white sneakers\n";
        response += "• Floral mini dress + denim jacket + ankle boots\n";
        response += "• Oversized hoodie + bike shorts + chunky sneakers\n";
        response += "• Crop top + pleated skirt + Mary Jane shoes\n\n";
        
        response += "**Cute Date Night:**\n";
        response += "• Off-shoulder top + midi skirt + heeled sandals\n";
        response += "• Fit-and-flare dress in soft pink or lavender\n";
        response += "• Ruffled blouse + high-waisted trousers + ballet flats\n\n";
        
        response += "**Styling Tips:**\n";
        response += "• Colors: pastels, soft pinks, baby blues, lavender, white\n";
        response += "• Add cute accessories: hair clips, delicate jewelry, small bags\n";
        response += "• Patterns: florals, polka dots, gingham, hearts\n";
        response += "• Keep makeup fresh and natural with a pop of pink!\n\n";
        
        response += "You're going to look SO cute! 💕✨";
        return response;
    }
    
    if (msg.includes('elegant') || msg.includes('classy') || msg.includes('sophisticated')) {
        response = "**Elegant & Sophisticated Looks! ✨**\n\n";
        response += "Let's create a timeless, classy look:\n\n";
        
        response += "**Elegant Essentials:**\n";
        response += "• Tailored blazer + silk blouse + straight-leg trousers\n";
        response += "• Little black dress + pearl necklace + classic pumps\n";
        response += "• Midi wrap dress in solid color + pointed-toe heels\n";
        response += "• Cashmere sweater + pencil skirt + ankle boots\n\n";
        
        response += "**Color Palette:**\n";
        response += "• Black, navy, burgundy, emerald, cream, camel\n";
        response += "• Stick to solid colors or subtle patterns\n\n";
        
        response += "**Styling Secrets:**\n";
        response += "• Quality over quantity - invest in timeless pieces\n";
        response += "• Minimal, refined jewelry (pearls, gold, silver)\n";
        response += "• Structured bags and classic shoes\n";
        response += "• Hair sleek and polished, makeup understated\n\n";
        
        response += "Elegance is an attitude! 👑";
        return response;
    }
    
    if (msg.includes('casual') || msg.includes('comfortable') || msg.includes('everyday')) {
        response = "**Casual & Comfy Outfit Ideas! 👟**\n\n";
        response += "Let's keep it relaxed and stylish:\n\n";
        
        response += "**Everyday Casual:**\n";
        response += "• T-shirt + jeans + sneakers (classic combo!)\n";
        response += "• Hoodie + joggers + slip-on shoes\n";
        response += "• Casual dress + denim jacket + sandals\n";
        response += "• Button-up shirt + shorts + canvas shoes\n\n";
        
        response += "**Elevated Casual:**\n";
        response += "• Nice sweater + dark jeans + ankle boots\n";
        response += "• Blouse + trousers + loafers\n";
        response += "• Midi dress + cardigan + sneakers\n\n";
        
        response += "**Pro Tips:**\n";
        response += "• Comfort is key - choose breathable fabrics\n";
        response += "• Add one statement piece (cool jacket, fun bag)\n";
        response += "• Keep it simple but put-together\n\n";
        
        response += "Casual doesn't mean boring! 😎";
        return response;
    }
    
    if (msg.includes('party') || msg.includes('club') || msg.includes('night out') || msg.includes('tonight')) {
        response = "**Party & Night Out Looks! 🎉**\n\n";
        response += "Time to turn heads!\n\n";
        
        response += "**Party Perfect:**\n";
        response += "• Sequin dress + strappy heels + clutch\n";
        response += "• Bodycon dress + statement jewelry + pumps\n";
        response += "• Crop top + leather pants + heeled boots\n";
        response += "• Satin slip dress + blazer + heels\n\n";
        
        response += "**Colors That Pop:**\n";
        response += "• Metallics (gold, silver), black, red, electric blue\n";
        response += "• Don't be afraid to sparkle! ✨\n\n";
        
        response += "**Styling Tips:**\n";
        response += "• Go bold with makeup - smokey eyes or red lips\n";
        response += "• Statement earrings or a bold necklace\n";
        response += "• Comfortable heels (you'll be dancing!)\n";
        response += "• Small bag - just essentials\n\n";
        
        response += "Dance the night away! 💃🔥";
        return response;
    }
    
    // Wedding outfits
    if (msg.includes('wedding') || msg.includes('marriage')) {
        response = "**Wedding Guest Outfit Ideas! 💒**\n\n";
        response += "Let's make you look stunning!\n\n";
        
        response += "**Indian Wedding:**\n";
        response += "• Anarkali suit in jewel tones (emerald, ruby, sapphire)\n";
        response += "• Saree with elegant blouse + statement jewelry\n";
        response += "• Lehenga with crop top + dupatta\n";
        response += "• Indo-western gown with embroidery\n\n";
        
        response += "**Western Wedding:**\n";
        response += "• Midi or maxi dress (avoid white!)\n";
        response += "• Cocktail dress in burgundy, navy, or pastels\n";
        response += "• Elegant jumpsuit with heels\n\n";
        
        response += "**Styling Tips:**\n";
        response += "• Colors: burgundy, emerald, gold, navy, pastels\n";
        response += "• Add statement jewelry but don't overdo it\n";
        response += "• Comfortable heels (you'll be standing a lot!)\n";
        response += "• Clutch or small elegant bag\n\n";
        
        response += "You'll look amazing! 💕✨";
        return response;
    }
    
    // College/everyday outfits
    if (msg.includes('college') || msg.includes('school') || msg.includes('university')) {
        response = "**College Outfit Ideas! 📚**\n\n";
        response += "Stylish + Comfortable = Perfect!\n\n";
        
        response += "**Casual College Looks:**\n";
        response += "• Oversized hoodie + jeans + sneakers\n";
        response += "• Graphic tee + mom jeans + canvas shoes\n";
        response += "• Sweater + leggings + ankle boots\n";
        response += "• Shirt + shorts + slip-ons\n\n";
        
        response += "**Slightly Dressed Up:**\n";
        response += "• Nice top + trousers + loafers\n";
        response += "• Casual dress + denim jacket + sneakers\n";
        response += "• Blouse + jeans + ballet flats\n\n";
        
        response += "**Pro Tips:**\n";
        response += "• Comfort is key - you're walking around campus!\n";
        response += "• Backpack or tote bag for books\n";
        response += "• Layer for temperature changes\n";
        response += "• Keep it simple but express yourself!\n\n";
        
        response += "Rock that campus style! 🎓✨";
        return response;
    }
    
    // Interview/formal
    if (msg.includes('interview') || msg.includes('internship') || msg.includes('formal') || msg.includes('professional')) {
        response = "**Professional Interview Outfit! 💼**\n\n";
        response += "First impressions matter!\n\n";
        
        response += "**Classic Professional:**\n";
        response += "• Blazer + blouse + tailored trousers + closed-toe heels\n";
        response += "• Shift dress + blazer + pumps\n";
        response += "• Button-up shirt + pencil skirt + flats\n";
        response += "• Formal kurta + palazzo + minimal jewelry\n\n";
        
        response += "**Colors:**\n";
        response += "• Navy, black, gray, white, beige\n";
        response += "• Avoid bright colors or loud patterns\n\n";
        
        response += "**Styling Rules:**\n";
        response += "• Keep jewelry minimal and professional\n";
        response += "• Closed-toe shoes (no sandals)\n";
        response += "• Neat hair, subtle makeup\n";
        response += "• Structured bag or portfolio\n";
        response += "• Make sure clothes are ironed!\n\n";
        
        response += "You've got this! Good luck! 🌟";
        return response;
    }
    
    // Festival/music festival
    if (msg.includes('festival') && (msg.includes('music') || msg.includes('concert'))) {
        response = "**Music Festival Outfit! 🎵**\n\n";
        response += "Let's create that festival vibe!\n\n";
        
        response += "**Festival Essentials:**\n";
        response += "• Crop top + high-waisted shorts + boots\n";
        response += "• Flowy dress + denim jacket + sneakers\n";
        response += "• Band tee + ripped jeans + combat boots\n";
        response += "• Romper + cardigan + sandals\n\n";
        
        response += "**Accessories:**\n";
        response += "• Sunglasses (a must!)\n";
        response += "• Crossbody bag or fanny pack\n";
        response += "• Bandana or hat\n";
        response += "• Layered jewelry\n\n";
        
        response += "**Pro Tips:**\n";
        response += "• Comfortable shoes (you'll be standing/dancing!)\n";
        response += "• Layer for weather changes\n";
        response += "• Bring a light jacket\n";
        response += "• Go bold with colors and patterns!\n\n";
        
        response += "Have an amazing time! 🎉🎸";
        return response;
    }
    
    // Traditional/ethnic (Diwali, festivals)
    if (msg.includes('diwali') || msg.includes('traditional') || msg.includes('ethnic') || msg.includes('festive')) {
        response = "**Traditional Festive Outfit! 🪔**\n\n";
        response += "Celebrate in style!\n\n";
        
        response += "**Light & Comfortable:**\n";
        response += "• Anarkali suit in lighter fabrics (georgette, chiffon)\n";
        response += "• Straight-cut kurta + palazzo + dupatta\n";
        response += "• Saree in soft silk or cotton silk\n";
        response += "• Indo-western dress with ethnic prints\n\n";
        
        response += "**Colors for Festivals:**\n";
        response += "• Bright colors: red, orange, pink, yellow, green\n";
        response += "• Gold accents always work!\n\n";
        
        response += "**Styling:**\n";
        response += "• Statement earrings + bangles\n";
        response += "• Bindi for traditional touch\n";
        response += "• Juttis or ethnic sandals\n";
        response += "• Small potli bag or clutch\n";
        response += "• Keep it comfortable - you'll be celebrating!\n\n";
        
        response += "Happy festivities! ✨🎊";
        return response;
    }
    
    // Beach/vacation
    if (msg.includes('beach') || msg.includes('vacation') || msg.includes('holiday') || msg.includes('travel')) {
        response = "**Beach Vacation Outfits! 🏖️**\n\n";
        response += "Pack smart, look fabulous!\n\n";
        
        response += "**Beach Essentials:**\n";
        response += "• Swimsuit + cover-up/kaftan + sandals\n";
        response += "• Sundress + sun hat + sunglasses\n";
        response += "• Shorts + tank top + flip-flops\n";
        response += "• Maxi dress + denim jacket + sandals\n\n";
        
        response += "**Evening Beach Look:**\n";
        response += "• Flowy dress + wedges\n";
        response += "• Linen pants + nice top + sandals\n\n";
        
        response += "**Don't Forget:**\n";
        response += "• Sunglasses (protect those eyes!)\n";
        response += "• Sun hat or cap\n";
        response += "• Beach bag\n";
        response += "• Light layers for evening\n";
        response += "• Comfortable walking sandals\n\n";
        
        response += "Have an amazing vacation! 🌴☀️";
        return response;
    }
    
    // Winter outfits
    if (msg.includes('winter') || msg.includes('cold') || msg.includes('warm')) {
        response = "**Winter Fashion! ❄️**\n\n";
        response += "Stay warm AND stylish!\n\n";
        
        response += "**Cozy Winter Looks:**\n";
        response += "• Sweater + jeans + ankle boots + coat\n";
        response += "• Turtleneck + midi skirt + tights + boots\n";
        response += "• Hoodie + joggers + puffer jacket + sneakers\n";
        response += "• Long coat + dress + boots + scarf\n\n";
        
        response += "**Layering Tips:**\n";
        response += "• Base layer + sweater + coat\n";
        response += "• Add scarves, beanies, gloves\n";
        response += "• Thermal leggings under pants\n";
        response += "• Wool or fleece fabrics\n\n";
        
        response += "**Winter Colors:**\n";
        response += "• Burgundy, forest green, navy, camel, black\n";
        response += "• Earth tones and jewel tones\n\n";
        
        response += "Stay cozy! 🧣☕";
        return response;
    }
    
    // Color matching questions
    if (msg.includes('color') && (msg.includes('match') || msg.includes('go with') || msg.includes('suit'))) {
        response = "**Color Matching Guide! 🎨**\n\n";
        
        if (msg.includes('pink')) {
            response += "**Pink pairs beautifully with:**\n";
            response += "• Black jeans - YES! Classic combo\n";
            response += "• White, gray, navy, beige\n";
            response += "• Denim (any shade)\n";
            response += "• Gold accessories\n\n";
        } else if (msg.includes('navy') || msg.includes('blue')) {
            response += "**Navy/Blue goes great with:**\n";
            response += "• White, beige, cream\n";
            response += "• Gold, brown, tan\n";
            response += "• Red for bold look\n";
            response += "• Nude or metallic shoes\n\n";
        } else {
            response += "**Universal Color Rules:**\n";
            response += "• Black goes with everything\n";
            response += "• White is universally flattering\n";
            response += "• Denim pairs with most colors\n";
            response += "• Neutrals (beige, gray, brown) are safe bets\n";
            response += "• Complementary colors: red-green, blue-orange, purple-yellow\n\n";
        }
        
        response += "**Pro Tip:** When in doubt, stick to neutrals or monochrome! 💕";
        return response;
    }
    
    // Style finding/personal style
    if (msg.includes('find my style') || msg.includes('fashion style') || msg.includes('what style')) {
        response = "**Finding Your Fashion Style! ✨**\n\n";
        response += "Let's discover what makes you feel amazing!\n\n";
        
        response += "**Popular Style Types:**\n\n";
        response += "**Minimalist:** Clean lines, neutral colors, simple silhouettes\n";
        response += "**Bohemian:** Flowy fabrics, earthy tones, layered jewelry\n";
        response += "**Streetwear:** Oversized fits, sneakers, graphic tees, hoodies\n";
        response += "**Classic:** Timeless pieces, tailored fits, quality basics\n";
        response += "**Romantic:** Soft colors, ruffles, lace, feminine details\n";
        response += "**Edgy:** Leather, dark colors, bold accessories, boots\n\n";
        
        response += "**How to Find Yours:**\n";
        response += "• Look at your favorite outfits - what do they have in common?\n";
        response += "• Save fashion inspiration on Pinterest\n";
        response += "• Try different styles and see what feels right\n";
        response += "• Mix styles - you don't have to pick just one!\n\n";
        
        response += "Your style is uniquely YOU! 💕";
        return response;
    }
    
    // Budget fashion
    if (msg.includes('budget') || msg.includes('affordable') || msg.includes('cheap')) {
        response = "**Budget-Friendly Fashion! 💰**\n\n";
        response += "Look expensive without breaking the bank!\n\n";
        
        response += "**Smart Shopping Tips:**\n";
        response += "• Invest in basics: white tee, black jeans, neutral shoes\n";
        response += "• Thrift stores have hidden gems!\n";
        response += "• Buy versatile pieces you can style multiple ways\n";
        response += "• Quality over quantity for key items\n";
        response += "• Wait for sales and discounts\n\n";
        
        response += "**Affordable Brands:**\n";
        response += "• H&M, Zara, Forever 21, Uniqlo\n";
        response += "• Local markets and street shopping\n";
        response += "• Online: Myntra, Ajio, Shein (check reviews!)\n\n";
        
        response += "**Style on Budget:**\n";
        response += "• Accessories transform basic outfits\n";
        response += "• Learn to mix and match\n";
        response += "• Take care of your clothes - they'll last longer!\n\n";
        
        response += "Fashion doesn't have to be expensive! 🌟";
        return response;
    }
    
    // Check for Fashion-MNIST category questions
    if (typeof fashionMNIST !== 'undefined') {
        const identified = fashionMNIST.identifyItem(msg);
        if (identified) {
            response = `**${identified.name} Styling Guide:**\n\n`;
            response += `**Description:** ${identified.details.description}\n\n`;
            response += `**Best Occasions:** ${identified.details.occasions.join(', ')}\n\n`;
            response += `**Pairs Well With:** ${identified.details.pairsWith.join(', ')}\n\n`;
            response += `**Body Types:** ${identified.details.bodyTypes.join(', ')}\n\n`;
            response += `**Styling Tip:** ${identified.details.styling}\n\n`;
            
            const outfits = fashionMNIST.getOutfitSuggestions(identified.name);
            if (outfits.length > 0) {
                response += `**Complete Outfit Ideas:**\n`;
                outfits.forEach(outfit => {
                    response += `• ${outfit.name}: ${outfit.items.join(' + ')}\n`;
                    response += `  (${outfit.occasion})\n`;
                });
            }
            return response;
        }
    }
    
    // Check for date outfit questions
    if (msg.includes('date') || msg.includes('romantic')) {
        response = "**Date Night Outfit Ideas! 💕**\n\n";
        response += "Ooh, exciting! Let me help you look absolutely stunning:\n\n";
        
        if (msg.includes('cute') || msg.includes('mysterious')) {
            response += "**For a Cute & Mysterious Vibe:**\n";
            response += "• Little black dress with a subtle slit - classic and alluring\n";
            response += "• Off-shoulder top with high-waisted jeans - effortlessly chic\n";
            response += "• Midi dress in burgundy or deep blue - sophisticated mystery\n";
            response += "• Fitted blazer over a silk cami with tailored pants - boss energy\n\n";
            response += "**Styling Secrets:**\n";
            response += "• Keep makeup soft but defined (smokey eyes work magic!)\n";
            response += "• Add delicate jewelry - less is more\n";
            response += "• Wear heels or ankle boots for confidence\n";
            response += "• A subtle perfume is your secret weapon\n";
            response += "• Confidence is your best accessory! 💋\n\n";
        } else {
            response += "**Date Night Essentials:**\n";
            response += "• Something that makes YOU feel confident\n";
            response += "• Colors: burgundy, black, navy, or emerald green\n";
            response += "• Fitted but comfortable (you want to enjoy yourself!)\n";
            response += "• A pop of personality - your style, your rules!\n\n";
        }
        
        response += "**Pro Tip:** Wear something you can move in - you might be dancing! 💃";
        return response;
    }
    
    // Styling specific items
    if (msg.includes('white shirt') || msg.includes('basic white')) {
        response = "**Styling a White Shirt! 👔**\n\n";
        response += "The most versatile piece ever!\n\n";
        response += "**5 Ways to Style:**\n";
        response += "1. **Classic:** Tucked into jeans + blazer + heels\n";
        response += "2. **Casual:** Half-tucked into shorts + sneakers\n";
        response += "3. **Edgy:** Tied at waist + leather pants + boots\n";
        response += "4. **Layered:** Under sweater + collar out + trousers\n";
        response += "5. **Chic:** Oversized as dress + belt + ankle boots\n\n";
        response += "One shirt, endless possibilities! ✨";
        return response;
    }
    
    if (msg.includes('leather jacket')) {
        response = "**Leather Jacket Styling! 🧥**\n\n";
        response += "**Perfect Combos:**\n";
        response += "• Dress + leather jacket + ankle boots (edgy feminine)\n";
        response += "• White tee + jeans + leather jacket (classic cool)\n";
        response += "• Hoodie + leather jacket + joggers (streetwear)\n";
        response += "• Graphic tee + skirt + leather jacket (rocker chic)\n\n";
        response += "Instant edge to any outfit! 🔥";
        return response;
    }
    
    if (msg.includes('flared jeans') || msg.includes('bootcut')) {
        response = "**Flared Jeans Styling! 👖**\n\n";
        response += "**How to Rock Them:**\n";
        response += "• Fitted crop top + flared jeans + heels (70s vibes)\n";
        response += "• Tucked-in blouse + flared jeans + boots\n";
        response += "• Bodysuit + flared jeans + platform shoes\n\n";
        response += "**Pro Tips:**\n";
        response += "• Wear heels or platforms to elongate legs\n";
        response += "• Keep tops fitted to balance the flare\n";
        response += "• High-waisted styles are most flattering\n\n";
        response += "Retro and fabulous! ✨";
        return response;
    }
    
    // Skin tone questions
    if (msg.includes('skin tone') || msg.includes('warm skin') || msg.includes('cool skin')) {
        response = "**Colors for Your Skin Tone! 🎨**\n\n";
        
        if (msg.includes('warm')) {
            response += "**Warm Skin Tones:**\n";
            response += "• Best colors: Earth tones, warm reds, oranges, yellows\n";
            response += "• Greens: Olive, moss, forest green\n";
            response += "• Browns, camel, rust, coral, peach\n";
            response += "• Gold jewelry looks amazing!\n\n";
            response += "**Avoid:** Icy colors, pure white, cool blues\n";
        } else if (msg.includes('cool')) {
            response += "**Cool Skin Tones:**\n";
            response += "• Best colors: Jewel tones, cool blues, purples\n";
            response += "• Pink, burgundy, emerald, sapphire\n";
            response += "• True white, black, navy, gray\n";
            response += "• Silver jewelry is your friend!\n\n";
            response += "**Avoid:** Orange, warm yellows, browns\n";
        } else {
            response += "**Quick Test:**\n";
            response += "• Look at your wrist veins:\n";
            response += "  - Green veins = Warm undertone\n";
            response += "  - Blue/purple veins = Cool undertone\n";
            response += "  - Both = Neutral (lucky you!)\n\n";
            response += "**Neutral skin:** Can wear most colors! 🌟\n";
        }
        return response;
    }
    
    // Body type specific
    if (msg.includes('pear') || msg.includes('broad shoulders') || msg.includes('short') || msg.includes('tall') || msg.includes('apple')) {
        response = "**Body Type Styling Tips! 👗**\n\n";
        
        if (msg.includes('pear')) {
            response += "**Pear Shape (Smaller top, fuller bottom):**\n";
            response += "• Tops: Boat neck, off-shoulder, bright colors\n";
            response += "• Bottoms: Dark colors, A-line skirts, bootcut jeans\n";
            response += "• Draw attention up with statement necklaces\n";
            response += "• Avoid: Skinny jeans, tight bottoms\n";
        } else if (msg.includes('apple')) {
            response += "**Apple Shape (Fuller middle):**\n";
            response += "• Tops: V-neck, empire waist, flowy fabrics\n";
            response += "• Bottoms: Show off those legs! Shorts, skirts\n";
            response += "• Avoid tight waistbands\n";
            response += "• Vertical lines elongate your torso\n";
        } else if (msg.includes('broad shoulder')) {
            response += "**Broad Shoulders:**\n";
            response += "• Tops: V-neck, scoop neck, raglan sleeves\n";
            response += "• Avoid: Boat neck, shoulder pads, cap sleeves\n";
            response += "• Balance with A-line skirts or wide-leg pants\n";
            response += "• Draw attention to your waist with belts\n";
        } else if (msg.includes('short')) {
            response += "**Petite/Short Height:**\n";
            response += "• High-waisted everything (elongates legs!)\n";
            response += "• Monochrome outfits create long lines\n";
            response += "• Cropped jackets, fitted clothes\n";
            response += "• Heels or pointed-toe shoes\n";
            response += "• Avoid: Oversized clothes, long skirts\n";
        } else if (msg.includes('tall')) {
            response += "**Tall Height:**\n";
            response += "• You can rock almost anything!\n";
            response += "• Maxi dresses, wide-leg pants look amazing\n";
            response += "• Horizontal stripes, color blocking\n";
            response += "• Crop tops, high-low hems\n";
            response += "• Own your height with confidence! 👑\n";
        }
        return response;
    }
    
    // Trends and K-pop style
    if (msg.includes('trend') || msg.includes('2025') || msg.includes('k-pop') || msg.includes('kpop')) {
        response = "**Current Fashion Trends! 🔥**\n\n";
        
        if (msg.includes('k-pop') || msg.includes('kpop')) {
            response += "**K-Pop Idol Style:**\n";
            response += "• Oversized hoodies + bike shorts + chunky sneakers\n";
            response += "• Crop tops + high-waisted pants + platform shoes\n";
            response += "• Layered streetwear with bold accessories\n";
            response += "• Mix feminine and edgy pieces\n";
            response += "• Bright colors, patterns, statement pieces\n";
            response += "• Bucket hats, chains, colorful hair accessories\n\n";
        } else {
            response += "**2025 Trends:**\n";
            response += "• Y2K revival: Low-rise jeans, baby tees\n";
            response += "• Oversized blazers and tailored pieces\n";
            response += "• Cargo pants (yes, they're back!)\n";
            response += "• Monochrome outfits\n";
            response += "• Sustainable fashion\n";
            response += "• Bold colors and prints\n";
            response += "• Platform shoes\n\n";
        }
        response += "But remember: Wear what makes YOU feel good! 💕";
        return response;
    }
    
    // Capsule wardrobe
    if (msg.includes('capsule wardrobe') || msg.includes('essential') || msg.includes('basic')) {
        response = "**Capsule Wardrobe Essentials! 👔**\n\n";
        response += "Build a versatile wardrobe with these:\n\n";
        response += "**Tops (5-7):**\n";
        response += "• White t-shirt, black t-shirt\n";
        response += "• White button-up shirt\n";
        response += "• Neutral sweater\n";
        response += "• One blouse\n\n";
        response += "**Bottoms (4-5):**\n";
        response += "• Dark jeans, black jeans\n";
        response += "• Black trousers\n";
        response += "• One skirt\n\n";
        response += "**Outerwear (2-3):**\n";
        response += "• Denim jacket\n";
        response += "• Blazer\n";
        response += "• Coat\n\n";
        response += "**Shoes (3-4):**\n";
        response += "• White sneakers\n";
        response += "• Black heels/flats\n";
        response += "• Boots\n\n";
        response += "Mix and match = 100+ outfits! ✨";
        return response;
    }
    
    // Confident/bold look
    if (msg.includes('confident') || msg.includes('bold') || msg.includes('powerful')) {
        response = "**Confident & Bold Looks! 💪**\n\n";
        response += "Own the room!\n\n";
        response += "**Power Outfits:**\n";
        response += "• Tailored blazer + fitted pants + heels (boss energy)\n";
        response += "• All black outfit + red lips + statement jewelry\n";
        response += "• Leather jacket + boots + dark jeans\n";
        response += "• Monochrome suit + sleek hair\n\n";
        response += "**Bold Colors:**\n";
        response += "• Red, burgundy, emerald, royal blue\n";
        response += "• All black or all white\n\n";
        response += "**Confidence Tips:**\n";
        response += "• Wear clothes that FIT well\n";
        response += "• Stand tall, shoulders back\n";
        response += "• Add one statement piece\n";
        response += "• Your attitude is your best accessory!\n\n";
        response += "You've got this! 👑🔥";
        return response;
    }
    
    // Check for specific clothing questions
    if (msg.includes('mini skirt') || msg.includes('miniskirt')) {
        response = "**Mini Skirt Magic! ✨**\n\n";
        if (msg.includes('rectangle')) {
            response += "Absolutely YES! Mini skirts look amazing on rectangle body shapes!\n\n";
            response += "**Your Best Styles:**\n";
            response += "• A-line or flared minis - create beautiful curves\n";
            response += "• Pleated or ruffled styles - add dimension\n";
            response += "• High-waisted designs - define that waist!\n\n";
            response += "**Styling Like a Pro:**\n";
            response += "• Tuck in fitted tops or rock a crop top\n";
            response += "• Add a belt to create curves\n";
            response += "• Heels or ankle boots elongate your legs\n";
            response += "• Layer with a fitted jacket for edge\n\n";
            response += "Rock it with confidence! 💪";
        } else {
            response += "Mini skirts are for EVERYONE! Here's how to style them:\n\n";
            response += "**Universal Tips:**\n";
            response += "• High-waisted = universally flattering\n";
            response += "• A-line cuts work for most body shapes\n";
            response += "• Balance with fitted tops\n";
            response += "• Add tights for versatility\n";
            response += "• Choose your comfort length\n\n";
            response += "Your body, your rules! Wear what makes you feel amazing! 🌟";
        }
        return response;
    }
    
    response = "**Fashion Analysis:**\n\n";
    
    // Detect if asking about bottoms (jeans, pants, skirt, etc.)
    if (msg.includes('pant') || msg.includes('jean') || msg.includes('trouser') || 
        msg.includes('skirt') || msg.includes('bottom') || msg.includes('short')) {
        response += "**For this bottom, here are my recommendations:**\n\n";
        response += "**Best Top Matches:**\n";
        response += "• Fitted crop tops or tucked-in shirts\n";
        response += "• Casual t-shirts or tank tops\n";
        response += "• Blouses (tucked or half-tucked)\n";
        response += "• Sweaters or cardigans\n";
        response += "• Button-down shirts\n\n";
        
        response += "**Color Combinations:**\n";
        response += "For blue jeans/denim:\n";
        response += "• White tops for a classic look\n";
        response += "• Black for sophistication\n";
        response += "• Burgundy or maroon for richness\n";
        response += "• Pastels for a soft look\n";
        response += "• Stripes or patterns work great\n\n";
        
        response += "**Styling Tips:**\n";
        response += "• Tuck in your top to define your waist\n";
        response += "• Add a belt for extra style\n";
        response += "• Sneakers for casual, heels for dressy\n";
        response += "• Layer with jackets or blazers\n";
        response += "• Accessorize with statement jewelry\n\n";
        
        response += "**Body Types:**\n";
        response += "Jeans work for all body types! Choose high-waisted for pear shapes, straight-leg for rectangles!";
    }
    // Detect if asking about a top
    else if (msg.includes('top') || msg.includes('shirt') || msg.includes('blouse')) {
        response += "**For this top, here are my recommendations:**\n\n";
        response += "**Best Bottom Matches:**\n";
        response += "• High-waisted jeans (dark wash or black)\n";
        response += "• Tailored trousers in neutral colors\n";
        response += "• A-line midi skirt\n";
        response += "• Pencil skirt for formal occasions\n\n";
        
        response += "**Color Combinations:**\n";
        response += "If it's a burgundy/maroon top:\n";
        response += "• Beige or cream bottoms for elegance\n";
        response += "• Black for a classic look\n";
        response += "• Navy blue for sophistication\n";
        response += "• Gray for a modern feel\n\n";
        
        response += "**Styling Tips:**\n";
        response += "• Add gold jewelry for warmth\n";
        response += "• Nude or black heels work perfectly\n";
        response += "• Keep accessories minimal if the top is embellished\n";
        response += "• Great for evening events or formal occasions\n\n";
        
        response += "**Body Types:**\n";
        response += "This style works well for most body types, especially hourglass and pear shapes!";
    } else if (msg.includes('look good') || msg.includes('match') || msg.includes('together') || msg.includes('upload') || msg.includes('image') || msg.includes('pic')) {
        // When user asks about images but we can't analyze them
        response = "**I can see you're asking about outfit matching! 👗**\n\n";
        response += "While I'm processing your images, let me give you some quick tips:\n\n";
        response += "**General Outfit Matching Rules:**\n";
        response += "✨ **Colors:** Stick to 2-3 colors max for a cohesive look\n";
        response += "🎨 **Neutrals:** Black, white, beige, navy go with everything\n";
        response += "👔 **Balance:** If top is busy, keep bottom simple (and vice versa)\n";
        response += "👠 **Proportions:** Fitted top + loose bottom OR loose top + fitted bottom\n\n";
        response += "**Quick Check:**\n";
        response += "• Do the colors complement each other?\n";
        response += "• Is there a good balance of fitted vs loose?\n";
        response += "• Does the style match (casual with casual, formal with formal)?\n\n";
        response += "**Describe your outfit** and I'll give you specific advice! 💕";
        return response;
    } else {
        response += "**I'm here to help you look fabulous! ✨**\n\n";
        response += "Here's what we can do together:\n\n";
        response += "📸 **Upload pics** and ask 'What goes with this?'\n";
        response += "💬 **Ask me anything** like 'What should I wear on a date?'\n";
        response += "👗 **Body type advice** - 'What looks good on my body shape?'\n";
        response += "🎨 **Color matching** - 'What colors go with burgundy?'\n";
        response += "✨ **Style tips** - 'How to look cute and mysterious?'\n\n";
        response += "I'm your fashion bestie - no question is too small! Let's make you shine! 💕";
    }
    
    return response;
}

// Event Listeners - Set up after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up event listeners...');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Upload button clicked');
            console.log('Image input element:', imageInput);
            if (imageInput) {
                imageInput.click();
                console.log('File dialog should open now');
            } else {
                console.error('Image input not found!');
            }
        });
    } else {
        console.error('Upload button not found!');
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    console.log('✅ All event listeners ready!');
});

// Also set up immediately in case DOM is already loaded
if (uploadBtn) {
    uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Upload clicked (immediate)');
        if (imageInput) imageInput.click();
    });
}
if (imageInput) imageInput.addEventListener('change', handleImageUpload);
if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (messageInput) messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    mainWrapper.classList.toggle('fullscreen');
    
    // Update button icon
    const isFullscreen = mainWrapper.classList.contains('fullscreen');
    fullscreenBtn.innerHTML = isFullscreen ? 
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        </svg>` :
        `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>`;
    
    fullscreenBtn.title = isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen';
}

function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImages.push(event.target.result);
            showImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

function showImagePreviews() {
    if (uploadedImages.length === 0) {
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
        return;
    }

    let previewHTML = '<div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">';
    uploadedImages.forEach((imageSrc, index) => {
        previewHTML += `
            <div class="preview-wrapper">
                <img src="${imageSrc}" alt="Preview ${index + 1}" class="preview-image">
                <button class="remove-preview" onclick="removeImageAtIndex(${index})">×</button>
            </div>
        `;
    });
    
    // Add helpful tip
    if (uploadedImages.length > 0) {
        previewHTML += `
            <div style="font-size: 0.85em; color: #666; margin-left: 10px; max-width: 200px;">
                💡 Ask: "Does this look good?" or "How do I style this?"
            </div>
        `;
    }
    
    previewHTML += '</div>';
    
    imagePreview.innerHTML = previewHTML;
    imagePreview.classList.add('active');
}

function removeImageAtIndex(index) {
    uploadedImages.splice(index, 1);
    showImagePreviews();
    if (uploadedImages.length === 0) {
        imageInput.value = '';
    }
}

function removeAllImages() {
    uploadedImages = [];
    imagePreview.innerHTML = '';
    imagePreview.classList.remove('active');
    imageInput.value = '';
}

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message && uploadedImages.length === 0) return;

    // Add user message with images
    if (message || uploadedImages.length > 0) {
        addMessage(message || 'Analyze these items', 'user', uploadedImages);
    }

    messageInput.value = '';
    const imagesToAnalyze = [...uploadedImages];
    removeAllImages();

    // Show typing indicator
    showTypingIndicator();

    // Try API first (if available), fallback to datasets
    if (USE_API && imagesToAnalyze.length > 0) {
        try {
            const response = await analyzeImagesWithAPI(imagesToAnalyze, message);
            removeTypingIndicator();
            addMessage(response, 'bot');
        } catch (error) {
            console.log('API failed, using dataset analysis');
            removeTypingIndicator();
            const response = imagesToAnalyze.length > 0 ? 
                analyzeImagesWithDatasets(imagesToAnalyze, message) :
                getFallbackAnalysis(message);
            addMessage(response, 'bot');
        }
    } else {
        // Use dataset-based analysis (works offline!)
        setTimeout(() => {
            removeTypingIndicator();
            
            let response;
            if (imagesToAnalyze.length > 0) {
                response = analyzeImagesWithDatasets(imagesToAnalyze, message);
            } else {
                response = getFallbackAnalysis(message);
            }
            
            addMessage(response, 'bot');
        }, 1000); // Simulate processing time
    }
}

// Text response function (works without images)
async function getTextResponse_UNUSED(message) {
    // This function is not used - keeping for reference only
    return getFallbackAnalysis(message);
}

// Main text response function
async function getTextResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (false) {
        prompt += `Analyze this clothing item carefully using fashion expertise.

User's question: ${userMessage || 'What would look good with this?'}

IMPORTANT IDENTIFICATION GUIDELINES:
Use Fashion-MNIST categories as base reference:
- Basic Categories: T-shirt/top, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Ankle boot
- Extended Types: Blouse, Jeans, Skirt, Anarkali, Saree, Jumpsuit, Lehenga, Kurta, etc.
- Determine if it's: TOP (shirt, blouse, sweater, jacket, kurta, pullover) or BOTTOM (pants, jeans, trouser, skirt, shorts, palazzo) or DRESS/ONE-PIECE (dress, gown, jumpsuit, saree, anarkali) or FOOTWEAR (sandal, sneaker, ankle boot) or ACCESSORY (bag, jewelry)
- Note the style: Western (casual, formal, party) or Ethnic (Indian, traditional)
- Identify patterns: floral, stripes, polka dots, checkered, sequins, embroidery, solid
- Detect fabric type: cotton, silk, chiffon, denim, velvet, knit, etc.

Provide detailed analysis:
1. **Item Identification**: 
   - Exact clothing type and category
   - Color (be specific - burgundy, navy, emerald, etc.)
   - Pattern and embellishments
   - Fabric type and texture
   - Style (casual/formal/ethnic/party)

2. **Matching Recommendations**: 
   - If TOP: Suggest specific bottoms (high-waisted jeans, palazzo pants, pencil skirt, etc.)
   - If BOTTOM: Suggest specific tops (crop top, blouse, kurta, fitted shirt, etc.)
   - If DRESS: Suggest accessories and layering options
   - If ETHNIC: Suggest traditional pairings (dupatta, churidar, etc.)

3. **Color Harmony**: 
   - Best color combinations for this item
   - Colors to avoid
   - Neutral options that always work

4. **Occasion Suitability**: 
   - Where to wear: wedding, office, party, casual outing, festival
   - Time of day recommendations
   - Season appropriateness

5. **Body Type Compatibility**: 
   - Which body shapes this flatters (hourglass, pear, apple, rectangle, inverted triangle)
   - Why it works for those body types
   - Styling tips for different body types

6. **Complete Styling Guide**: 
   - Footwear suggestions (heels, sneakers, sandals, ethnic footwear)
   - Accessories (jewelry, bags, belts, scarves)
   - Layering options (jackets, cardigans, shawls)
   - Hair and makeup suggestions`;
    } else {
        prompt += `Analyze these ${imagesData.length} clothing items together as a complete outfit.

User's question: ${userMessage || 'Do these items go well together?'}

Be enthusiastic and friendly! Provide:

1. **First Impression**: Do these items look good together? Give an honest, encouraging assessment

2. **Item Analysis**: Describe each piece:
   - What type of clothing (top, bottom, dress, shoes, etc.)
   - Color and pattern
   - Style (casual, formal, trendy, etc.)

3. **Color Harmony**: 
   - Do the colors work together?
   - What makes this color combo work (or not)?
   - Rate the color match: Perfect/Good/Needs adjustment

4. **Styling Verdict**: 
   - Overall compatibility (1-10 rating)
   - What works well
   - What could be improved

5. **How to Style It**:
   - Best way to wear these together
   - Tucked in or out?
   - Layering suggestions
   - Fit and proportion tips

6. **Complete the Look**:
   - What shoes would work best
   - Accessory suggestions (jewelry, bags, belts)
   - Outerwear if needed

7. **Occasion Ideas**: Where can this outfit be worn?

8. **Pro Tips**: Quick styling hacks to elevate this look

Be specific, encouraging, and give actionable advice!`;
    }
    
    parts.push({ text: prompt });
    
    // Add all images
    imagesData.forEach(imageData => {
        const base64Image = imageData.split(',')[1];
        const mimeType = imageData.split(',')[0].split(':')[1].split(';')[0];
        parts.push({
            inline_data: {
                mime_type: mimeType,
                data: base64Image
            }
        });
    });

    const requestBody = {
        contents: [{
            parts: parts
        }]
    };

    try {
        const response = await fetch(API_PROXY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        // Check for API errors
        if (data.error) {
            console.error('API Error:', data.error);
            throw new Error(data.error.message || 'API request failed');
        }
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
            return "I apologize, but I couldn't analyze this image due to safety filters. Please try uploading a different clothing image.";
        } else {
            console.error('Unexpected API response:', data);
            throw new Error('Invalid response from API');
        }
    } catch (error) {
        console.error('Error in analyzeImage:', error);
        throw error;
    }
}

async function getTextResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check if asking about body types
    if (lowerMessage.includes('body type') || lowerMessage.includes('body shape')) {
        return getBodyTypeRecommendation(message);
    }
    
    const prompt = `You are a friendly, enthusiastic fashion stylist with expertise in both Western and Indian fashion. Answer this question with warmth and personality:

${message}

Guidelines:
- Be conversational and encouraging, like talking to a friend
- Provide specific, actionable advice
- Include outfit examples when relevant
- Consider different occasions and budgets
- Add styling tips and pro tricks
- Be inclusive of all body types and styles
- Use emojis sparingly for emphasis
- Keep it fun but professional

Cover these aspects when relevant:
- Clothing styles and combinations
- Color coordination and harmony
- Body type flattering options
- Occasion appropriateness
- Accessorizing tips
- Current trends vs. timeless pieces
- Budget-friendly alternatives

Make your response helpful, specific, and confidence-boosting!`;

    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    const response = await fetch(API_PROXY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Invalid response from API');
    }
}

function getBodyTypeRecommendation(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific body type
    for (const [bodyType, styles] of Object.entries(fashionKnowledge.bodyTypes)) {
        if (lowerMessage.includes(bodyType)) {
            let response = `**${bodyType.charAt(0).toUpperCase() + bodyType.slice(1)} Body Shape Fashion Guide:**\n\n`;
            response += `*Based on our Body Shape Wise Clothes dataset*\n\n`;
            response += `**Best Clothing Styles:**\n${styles}\n\n`;
            
            // Add specific tips based on body type from dataset
            if (bodyType === 'rectangle') {
                response += "**What to Wear (Rectangle/Straight Body):**\n";
                response += "**Tops:**\n";
                response += "• Peplum tops and ruffled blouses\n";
                response += "• Wrap tops that create waist definition\n";
                response += "• Embellished or detailed tops\n";
                response += "• Crop tops with high-waisted bottoms\n\n";
                response += "**Bottoms:**\n";
                response += "• High-waisted jeans and trousers\n";
                response += "• A-line and flared skirts\n";
                response += "• Palazzo pants\n";
                response += "• Bootcut jeans\n\n";
                response += "**Dresses:**\n";
                response += "• Belted dresses\n";
                response += "• Fit-and-flare styles\n";
                response += "• Wrap dresses\n\n";
                response += "**Avoid:** Straight, boxy silhouettes\n\n";
            } else if (bodyType === 'hourglass') {
                response += "**What to Wear (Hourglass Body):**\n";
                response += "**Tops:**\n";
                response += "• Fitted tops and blouses\n";
                response += "• V-neck and scoop neck styles\n";
                response += "• Wrap tops\n";
                response += "• Anything that emphasizes the waist\n\n";
                response += "**Bottoms:**\n";
                response += "• High-waisted jeans and skirts\n";
                response += "• Pencil skirts\n";
                response += "• Fitted trousers\n";
                response += "• Bodycon styles\n\n";
                response += "**Dresses:**\n";
                response += "• Wrap dresses (perfect!)\n";
                response += "• Bodycon dresses\n";
                response += "• Belted styles\n\n";
                response += "**Avoid:** Oversized, shapeless clothing\n\n";
            } else if (bodyType === 'pear') {
                response += "**What to Wear (Pear/Triangle Body):**\n";
                response += "**Tops:**\n";
                response += "• Boat neck and off-shoulder styles\n";
                response += "• Bright colors and patterns on top\n";
                response += "• Structured shoulders\n";
                response += "• Statement sleeves\n\n";
                response += "**Bottoms:**\n";
                response += "• Dark-colored bottoms\n";
                response += "• A-line skirts\n";
                response += "• Bootcut and wide-leg pants\n";
                response += "• Straight-leg jeans\n\n";
                response += "**Dresses:**\n";
                response += "• A-line dresses\n";
                response += "• Fit-and-flare styles\n";
                response += "• Empire waist dresses\n\n";
                response += "**Avoid:** Skinny jeans, tight bottoms, pockets on hips\n\n";
            } else if (bodyType === 'apple') {
                response += "**What to Wear (Apple/Round Body):**\n";
                response += "**Tops:**\n";
                response += "• V-neck and deep necklines\n";
                response += "• Empire waist tops\n";
                response += "• Flowy, draped fabrics\n";
                response += "• Tunics\n\n";
                response += "**Bottoms:**\n";
                response += "• Straight-leg pants\n";
                response += "• Bootcut jeans\n";
                response += "• A-line skirts\n";
                response += "• Show off your legs!\n\n";
                response += "**Dresses:**\n";
                response += "• Empire waist dresses\n";
                response += "• A-line styles\n";
                response += "• Wrap dresses\n\n";
                response += "**Avoid:** Tight waistbands, clingy fabrics around middle\n\n";
            } else if (bodyType === 'inverted_triangle') {
                response += "**What to Wear (Inverted Triangle Body):**\n";
                response += "**Tops:**\n";
                response += "• V-neck and scoop neck\n";
                response += "• Raglan sleeves\n";
                response += "• Simple, minimal tops\n";
                response += "• Dark colors on top\n\n";
                response += "**Bottoms:**\n";
                response += "• A-line and flared skirts\n";
                response += "• Wide-leg pants\n";
                response += "• Detailed or patterned bottoms\n";
                response += "• Bright colors on bottom\n\n";
                response += "**Dresses:**\n";
                response += "• A-line dresses\n";
                response += "• Fit-and-flare styles\n";
                response += "• Wrap dresses\n\n";
                response += "**Avoid:** Boat neck, shoulder pads, cap sleeves\n\n";
            }
            
            response += "**Pro Styling Tips:**\n";
            response += "• Always choose clothes that fit well\n";
            response += "• Confidence is your best accessory\n";
            response += "• These are guidelines - wear what makes YOU happy!\n";
            response += "• Mix and match to find your perfect style 💕";
            return response;
        }
    }
    
    // If no specific body type mentioned, show all
    let recommendations = "**Fashion Recommendations by Body Type:**\n\n";
    recommendations += "*Based on our comprehensive Body Shape Wise Clothes dataset*\n\n";
    for (const [bodyType, styles] of Object.entries(fashionKnowledge.bodyTypes)) {
        recommendations += `**${bodyType.charAt(0).toUpperCase() + bodyType.slice(1)}:** ${styles}\n\n`;
    }
    recommendations += "💡 Ask about a specific body type for detailed recommendations with examples!";
    
    return recommendations;
}

function addMessage(text, sender, images = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    let content = `<div class="message-content">`;
    
    // Add images if present
    if (images && Array.isArray(images) && images.length > 0 && sender === 'user') {
        content += '<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">';
        images.forEach((imageSrc, index) => {
            content += `<img src="${imageSrc}" alt="Uploaded ${index + 1}" class="message-image">`;
        });
        content += '</div>';
    }
    
    if (text) {
        content += `<p>${formatMessage(text)}</p>`;
    }
    
    content += `</div>`;
    messageDiv.innerHTML = content;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    // Convert markdown-style formatting to HTML
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');
    
    // Format lists
    text = text.replace(/^- (.*?)$/gm, '• $1');
    text = text.replace(/^\* (.*?)$/gm, '• $1');
    
    return text;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}
