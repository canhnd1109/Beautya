import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { db } from '../firebaseConfig';

const productsCollectionRef = collection(db, 'products');

export const getProducts = async (category) => {
    try {
        let productsCollectionQuery = productsCollectionRef;

        // If a category is provided, filter by category
        if (category !== undefined) {
            productsCollectionQuery = query(productsCollectionRef, where('categories', 'array-contains', category));
        }

        const data = await getDocs(productsCollectionQuery);

        return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (err) {
        throw err;
    }
};

export const addProduct = async ({
    name,
    description,
    price,
    imageUrls,
    categories,
    types,
    ingredients,
    howToApply,
    stockCount = 0,
    soldCount = 0, // Default stock count to 0
}) => {
    try {
        await addDoc(productsCollectionRef, {
            name: name,
            description: description,
            price: Number(price),
            imageUrls: imageUrls || [],
            types: types || [],
            ingredients: ingredients || [],
            howToApply: howToApply || [],
            categories: categories || [],
            stockCount: Number(stockCount),
            soldCount: Number(soldCount),
        });
    } catch (err) {
        throw err;
    }
};

export const getProduct = async (id) => {
    try {
        const data = await getDoc(doc(db, 'products', id));
        return { ...data.data(), id: data.id };
    } catch (err) {
        throw err;
    }
};

export const updateProduct = async (product) => {
    try {
        const { id, name, description, price, imageUrls, categories, types, ingredients, howToApply, stockCount } =
            product;

        const productDoc = doc(db, 'products', id);

        const newFields = {
            name: name,
            description: description,
            price: Number(price),
            imageUrls: imageUrls || [],
            categories: categories || [],
            types: types || [],
            ingredients: ingredients || [],
            howToApply: howToApply || [],
            stockCount: Number(stockCount),
        };

        await updateDoc(productDoc, newFields);
    } catch (err) {
        throw err;
    }
};

export const deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(db, 'products', id));
    } catch (err) {
        throw err;
    }
};

