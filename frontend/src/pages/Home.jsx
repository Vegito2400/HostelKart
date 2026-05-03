import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { ListingCard } from "../components/ListingCard";
import { CATEGORIES, fetchListings, getListings, subscribe } from "../lib/store";
import { PackageOpen } from "lucide-react";

export default function Home() {
  const [listings, setListings] = useState(() => getListings());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const unsub = subscribe(() => setListings(getListings()));
    fetchListings({ includeInactive: "true" }).then(setListings).catch(console.error);
    return unsub;
  }, []);

  const visible = useMemo(() => {
    return listings
      .filter((l) => l.status !== "removed")
      .filter((l) => (category === "All" ? true : l.category === category))
      .filter((l) =>
        search.trim()
          ? (l.title + " " + l.description).toLowerCase().includes(search.toLowerCase())
          : true,
      );
  }, [listings, search, category]);

  return (
    <Layout searchValue={search} onSearchChange={setSearch}>
      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-orange-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 mb-3">
            Campus Marketplace
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-2xl">
            Campus finds,<br className="hidden sm:block" /> sorted.
          </h1>
          <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">
            Buy and sell books, cycles, furniture and more — only within the college campus.
            No payment gateways, just hostel-to-hostel handoffs.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div
          data-testid="category-filters"
          className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
        >
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              data-testid={`category-pill-${c}`}
              onClick={() => setCategory(c)}
              className={
                c === category
                  ? "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white border border-orange-500"
                  : "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Mobile search */}
      <div className="md:hidden max-w-7xl mx-auto px-4 pt-4">
        <input
          data-testid="home-mobile-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings…"
          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-gray-900">
            {category === "All" ? "Fresh on campus" : category}
          </h2>
          <span data-testid="home-results-count" className="text-sm text-gray-500">
            {visible.length} {visible.length === 1 ? "listing" : "listings"}
          </span>
        </div>

        {visible.length === 0 ? (
          <div
            data-testid="home-empty-state"
            className="border border-dashed border-gray-300 rounded-lg py-16 flex flex-col items-center justify-center text-center"
          >
            <PackageOpen className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="font-heading text-lg font-semibold text-gray-900">No listings found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div
            data-testid="home-listings-grid"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {visible.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

