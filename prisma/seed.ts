import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedProduct = {
  mukhi: number;
  name: string;
  slug: string;
  origin: string;
  shortDesc: string;
  description: string;
  benefits: string[];
  rulingPlanet?: string;
  deity?: string;
  mantra?: string;
  priceInr: number;
  compareAtInr?: number;
  stock: number;
  featured?: boolean;
};

const products: SeedProduct[] = [
  {
    mukhi: 1,
    name: "1 Mukhi Rudraksha (Round)",
    slug: "1-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "The rarest and most powerful bead, symbolising Lord Shiva himself.",
    description:
      "The One Mukhi Rudraksha is considered the king of all rudraksha beads. It represents the formless Supreme - Lord Shiva. Wearing it is believed to bring focus, spiritual elevation and detachment from worldly distractions. Genuine round one mukhi beads are extremely rare.",
    benefits: [
      "Supports deep concentration and meditation",
      "Believed to bring prosperity and inner peace",
      "Helps in spiritual awakening and self-realisation",
    ],
    rulingPlanet: "Sun",
    deity: "Lord Shiva",
    mantra: "Om Hreem Namah",
    priceInr: 45000,
    compareAtInr: 55000,
    stock: 3,
    featured: true,
  },
  {
    mukhi: 2,
    name: "2 Mukhi Rudraksha",
    slug: "2-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of unity and harmony, ruled by the Moon.",
    description:
      "The Two Mukhi Rudraksha represents Ardhanareeshwar - the union of Shiva and Shakti. It is recommended for harmony in relationships, emotional balance and unity between partners.",
    benefits: [
      "Promotes harmony in relationships and marriage",
      "Calms the mind and balances emotions",
      "Believed to strengthen unity and trust",
    ],
    rulingPlanet: "Moon",
    deity: "Ardhanareeshwar",
    mantra: "Om Namah",
    priceInr: 1200,
    compareAtInr: 1600,
    stock: 25,
    featured: true,
  },
  {
    mukhi: 3,
    name: "3 Mukhi Rudraksha",
    slug: "3-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of energy and confidence, ruled by Mars.",
    description:
      "The Three Mukhi Rudraksha is associated with Agni (the fire god). It is said to burn away past karma, guilt and inferiority, helping the wearer move forward with confidence and vitality.",
    benefits: [
      "Helps release guilt and past trauma",
      "Boosts confidence and self-esteem",
      "Supports those recovering from stress or illness",
    ],
    rulingPlanet: "Mars",
    deity: "Agni",
    mantra: "Om Kleem Namah",
    priceInr: 900,
    stock: 30,
  },
  {
    mukhi: 4,
    name: "4 Mukhi Rudraksha",
    slug: "4-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of knowledge and creativity, ruled by Mercury.",
    description:
      "The Four Mukhi Rudraksha represents Lord Brahma, the creator. It is recommended for students, teachers and anyone seeking improved memory, communication and creative expression.",
    benefits: [
      "Enhances memory, focus and learning",
      "Improves communication and speech",
      "Supports creativity and clear thinking",
    ],
    rulingPlanet: "Mercury",
    deity: "Brahma",
    mantra: "Om Hreem Namah",
    priceInr: 700,
    stock: 40,
  },
  {
    mukhi: 5,
    name: "5 Mukhi Rudraksha",
    slug: "5-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "The most popular bead for health and peace, ruled by Jupiter.",
    description:
      "The Five Mukhi Rudraksha is the most common and widely worn bead. Representing Kalagni Rudra, it is known for promoting overall health, calmness and spiritual well-being. Ideal for daily wear and for malas.",
    benefits: [
      "Promotes calmness and reduces stress",
      "Supports blood pressure and overall health",
      "Excellent for daily meditation and japa",
    ],
    rulingPlanet: "Jupiter",
    deity: "Kalagni Rudra",
    mantra: "Om Hreem Namah",
    priceInr: 250,
    compareAtInr: 400,
    stock: 100,
    featured: true,
  },
  {
    mukhi: 6,
    name: "6 Mukhi Rudraksha",
    slug: "6-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of willpower and grounding, ruled by Venus.",
    description:
      "The Six Mukhi Rudraksha represents Lord Kartikeya. It balances the energy of Venus, enhancing willpower, learning ability and emotional stability while grounding the wearer.",
    benefits: [
      "Improves willpower and determination",
      "Supports emotional stability and grounding",
      "Believed to enhance charm and relationships",
    ],
    rulingPlanet: "Venus",
    deity: "Kartikeya",
    mantra: "Om Hreem Hum Namah",
    priceInr: 600,
    stock: 35,
  },
  {
    mukhi: 7,
    name: "7 Mukhi Rudraksha",
    slug: "7-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of wealth and prosperity, blessed by Mahalakshmi.",
    description:
      "The Seven Mukhi Rudraksha is associated with Goddess Mahalakshmi. It is worn to attract wealth, remove financial obstacles and reduce the malefic effects of Saturn (Shani).",
    benefits: [
      "Believed to attract wealth and abundance",
      "Helps reduce the ill effects of Saturn",
      "Supports business growth and stability",
    ],
    rulingPlanet: "Saturn",
    deity: "Mahalakshmi",
    mantra: "Om Hum Namah",
    priceInr: 800,
    stock: 28,
  },
  {
    mukhi: 8,
    name: "8 Mukhi Rudraksha",
    slug: "8-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of Lord Ganesha, remover of obstacles.",
    description:
      "The Eight Mukhi Rudraksha represents Lord Ganesha. It is worn to remove obstacles, ensure success in new ventures and protect against the negative effects of Rahu.",
    benefits: [
      "Removes obstacles and brings success",
      "Reduces malefic effects of Rahu",
      "Supports new beginnings and ventures",
    ],
    rulingPlanet: "Rahu",
    deity: "Ganesha",
    mantra: "Om Hum Namah",
    priceInr: 1100,
    stock: 20,
  },
  {
    mukhi: 9,
    name: "9 Mukhi Rudraksha",
    slug: "9-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of power and fearlessness, blessed by Goddess Durga.",
    description:
      "The Nine Mukhi Rudraksha embodies the energy of Goddess Durga. It bestows courage, energy and protection, and helps counter the negative effects of Ketu.",
    benefits: [
      "Bestows courage and fearlessness",
      "Reduces malefic effects of Ketu",
      "Boosts energy and dynamism",
    ],
    rulingPlanet: "Ketu",
    deity: "Durga",
    mantra: "Om Hreem Hum Namah",
    priceInr: 1300,
    stock: 18,
  },
  {
    mukhi: 10,
    name: "10 Mukhi Rudraksha",
    slug: "10-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of protection, blessed by Lord Vishnu.",
    description:
      "The Ten Mukhi Rudraksha represents Lord Vishnu. Acting like a shield, it protects the wearer from negative energies, black magic and planetary doshas. No specific mantra is required.",
    benefits: [
      "Acts as a protective shield",
      "Pacifies all nine planets (Navagraha)",
      "Wards off negative energies and evil eye",
    ],
    rulingPlanet: "All planets",
    deity: "Vishnu",
    mantra: "Om Hreem Namah",
    priceInr: 1500,
    stock: 15,
  },
  {
    mukhi: 11,
    name: "11 Mukhi Rudraksha",
    slug: "11-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of wisdom and courage, blessed by Lord Hanuman.",
    description:
      "The Eleven Mukhi Rudraksha is associated with Lord Hanuman. It grants wisdom, right judgement, courage and success, and supports a disciplined, fearless life.",
    benefits: [
      "Enhances wisdom and decision-making",
      "Grants courage and confidence",
      "Supports discipline and self-control",
    ],
    rulingPlanet: "No specific planet",
    deity: "Hanuman",
    mantra: "Om Hreem Hum Namah",
    priceInr: 1700,
    stock: 12,
  },
  {
    mukhi: 12,
    name: "12 Mukhi Rudraksha",
    slug: "12-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of radiance and leadership, ruled by the Sun.",
    description:
      "The Twelve Mukhi Rudraksha carries the brilliance of the Sun (Surya). It bestows leadership qualities, vitality, confidence and a commanding personality.",
    benefits: [
      "Enhances leadership and authority",
      "Boosts vitality and self-confidence",
      "Strengthens a weak Sun in the horoscope",
    ],
    rulingPlanet: "Sun",
    deity: "Surya",
    mantra: "Om Kraum Sraum Raum Namah",
    priceInr: 2200,
    stock: 10,
  },
  {
    mukhi: 13,
    name: "13 Mukhi Rudraksha",
    slug: "13-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead of charm and fulfilment, ruled by Venus.",
    description:
      "The Thirteen Mukhi Rudraksha is connected with Indra and Kamadeva. It is worn for charm, attraction, fulfilment of desires and material as well as spiritual gains.",
    benefits: [
      "Enhances charm and magnetism",
      "Helps fulfil worldly desires",
      "Supports success in negotiations",
    ],
    rulingPlanet: "Venus",
    deity: "Kamadeva / Indra",
    mantra: "Om Hreem Namah",
    priceInr: 3500,
    stock: 8,
  },
  {
    mukhi: 14,
    name: "14 Mukhi Rudraksha (Dev Mani)",
    slug: "14-mukhi-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "The 'Deva Mani' - divine gem of intuition and protection.",
    description:
      "The Fourteen Mukhi Rudraksha, known as Deva Mani, is among the most precious beads. It awakens intuition (the third eye), provides protection and removes obstacles, and is said to strengthen Saturn and Mars.",
    benefits: [
      "Awakens intuition and the third eye",
      "Offers strong protection",
      "Supports decisive, fearless action",
    ],
    rulingPlanet: "Saturn / Mars",
    deity: "Hanuman",
    mantra: "Om Namah",
    priceInr: 6500,
    compareAtInr: 7500,
    stock: 5,
    featured: true,
  },
  {
    mukhi: 0,
    name: "Gauri Shankar Rudraksha",
    slug: "gauri-shankar-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Two naturally joined beads symbolising Shiva-Parvati union.",
    description:
      "The Gauri Shankar Rudraksha is formed by two naturally conjoined beads, symbolising the divine union of Lord Shiva and Goddess Parvati. It is the ideal bead for love, marital harmony and family unity.",
    benefits: [
      "Strengthens love and marital harmony",
      "Promotes unity and understanding in the family",
      "Balances masculine and feminine energies",
    ],
    rulingPlanet: "Moon",
    deity: "Shiva-Parvati",
    mantra: "Om Gauri Shankaraya Namah",
    priceInr: 1800,
    stock: 14,
    featured: true,
  },
  {
    mukhi: 0,
    name: "Ganesh Rudraksha",
    slug: "ganesh-rudraksha",
    origin: "Mangalore, Karnataka",
    shortDesc: "Bead with a natural trunk-like protrusion, blessed by Ganesha.",
    description:
      "The Ganesh Rudraksha has a natural trunk-like protrusion on its surface, resembling Lord Ganesha. It is worn to remove obstacles and bring wisdom, success and auspicious beginnings.",
    benefits: [
      "Removes obstacles from all endeavours",
      "Brings wisdom and success",
      "Ideal for new beginnings",
    ],
    rulingPlanet: "Ketu",
    deity: "Ganesha",
    mantra: "Om Gam Ganapataye Namah",
    priceInr: 950,
    stock: 22,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@rudraksha.test";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  // Admin user
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Store Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  // Sample customer
  await prisma.user.upsert({
    where: { email: "customer@rudraksha.test" },
    update: {},
    create: {
      email: "customer@rudraksha.test",
      name: "Sample Customer",
      passwordHash: await bcrypt.hash("customer12345", 10),
      role: "USER",
    },
  });

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        mukhi: p.mukhi,
        origin: p.origin,
        shortDesc: p.shortDesc,
        description: p.description,
        benefits: p.benefits.join("\n"),
        rulingPlanet: p.rulingPlanet,
        deity: p.deity,
        mantra: p.mantra,
        priceInr: p.priceInr,
        compareAtInr: p.compareAtInr ?? null,
        stock: p.stock,
        featured: p.featured ?? false,
      },
      create: {
        slug: p.slug,
        name: p.name,
        mukhi: p.mukhi,
        origin: p.origin,
        shortDesc: p.shortDesc,
        description: p.description,
        benefits: p.benefits.join("\n"),
        rulingPlanet: p.rulingPlanet,
        deity: p.deity,
        mantra: p.mantra,
        priceInr: p.priceInr,
        compareAtInr: p.compareAtInr ?? null,
        stock: p.stock,
        featured: p.featured ?? false,
      },
    });
  }

  // Sample reviews for a few products so the storefront looks alive.
  const sampleReviews: Record<string, { authorName: string; rating: number; comment: string }[]> = {
    "5-mukhi-rudraksha": [
      { authorName: "Anita R.", rating: 5, comment: "Beautiful bead, felt calmer within days. Lovely packaging too." },
      { authorName: "David M.", rating: 5, comment: "Authentic and energised as promised. Shipped to the UK quickly." },
      { authorName: "Suresh K.", rating: 4, comment: "Good quality for daily wear. Happy with the purchase." },
    ],
    "gauri-shankar-rudraksha": [
      { authorName: "Priya S.", rating: 5, comment: "Gifted to my husband — gorgeous naturally joined bead." },
      { authorName: "Meera T.", rating: 4, comment: "Brought a lovely sense of harmony at home." },
    ],
    "14-mukhi-rudraksha": [
      { authorName: "Rahul V.", rating: 5, comment: "A truly special Deva Mani. Worth every rupee." },
    ],
    "2-mukhi-rudraksha": [
      { authorName: "Kavya N.", rating: 5, comment: "Soothing and beautifully finished." },
      { authorName: "John P.", rating: 4, comment: "Exactly as described. Will buy again." },
    ],
  };

  for (const [slug, reviews] of Object.entries(sampleReviews)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;
    await prisma.review.deleteMany({ where: { productId: product.id } });
    for (const r of reviews) {
      await prisma.review.create({ data: { productId: product.id, ...r } });
    }
    const agg = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: product.id },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
    });
  }

  const count = await prisma.product.count();
  console.log(`Seed complete. Products in catalog: ${count}`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("Customer login: customer@rudraksha.test / customer12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
