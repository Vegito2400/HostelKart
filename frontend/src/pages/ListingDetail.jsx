import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, MapPin, Tag } from "lucide-react";
import { ReportDialog } from "../components/ReportDialog";
import { ChatDrawer } from "../components/ChatDrawer";
import { fetchListingById, getListingById, getUserById, subscribe } from "../lib/store";
import { useAuth } from "../context/AuthContext";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1));
    fetchListingById(id)
      .catch(console.error)
      .finally(() => setLoading(false));
    return unsub;
  }, [id]);

  const listing = getListingById(id);

  if (loading && !listing) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
          Loading listing...
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-gray-900">Listing not found</h1>
          <p className="text-sm text-gray-500 mt-2">
            This listing may have been removed by the seller or an admin.
          </p>
          <Button onClick={() => navigate("/")} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
            Back to marketplace
          </Button>
        </div>
      </Layout>
    );
  }

  const seller = getUserById(listing.sellerId);
  const isOwner = user?.id === listing.sellerId;

  // chatWith query lets sellers reply to a specific buyer via the dashboard.
  const chatPartnerId = params.get("chatWith");
  const buyerId = isOwner ? chatPartnerId : user?.id;
  const sellerId = listing.sellerId;
  const canChat = user && buyerId && buyerId !== sellerId;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          data-testid="listing-back-btn"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Images */}
          <div className="md:col-span-3 space-y-3">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {listing.images?.[0] ? (
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="aspect-square object-cover rounded-md border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <div className="sticky top-20 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-0">
                  {listing.category}
                </Badge>
                {listing.status === "sold" && (
                  <Badge className="bg-gray-900 text-white hover:bg-gray-900">Sold</Badge>
                )}
              </div>
              <h1 data-testid="listing-title" className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {listing.title}
              </h1>
              <div data-testid="listing-price" className="font-heading text-3xl font-bold text-orange-600">
                ₹{Number(listing.price).toLocaleString()}
              </div>

              <div className="text-sm text-gray-600 flex items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <Tag className="h-4 w-4" /> {listing.condition}
                </span>
                {seller?.hostel && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {seller.hostel}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                  Seller
                </p>
                <p data-testid="listing-seller-name" className="font-medium text-gray-900">
                  {seller?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">{seller?.email}</p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {isOwner ? (
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full" data-testid="listing-manage-btn">
                      Manage from dashboard
                    </Button>
                  </Link>
                ) : canChat ? (
                    // <></>
                  <ChatDrawer listing={listing} buyerId={buyerId} sellerId={sellerId} />
                ) : !user ? (
                  <Button
                    data-testid="listing-login-to-chat"
                    onClick={() => navigate("/login")}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Log in to chat
                  </Button>
                ) : null}

                {!isOwner && user && <ReportDialog listingId={listing.id} />}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Description
                </p>
                <p data-testid="listing-description" className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
