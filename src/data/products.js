export const PRODUCTS = [
  {
    id: 1,
    title: 'SHIMANO Liquide de Frein Huile Minerale',
    brand: 'PIKALA DETACHEE',
    category: 'les-frein',
    categoryLabel: 'Liquides de Frein Hydraulique, Lubrification & Huile',
    price: 40,
    oldPrice: 50,
    discount: 20,
    isSoldOut: true,
    rating: 4.8,
    reviewsCount: 18,
    image: '/bicyclehouse/products/shimano_oil.png',
    images: [
      '/bicyclehouse/products/shimano_oil.png',
      '/bicyclehouse/products/shimano_pads.png'
    ],
    description: 'L\'huile minérale Shimano de haute qualité pour freins à disque hydrauliques. Assure une performance de freinage optimale et stable dans toutes les conditions météorologiques. Flacon de 60 ml idéal pour un entretien individuel.'
  },
  {
    id: 2,
    title: 'ZEFAL Pro Wet Lube 120 ml Lubrifiant',
    brand: 'PIKALA DETACHEE',
    category: 'les-accesoires',
    categoryLabel: 'Lubrification & Huile',
    price: 85,
    oldPrice: null,
    discount: null,
    isSoldOut: false,
    rating: 4.5,
    reviewsCount: 12,
    image: '/bicyclehouse/products/zefal_lube.png',
    images: [
      '/bicyclehouse/products/zefal_lube.png'
    ],
    description: 'Le Pro Wet Lube est un lubrifiant biodégradable longue durée adapté aux conditions humides. À base d\'esters synthétiques, il protège durablement la chaîne contre la rouille et l\'usure.'
  },
  {
    id: 3,
    title: 'ZEFAL Air CO2 25G Cartouche',
    brand: 'PIKALA DETACHEE',
    category: 'les-accesoires',
    categoryLabel: 'Gonflage & Cartouches',
    price: 30,
    oldPrice: 32,
    discount: 6,
    isSoldOut: false,
    rating: 4.2,
    reviewsCount: 25,
    image: '/bicyclehouse/products/co2_cartridge.png',
    images: [
      '/bicyclehouse/products/co2_cartridge.png',
      '/bicyclehouse/products/zefal_pump.png'
    ],
    description: 'Cartouche de CO2 filetée de 25g, conçue pour gonfler rapidement les pneus à haute pression. Idéale pour les VTT, VTC ou vélos de route lors de crevaisons rapides.'
  },
  {
    id: 4,
    title: 'SHIMANO Deore M6100 Dérailleur Arrière',
    brand: 'PIKALA DETACHEE',
    category: 'les-accesoires',
    categoryLabel: 'Transmission, Dérailleurs',
    price: 450,
    oldPrice: 520,
    discount: 13,
    isSoldOut: false,
    rating: 4.9,
    reviewsCount: 31,
    image: '/bicyclehouse/products/shimano_deore.png',
    images: [
      '/bicyclehouse/products/shimano_deore.png',
      '/bicyclehouse/products/shimano_pads.png'
    ],
    description: 'Dérailleur arrière Shimano Deore M6100 de 12 vitesses offrant un changement de vitesse rapide et silencieux sur tous les pignons. Technologie Shadow RD+ pour une tension de chaîne optimale.'
  },
  {
    id: 5,
    title: 'SHIMANO Plaquettes de Frein B05S',
    brand: 'PIKALA DETACHEE',
    category: 'les-frein',
    categoryLabel: 'Freinage, Plaquettes',
    price: 95,
    oldPrice: 120,
    discount: 21,
    isSoldOut: false,
    rating: 4.7,
    reviewsCount: 42,
    image: '/bicyclehouse/products/shimano_pads.png',
    images: [
      '/bicyclehouse/products/shimano_pads.png',
      '/bicyclehouse/products/shimano_oil.png'
    ],
    description: 'Plaquettes de frein en résine organique d\'origine Shimano B05S. Offrent une excellente modulation de freinage, un faible niveau de bruit et une durabilité accrue par rapport au modèle précédent B01S/B03S.'
  },
  {
    id: 6,
    title: 'Casque VTT Rockrider ST 500',
    brand: 'PIKALA DETACHEE',
    category: 'les-accesoires',
    categoryLabel: 'Protection, Casques',
    price: 280,
    oldPrice: 350,
    discount: 20,
    isSoldOut: false,
    rating: 4.6,
    reviewsCount: 15,
    image: '/bicyclehouse/products/rockrider_helmet.png',
    images: [
      '/bicyclehouse/products/rockrider_helmet.png'
    ],
    description: 'Casque de vélo tout-terrain léger, confortable et robuste. Équipé de 17 aérations pour une ventilation optimale et d\'une visière amovible pour vous protéger des branches et du soleil.'
  },
  {
    id: 8,
    title: 'Guidon VTT Carbon PRO Wake Rise',
    brand: 'PIKALA DETACHEE',
    category: 'les-gidon',
    categoryLabel: 'Guidons & Cintres',
    price: 320,
    oldPrice: 380,
    discount: 15,
    isSoldOut: false,
    rating: 4.8,
    reviewsCount: 14,
    image: '/bicyclehouse/products/guidon_vtt.png',
    images: [
      '/bicyclehouse/products/guidon_vtt.png',
      '/bicyclehouse/products/poignees_vtt.png'
    ],
    variants: [
      {
        name: 'Couleur',
        type: 'color',
        options: [
          { value: 'Noir', code: '#111111' },
          { value: 'Or', code: '#FFD700' },
          { value: 'Bleu', code: '#0D6EFD' },
          { value: 'Rouge', code: '#DC3545' },
          { value: 'Violet', code: '#8A2BE2' }
        ]
      },
      {
        name: 'Diamètre',
        type: 'text',
        options: ['31.8mm', '35mm']
      }
    ],
    description: 'Cintre de VTT en carbone ultra-léger et rigide. Longueur de 780 mm ajustable pour un contrôle précis dans les descentes techniques. Offre une excellente absorption des vibrations.'
  },
  {
    id: 9,
    title: 'Selle de Vélo Selle Royal Gel Confort',
    brand: 'PIKALA DETACHEE',
    category: 'les-selle',
    categoryLabel: 'Selles & Tiges',
    price: 260,
    oldPrice: null,
    discount: null,
    isSoldOut: false,
    rating: 4.7,
    reviewsCount: 31,
    image: '/bicyclehouse/products/selle_velo.png',
    images: [
      '/bicyclehouse/products/selle_velo.png',
      '/bicyclehouse/products/poignees_vtt.png'
    ],
    variants: [
      {
        name: 'Type',
        type: 'text',
        options: ['Ergonomique Homme', 'Ergonomique Femme', 'Sport Classic']
      }
    ],
    description: 'Selle ergonomique avec rembourrage Royalgel de haute qualité. Réduit les points de pression de 40% pour un confort d\'assise inégalé sur les longues distances. Revêtement imperméable et résistant.'
  },
  {
    id: 10,
    title: 'Poignées de Guidon VTT Double Lock-On',
    brand: 'PIKALA DETACHEE',
    category: 'les-accesoires',
    categoryLabel: 'Poignées & Rubans',
    price: 90,
    oldPrice: 110,
    discount: 18,
    isSoldOut: false,
    rating: 4.5,
    reviewsCount: 17,
    image: '/bicyclehouse/products/poignees_vtt.png',
    images: [
      '/bicyclehouse/products/poignees_vtt.png',
      '/bicyclehouse/products/guidon_vtt.png'
    ],
    variants: [
      {
        name: 'Couleur des bagues',
        type: 'color',
        options: [
          { value: 'Noir', code: '#111111' },
          { value: 'Rouge', code: '#DC3545' },
          { value: 'Bleu', code: '#0D6EFD' },
          { value: 'Or', code: '#FFD700' }
        ]
      }
    ],
    description: 'Grips de guidon en caoutchouc texturé antidérapant avec bagues de serrage en aluminium (double lock-on). Assurent une prise en main ferme et sécurisée par tous les temps.'
  },
  {
    id: 11,
    title: 'Pneu VTT Maxxis Minion DHF Tubeless Ready',
    brand: 'PIKALA DETACHEE',
    category: 'les-pneu',
    categoryLabel: 'Pneus & Chambres à air',
    price: 380,
    oldPrice: 450,
    discount: 15,
    isSoldOut: false,
    rating: 4.9,
    reviewsCount: 22,
    image: '/bicyclehouse/products/guidon_vtt.png',
    images: [
      '/bicyclehouse/products/guidon_vtt.png'
    ],
    description: 'Le pneu Maxxis Minion DHF est la référence pour les terrains techniques et meubles. Offre une excellente adhérence latérale et une traction optimale au freinage.'
  },
  {
    id: 12,
    title: 'Potence de Guidon VTT Wake 31.8mm Court',
    brand: 'PIKALA DETACHEE',
    category: 'les-potonce',
    categoryLabel: 'Potences & Casseroles',
    price: 130,
    oldPrice: 160,
    discount: 18,
    isSoldOut: false,
    rating: 4.6,
    reviewsCount: 14,
    image: '/bicyclehouse/products/poignees_vtt.png',
    images: [
      '/bicyclehouse/products/poignees_vtt.png'
    ],
    variants: [
      {
        name: 'Couleur',
        type: 'color',
        options: [
          { value: 'Noir', code: '#111111' },
          { value: 'Rouge', code: '#DC3545' },
          { value: 'Bleu', code: '#0D6EFD' }
        ]
      }
    ],
    description: 'Potence VTT ultra-légère en alliage d\'aluminium CNC. Diamètre de guidon 31.8mm, longueur 45mm. Idéale pour améliorer le contrôle et l\'agilité de votre pilotage.'
  },
  {
    id: 13,
    title: 'Gidon Wake 780 mm VTT Cintre',
    brand: 'WAKE',
    category: 'les-gidon',
    categoryLabel: 'Guidons & Cintres VTT',
    price: 100,
    oldPrice: 120,
    discount: 16,
    isSoldOut: false,
    rating: 4.8,
    reviewsCount: 15,
    image: '/bicyclehouse/products/gidon_wake_all.png',
    images: [
      '/bicyclehouse/products/gidon_wake_all.png',
      '/bicyclehouse/products/gidon_wake_noir.png',
      '/bicyclehouse/products/gidon_wake_rouge.png',
      '/bicyclehouse/products/gidon_wake_bleu.png',
      '/bicyclehouse/products/gidon_wake_or.png'
    ],
    variants: [
      {
        name: 'Couleur',
        type: 'color',
        options: [
          { value: 'Noir', code: '#111111', image: '/bicyclehouse/products/gidon_wake_noir.png' },
          { value: 'Rouge', code: '#DC3545', image: '/bicyclehouse/products/gidon_wake_rouge.png' },
          { value: 'Bleu', code: '#0D6EFD', image: '/bicyclehouse/products/gidon_wake_bleu.png' },
          { value: 'Or', code: '#FFD700', image: '/bicyclehouse/products/gidon_wake_or.png' }
        ]
      }
    ],
    description: 'Cintre VTT Wake Comp en alliage d\'aluminium de haute résistance. Longueur de 780mm pour un contrôle maximal, diamètre de fixation de 31.8mm. Disponible en plusieurs coloris anodisés.'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'Toutes les catégories', count: PRODUCTS.length },
  { id: 'les-pneu', name: 'les pneu', count: PRODUCTS.filter(p => p.category === 'les-pneu').length },
  { id: 'les-gidon', name: 'les gidon', count: PRODUCTS.filter(p => p.category === 'les-gidon').length },
  { id: 'les-selle', name: 'les selle', count: PRODUCTS.filter(p => p.category === 'les-selle').length },
  { id: 'les-potonce', name: 'les potonce', count: PRODUCTS.filter(p => p.category === 'les-potonce').length },
  { id: 'les-frein', name: 'les frein', count: PRODUCTS.filter(p => p.category === 'les-frein').length },
  { id: 'les-accesoires', name: 'les accesoires', count: PRODUCTS.filter(p => p.category === 'les-accesoires').length }
];