// const productsData = [
//   {
//     name: "Radiant Glow Foundation",
//     description:
//       "Achieve a flawless complexion with our Radiant Glow Foundation. Formulated with nourishing ingredients and light-diffusing technology, this foundation provides a natural, radiant finish that lasts all day.",
//     price: 29.99,
//     imageUrls: ["url1.jpg", "url2.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["Z5a2Rie802VtWgNly8IJ"], // Foundation type
//     ingredients: ["Hyaluronic Acid", "Vitamin E", "Silica", "Pearl Powder"],
//     howToApply: [
//       "Apply a small amount of foundation onto clean, moisturized skin.",
//       "Blend evenly using a makeup sponge or brush for a seamless finish.",
//     ],
//     stockCount: 50,
//   },
//   {
//     name: "Lash Boost Mascara",
//     description:
//       "Get voluminous lashes with our Lash Boost Mascara. The specially designed brush adds length and definition for a bold, dramatic look. Enriched with nourishing ingredients to condition lashes.",
//     price: 19.99,
//     imageUrls: ["url3.jpg", "url4.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["MaaJrKs1M9WLFHb4xhHX"], // Mascara type
//     ingredients: ["Castor Oil", "Beeswax", "Vitamin B5"],
//     howToApply: [
//       "Start by applying the mascara from the base of your lashes.",
//       "Wiggle the wand in a zigzag motion for even coverage.",
//       "Build up layers for added volume.",
//     ],
//     stockCount: 30,
//   },
//   {
//     name: "Hydrating Rosewater Mist",
//     description:
//       "Revitalize your skin with our Hydrating Rosewater Mist. Infused with pure rosewater and botanical extracts, this mist provides a burst of hydration and leaves your skin feeling refreshed.",
//     price: 15.99,
//     imageUrls: ["url5.jpg", "url6.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["Wq1DVKGgXKFwL3T3Baez"], // Toner type
//     ingredients: ["Rosewater", "Aloe Vera", "Chamomile Extract"],
//     howToApply: [
//       "Spritz the mist onto your face after cleansing.",
//       "Use throughout the day to hydrate and refresh your skin.",
//     ],
//     stockCount: 25,
//   },
//   {
//     name: "Matte Finish Foundation",
//     description:
//       "Achieve a flawless complexion with our Matte Finish Foundation. This lightweight formula provides buildable coverage and a matte finish for a naturally radiant look that lasts all day.",
//     price: 22.99,
//     imageUrls: ["url9.jpg", "url10.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["Z5a2Rie802VtWgNly8IJ"], // Foundation type
//     ingredients: ["Water", "Cyclopentasiloxane", "Titanium Dioxide"],
//     howToApply: [
//       "Apply a small amount of serum to clean, dry skin.",
//       "Gently massage in upward motions, focusing on areas with fine lines.",
//     ],
//     stockCount: 20,
//   },
//   {
//     name: "Volumizing Mascara",
//     description:
//       "Enhance your lashes with our Volumizing Mascara. The specially designed brush lifts and coats each lash for maximum volume and definition, giving you a bold and beautiful look.",
//     price: 14.99,
//     imageUrls: ["url11.jpg", "url12.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["MaaJrKs1M9WLFHb4xhHX"], // Mascara type
//     ingredients: ["Beeswax", "Carnauba Wax", "Jojoba Oil"],
//     howToApply: [
//       "Apply the mascara from the root to the tip of your lashes.",
//       "Wiggle the wand for even coverage.",
//       "Build up layers for added volume.",
//     ],
//     stockCount: 25,
//   },
//   {
//     name: "Hydrating Sheet Mask",
//     description:
//       "Treat your skin to a spa-like experience with our Hydrating Sheet Mask. Infused with nourishing ingredients, this mask deeply hydrates and revitalizes your skin, leaving it feeling refreshed and radiant.",
//     price: 4.99,
//     imageUrls: ["url13.jpg", "url14.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["HmyCkG8OIuYuodDUfINb"], // Sheet Mask type
//     ingredients: ["Hyaluronic Acid", "Aloe Vera Extract", "Chamomile"],
//     howToApply: [
//       "Place the sheet mask on clean skin.",
//       "Leave it on for 15-20 minutes.",
//       "Remove the mask and gently massage any remaining essence into your skin.",
//     ],
//     stockCount: 40,
//   },
//   {
//     name: "Anti-Aging Serum",
//     description:
//       "Turn back the clock with our Anti-Aging Serum. Packed with powerful antioxidants and peptides, this serum helps reduce the appearance of fine lines and wrinkles, promoting a more youthful complexion.",
//     price: 29.99,
//     imageUrls: ["url15.jpg", "url16.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["d8KdQaEBlwU3HCTrBQiA"], // Serum type
//     ingredients: ["Vitamin C", "Retinol", "Hyaluronic Acid"],
//     howToApply: [
//       "Apply a small amount of the serum to cleansed skin.",
//       "Focus on areas with fine lines.",
//       "Use morning and night for best results.",
//     ],
//     stockCount: 20,
//   },
//   {
//     name: "Matte Liquid Lipstick",
//     description:
//       "Achieve bold and beautiful lips with our Matte Liquid Lipstick. The long-lasting formula provides intense color payoff while keeping your lips comfortable and hydrated throughout the day.",
//     price: 12.99,
//     imageUrls: ["lipstick1.jpg", "lipstick2.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["VhRzNNWIfY1RYi0aJJzl"], // Lipstick type
//     ingredients: ["Jojoba Oil", "Vitamin E", "Shea Butter"],
//     howToApply: [
//       "Start by outlining your lips with the precision applicator.",
//       "Fill in the rest of the lips for a vibrant and long-lasting matte finish.",
//     ],
//     stockCount: 30,
//   },
//   {
//     name: "Radiance Boosting Foundation",
//     description:
//       "Get a flawless complexion with our Radiance Boosting Foundation. This lightweight foundation provides buildable coverage and a luminous finish, leaving your skin looking naturally radiant.",
//     price: 24.99,
//     imageUrls: ["foundation1.jpg", "foundation2.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["Z5a2Rie802VtWgNly8IJ"], // Foundation type
//     ingredients: ["Hyaluronic Acid", "Vitamin C", "Pearl Extract"],
//     howToApply: [
//       "Apply a small amount of foundation to the center of your face.",
//       "Blend it outwards using a makeup sponge or brush for a seamless finish.",
//     ],
//     stockCount: 25,
//   },
//   {
//     name: "Glowing Highlighter Palette",
//     description:
//       "Illuminate your features with our Glowing Highlighter Palette. This versatile palette includes a range of shades to suit every skin tone, providing a luminous and radiant glow.",
//     price: 18.99,
//     imageUrls: ["highlighter1.jpg", "highlighter2.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["VTDqVZBJfXDiuu4CLJFH"], // Highlighter type
//     ingredients: ["Mica", "Dimethicone", "Sunflower Seed Oil"],
//     howToApply: [
//       "Apply the highlighter to the high points of your face.",
//       "Focus on areas such as cheekbones, bridge of the nose, and cupid's bow.",
//       "Blend for a luminous and radiant finish.",
//     ],
//     stockCount: 35,
//   },
//   {
//     name: "Luxury Skincare Gift Set",
//     description:
//       "Indulge in luxury with our exclusive Skincare Gift Set. This set features a curated collection of premium skincare products designed to pamper and nourish your skin. Treat yourself or surprise a loved one with the gift of radiant and healthy-looking skin.",
//     price: 99.99,
//     imageUrls: ["giftset1.jpg", "giftset2.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["dQLRLZ9pZMeo3ersTD4s"], // Skincare Gift Set type
//     ingredients: ["Hyaluronic Acid", "Retinol", "Vitamin E"],
//     howToApply: [
//       "Follow the provided skincare routine included in the set.",
//       "Use the products in the specified order for optimal results.",
//       "Suitable for all skin types.",
//     ],
//     stockCount: 15,
//   },
//   {
//     name: "Fragrance Discovery Set",
//     description:
//       "Explore a world of captivating scents with our Fragrance Discovery Set. This set includes a selection of our most popular fragrances, allowing you to discover your signature scent. Perfect for gifting or treating yourself to a sensory journey.",
//     price: 49.99,
//     imageUrls: ["giftset3.jpg", "giftset4.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["EGtQpd8ISCxDoL2ZOUqz"], // Fragrance Set type
//     ingredients: ["Various fragrance notes"],
//     howToApply: [
//       "Apply the fragrance to pulse points, such as wrists and neck.",
//       "Experience a lasting and enchanting scent throughout the day.",
//     ],
//     stockCount: 20,
//   },

