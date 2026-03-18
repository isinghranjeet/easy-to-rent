import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function BlogPGNearCU() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      
      {/* 🔥 SEO META TAGS */}
      <Helmet>
        <title>Best PG Near Chandigarh University (Kharar) | Affordable & Verified PG</title>

        <meta
          name="description"
          content="Find the best PG near Chandigarh University in Kharar. Affordable PG with food, WiFi, AC, and security. Explore verified PG listings on EasyToRent."
        />

        <meta
          name="keywords"
          content="PG near Chandigarh University, PG in Kharar, Boys PG near CU, Girls PG Kharar, Affordable PG Chandigarh University"
        />

        {/* Open Graph (Social Sharing) */}
        <meta property="og:title" content="Best PG Near Chandigarh University" />
        <meta
          property="og:description"
          content="Affordable and verified PG near Chandigarh University with food, WiFi & security."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://easytorent.in/blog/pg-near-chandigarh-university" />

        {/* 🔥 JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: "Best PG Near Chandigarh University in Kharar",
            description:
              "Find affordable and verified PG near Chandigarh University with food, WiFi and security.",
            author: {
              "@type": "Organization",
              name: "EasyToRent",
            },
            publisher: {
              "@type": "Organization",
              name: "EasyToRent",
            },
            mainEntityOfPage:
              "https://easytorent.in/blog/pg-near-chandigarh-university",
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto">

        {/* 🔥 H1 */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Best PG Near Chandigarh University in Kharar (Affordable & Verified)
        </h1>

        {/* Intro */}
        <p className="text-gray-700 mb-6">
          If you are searching for a PG near Chandigarh University, you are in the right place. 
          Kharar is one of the most popular student hubs where you can find affordable, fully 
          furnished PG accommodations with modern facilities like WiFi, food, and security.
          EasyToRent helps you discover verified PG listings near Chandigarh University quickly 
          and easily.
        </p>

        {/* Section */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Why Choose PG Near Chandigarh University?
        </h2>
        <p className="text-gray-700 mb-4">
          Staying near Chandigarh University helps students save time and travel costs. 
          Most PGs are located within walking distance or a short commute from the campus. 
          You also get easy access to markets, cafes, libraries, and transportation.
        </p>

        {/* Facilities */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Facilities Available in PG
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>High-speed WiFi connectivity</li>
          <li>Nutritious breakfast, lunch, and dinner</li>
          <li>24/7 security and CCTV surveillance</li>
          <li>Fully furnished AC/Non-AC rooms</li>
          <li>Laundry and housekeeping services</li>
        </ul>

        {/* Price */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          PG Price Range Near Chandigarh University
        </h2>
        <p className="text-gray-700">
          The average rent for PG near Chandigarh University ranges between 
          ₹4,000 to ₹12,000 per month depending on room type, facilities, and location.
        </p>

        {/* Areas */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Best Areas to Find PG Near Chandigarh University
        </h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Kharar</li>
          <li>Landran</li>
          <li>Sector 115 Mohali</li>
        </ul>

        {/* FAQ (🔥 VERY IMPORTANT FOR SEO) */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Frequently Asked Questions (FAQs)
        </h2>

        <div className="space-y-4 text-gray-700">
          <p><strong>Q1. What is the average PG rent near Chandigarh University?</strong><br/>
          ₹4,000 to ₹12,000 per month.</p>

          <p><strong>Q2. Are food and WiFi included?</strong><br/>
          Yes, most PGs provide food and high-speed internet.</p>

          <p><strong>Q3. Is it safe for girls?</strong><br/>
          Yes, many PGs offer CCTV and security guards.</p>
        </div>

        {/* Internal Linking */}
        <h2 className="text-2xl font-semibold mt-8 mb-3">
          Explore PG Listings
        </h2>

        <p className="text-gray-700 mb-6">
          Click below to explore verified PG listings near Chandigarh University:
        </p>

        <div className="text-center">
          <button
            onClick={() => navigate("/pg?location=Kharar")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Explore PG Near Chandigarh University
          </button>
        </div>

      </div>
    </div>
  );
}