export const MOCK_ORDERS = [
  {
    id: 1709564800000,
    date: '03 Juin 2026, 18:45',
    customer: {
      fullName: 'Hamza Alaoui',
      phone: '0612345678',
      city: 'Casablanca',
      address: 'Appt 4, Immeuble B, Maarif'
    },
    items: [
      {
        product: {
          id: 8,
          title: 'Guidon VTT Carbon PRO Wake Rise',
          price: 320,
          image: '/bicyclehouse/products/guidon_vtt.png',
          brand: 'PIKALA DETACHEE'
        },
        quantity: 1,
        selectedVariants: {
          'Couleur': 'Rouge',
          'Diamètre': '31.8mm'
        }
      }
    ],
    total: 320,
    status: 'En attente'
  },
  {
    id: 1709489200000,
    date: '02 Juin 2026, 11:20',
    customer: {
      fullName: 'Youssef El Idrissi',
      phone: '0698765432',
      city: 'Marrakech',
      address: '12 Rue de la Liberté, Gueliz'
    },
    items: [
      {
        product: {
          id: 9,
          title: 'Selle de Vélo Selle Royal Gel Confort',
          price: 260,
          image: '/bicyclehouse/products/selle_velo.png',
          brand: 'PIKALA DETACHEE'
        },
        quantity: 1,
        selectedVariants: {
          'Type': 'Ergonomique Homme'
        }
      },
      {
        product: {
          id: 10,
          title: 'Poignées de Guidon VTT Double Lock-On',
          price: 90,
          image: '/bicyclehouse/products/poignees_vtt.png',
          brand: 'PIKALA DETACHEE'
        },
        quantity: 2,
        selectedVariants: {
          'Couleur des bagues': 'Bleu'
        }
      }
    ],
    total: 440,
    status: 'Confirmé'
  }
];