//   {
//     name: "Travel Essentials Kit",
//     description:
//       "Stay radiant on the go with our Travel Essentials Kit. This compact kit includes travel-sized versions of our best-selling skincare and makeup products, ensuring you can maintain your beauty routine wherever your adventures take you.",
//     price: 29.99,
//     imageUrls: ["giftset5.jpg", "giftset6.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["hprAsDqRouvQAwG3kotS"], // Travel Essentials Set type
//     ingredients: ["Various skincare and makeup essentials"],
//     howToApply: [
//       "Follow the provided instructions for each product within the kit.",
//       "Suitable for travel and daily use.",
//     ],
//     stockCount: 25,
//   },
//   {
//     name: "Haircare Luxury Gift Set",
//     description:
//       "Treat your hair to a luxurious experience with our Haircare Luxury Gift Set. This set includes a selection of premium haircare products designed to nourish, strengthen, and add shine to your locks. The perfect gift for those who love to indulge in a spa-like hair treatment at home.",
//     price: 79.99,
//     imageUrls: ["giftset7.jpg", "giftset8.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["1YEueasbbWkDQRyb8nTG"], // Haircare Gift Set type
//     ingredients: ["Argan Oil", "Keratin", "Coconut Extract"],
//     howToApply: [
//       "Follow the provided haircare routine included in the set for optimal results.",
//       "Suitable for all hair types.",
//     ],
//     stockCount: 18,
//   },

//   {
//     name: "Men's Grooming Essentials Set",
//     description:
//       "Elevate your grooming routine with our Men's Grooming Essentials Set. This set includes a curated collection of grooming products to help you achieve a polished and refined look. Ideal for the modern man who values a well-groomed appearance.",
//     price: 59.99,
//     imageUrls: ["giftset9.jpg", "giftset10.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["So12sVF5JnnrGTKNHvup"], // Men's Grooming Set type
//     ingredients: ["Tea Tree Oil", "Caffeine", "Aloe Vera"],
//     howToApply: [
//       "Follow the provided grooming routine included in the set for a clean and sophisticated look.",
//       "Suitable for all skin and hair types.",
//     ],
//     stockCount: 22,
//   },

