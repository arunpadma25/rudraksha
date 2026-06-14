export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-serif text-4xl font-bold text-brand-900">Our Story</h1>
      <p className="mt-4 text-lg text-brand-700">
        We are a family-run rudraksha farm nestled in the lush, rain-fed hills near Mangalore,
        Karnataka. Every bead we offer is grown by our own hands on our land — never sourced from
        traders or middlemen. From planting the sapling to harvesting the ripe bead, we nurture each
        rudraksha with patience, prayer, and pure organic care.
      </p>

      <div className="mt-10 space-y-8">
        <Section title="Home-Grown on Our Own Farm">
          Our rudraksha trees grow in the fertile coastal climate of the Mangalore region. Because
          we cultivate everything ourselves, we know the story behind every single bead — its tree,
          its season, and its journey to you.
        </Section>
        <Section title="100% Pure &amp; Organic">
          We use no chemical fertilisers, no pesticides, and no artificial treatments. Our beads are
          completely natural and chemical-free — just as nature and tradition intended. Each one is
          hand-harvested, sun-dried, gently cleaned, and energised with traditional Vedic rituals.
        </Section>
        <Section title="Worldwide, In Your Currency">
          Whether you are in India or anywhere across the globe, you can browse and shop in your
          preferred currency. Prices update instantly, and we ship worldwide with careful, loving
          packaging straight from our farm.
        </Section>
        <Section title="Our Promise to You">
          Direct from farm to your hands — honest, traceable, and authentic. If you are not
          satisfied, our 7-day easy return policy has you covered.
        </Section>
      </div>

      <div className="mt-12 rounded-2xl bg-amber-50 p-5 text-sm text-amber-700">
        Note: This is a demonstration store. Spiritual benefits described across the site are based
        on traditional belief and are not medical claims.
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-800">{title}</h2>
      <p className="mt-2 leading-relaxed text-brand-700">{children}</p>
    </div>
  );
}