//   {
//     name: "Nail Care Essentials Kit",
//     description:
//       "Achieve salon-quality nails at home with our Nail Care Essentials Kit. This kit includes everything you need for a professional-looking manicure and pedicure. Treat yourself or gift it to a friend who loves beautiful nails.",
//     price: 34.99,
//     imageUrls: ["giftset11.jpg", "giftset12.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["rZCev8Q6kv55eWHLN5sG"], // Nail Care Kit type
//     ingredients: ["Nail polish, Nail file, Cuticle oil, Base coat, Top coat"],
//     howToApply: [
//       "Follow the provided instructions within the kit for a flawless nail care routine.",
//     ],
//     stockCount: 30,
//   },
//   {
//     name: "Wellness and Relaxation Set",
//     description:
//       "Indulge in self-care with our Wellness and Relaxation Set. This set includes a curated collection of products designed to promote relaxation and well-being. Perfect for unwinding after a long day or as a thoughtful gift for someone special.",
//     price: 49.99,
//     imageUrls: ["giftset13.jpg", "giftset14.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["FOZFgBs2GRdPODQyoUhN"], // Wellness Gift Set type
//     ingredients: ["Aromatherapy oils", "Bath salts", "Relaxation guide"],
//     howToApply: [
//       "Diffuse aromatherapy oils",
//       "Add bath salts to a warm bath",
//       "Follow the provided relaxation guide",
//     ],
//     stockCount: 25,
//   },
//   {
//     name: "Makeup Brushes Collection",
//     description:
//       "Upgrade your makeup routine with our Makeup Brushes Collection. This set includes a variety of high-quality brushes for flawless makeup application. Elevate your beauty routine and achieve professional-looking results.",
//     price: 39.99,
//     imageUrls: ["giftset15.jpg", "giftset16.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["YfeNwp0A2SGEFp19P8t4"], // Makeup Brushes Set type
//     ingredients: ["Synthetic and natural bristles, Ergonomic handles"],
//     howToApply: [
//       "Use each brush for specific makeup applications",
//       "Follow tutorials for optimal results",
//     ],
//     stockCount: 28,
//   },
//   {
//     name: "Luxury Beauty Box",
//     description:
//       "Experience luxury beauty with our exclusive Luxury Beauty Box. This limited-edition box features a curated selection of premium skincare, makeup, and haircare products from top brands. A must-have for beauty enthusiasts.",
//     price: 89.99,
//     imageUrls: ["giftset17.jpg", "giftset18.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["jENyBUJDkdWFvJXiPm96"], // Luxury Beauty Set type
//     ingredients: ["Assorted beauty products from top brands"],
//     howToApply: [
//       "Explore and enjoy each product as part of your beauty routine",
//     ],
//     stockCount: 20,
//   },

//   {
//     name: "Skincare Essentials Bundle",
//     description:
//       "Simplify your skincare routine with our Skincare Essentials Bundle. This bundle includes a complete set of essential skincare products to cleanse, moisturize, and rejuvenate your skin. Ideal for those looking for a straightforward and effective skincare regimen.",
//     price: 54.99,
//     imageUrls: ["giftset19.jpg", "giftset20.jpg"],
//     categories: ["LoHE70JmXRxPtjWOSsmu"], // Gifts and Sets category
//     types: ["d8KdQaEBlwU3HCTrBQiA"], // Skincare Type 3 (for variety)
//     ingredients: ["Cleanser, Moisturizer, Serum, Toner"],
//     howToApply: [
//       "Follow the provided skincare routine for radiant and healthy-looking skin.",
//     ],
//     stockCount: 22,
//   },
//   {
//     name: "Matte Lipstick Collection",
//     description:
//       "Achieve a bold and matte finish with our Matte Lipstick Collection. This set features a range of vibrant and long-lasting matte lipsticks in various shades. Perfect for creating stunning lip looks that last all day.",
//     price: 24.99,
//     imageUrls: ["makeup11.jpg", "makeup12.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["VhRzNNWIfY1RYi0aJJzl"], // Lipstick type
//     ingredients: ["Matte pigments, Moisturizing agents"],
//     howToApply: [
//       "Apply directly to lips for intense color.",
//       "Use a lip liner for precision.",
//     ],
//     stockCount: 35,
//   },
//   {
//     name: "Eyeshadow Palette - Neutral Tones",
//     description:
//       "Create versatile eye looks with our Neutral Tones Eyeshadow Palette. This palette includes a curated selection of neutral shades in matte and shimmer finishes. Ideal for both everyday and glamorous eye makeup.",
//     price: 29.99,
//     imageUrls: ["makeup13.jpg", "makeup14.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["VanK9ZbAmk1B7so6TYGl"], // Eyeshadow type
//     ingredients: ["Highly pigmented eyeshadows"],
//     howToApply: [
//       "Use a variety of brushes to create different eye looks.",
//       "Mix and match shades for dimension.",
//     ],
//     stockCount: 28,
//   },
//   {
//     name: "All-in-One Makeup Kit",
//     description:
//       "Simplify your makeup routine with our All-in-One Makeup Kit. This comprehensive kit includes everything you need for a full face of makeup, from eyeshadows and blushes to lip colors and brushes. Perfect for travel or daily use.",
//     price: 49.99,
//     imageUrls: ["makeup15.jpg", "makeup16.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["Z5a2Rie802VtWgNly8IJ", "ElXXhxiQs16IJ8egXMhX"], // Foundation and Eyeliner types
//     ingredients: ["Assorted makeup products"],
//     howToApply: [
//       "Follow included instructions for a complete makeup look.",
//       "Customize to suit your style.",
//     ],
//     stockCount: 25,
//   },
//   {
//     name: "Mascara Duo - Lengthening & Volumizing",
//     description:
//       "Enhance your lashes with our Mascara Duo. This set includes two mascaras for achieving both length and volume. The perfect combination for fluttery and dramatic lashes.",
//     price: 19.99,
//     imageUrls: ["makeup19.jpg", "makeup20.jpg"],
//     categories: ["80eDU30HaynL1GdfNq5H"], // Makeup category
//     types: ["MaaJrKs1M9WLFHb4xhHX"], // Mascara type
//     ingredients: ["Lengthening and volumizing formulas"],
//     howToApply: [
//       "Apply the lengthening mascara first and follow with the volumizing mascara for intensified lashes.",
//     ],
//     stockCount: 32,
//   },
//   {
//     name: "Hydrating Gel Cleanser",
//     description:
//       "Gently cleanse and refresh your skin with our Hydrating Gel Cleanser. Formulated with hydrating ingredients, this cleanser effectively removes impurities without stripping the skin of its natural moisture. Suitable for all skin types.",
//     price: 18.99,
//     imageUrls: ["skincare11.jpg", "skincare12.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["vzMi3ZcHU6zwDWyRphz4"], // Cleanser type
//     ingredients: ["Hydrating agents", "Gentle cleansing agents"],
//     howToApply: [
//       "Apply a small amount to damp skin, massage gently, and rinse with water.",
//     ],
//     stockCount: 42,
//   },
//   {
//     name: "Anti-Aging Serum - Retinol Complex",
//     description:
//       "Turn back the clock with our Anti-Aging Serum featuring a powerful Retinol Complex. This serum helps reduce the appearance of fine lines and wrinkles, promoting a smoother and more youthful-looking complexion.",
//     price: 39.99,
//     imageUrls: ["skincare13.jpg", "skincare14.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["d8KdQaEBlwU3HCTrBQiA"], // Serum type
//     ingredients: ["Retinol", "Anti-aging peptides"],
//     howToApply: [
//       "Apply a small amount to clean, dry skin before moisturizing. Use sunscreen during the day.",
//     ],
//     stockCount: 35,
//   },
//   {
//     name: "Hydrating Sheet Mask Set",
//     description:
//       "Indulge in a spa-like experience with our Hydrating Sheet Mask Set. Each sheet mask is infused with hydrating ingredients to replenish and nourish the skin. Perfect for a relaxing self-care session.",
//     price: 24.99,
//     imageUrls: ["skincare15.jpg", "skincare16.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["HmyCkG8OIuYuodDUfINb"], // Sheet Mask type
//     ingredients: ["Hydrating essences", "Sheet mask material"],
//     howToApply: [
//       "Apply the sheet mask to clean skin and leave on for 15-20 minutes.",
//       "Massage any excess product into the skin.",
//     ],
//     stockCount: 28,
//   },
//   {
//     name: "Brightening Exfoliating Scrub",
//     description:
//       "Reveal a radiant complexion with our Brightening Exfoliating Scrub. This scrub gently exfoliates to remove dead skin cells, leaving the skin smoother and brighter. Suitable for weekly use.",
//     price: 22.99,
//     imageUrls: ["skincare17.jpg", "skincare18.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["6XxGZ9lUlWIHOZhAQNLW"], // Exfoliator type
//     ingredients: ["Brightening agents", "Fine exfoliating particles"],
//     howToApply: [
//       "Apply to damp skin and massage in circular motions.",
//       "Rinse thoroughly with water.",
//     ],
//     stockCount: 30,
//   },
//   {
//     name: "Nourishing Night Cream",
//     description:
//       "Revitalize your skin overnight with our Nourishing Night Cream. This rich and hydrating cream works while you sleep to replenish moisture and support skin renewal. Wake up to a refreshed and revitalized complexion.",
//     price: 29.99,
//     imageUrls: ["skincare19.jpg", "skincare20.jpg"],
//     categories: ["TgBO4YLLPozDwUAI1dav"], // Skincare category
//     types: ["nsUmbYwxLOEzAlpDSHJo"], // Moisturizer type
//     ingredients: ["Hydrating oils", "Skin-renewing ingredients"],
//     howToApply: [
//       "Apply to clean face and neck before bedtime, gently massaging into the skin.",
//     ],
//     stockCount: 26,
//   },
// ];

// Use productsData to add products to your Firestore collection
// productsData.forEach(async (product) => {
//   try {
//     await addProduct(product);
//     console.log(`Added product: ${product.name}`);
//   } catch (error) {
//     console.error(`Error adding product ${product.name}:`, error);
//   }
// });
