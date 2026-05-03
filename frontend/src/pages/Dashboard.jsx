import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  PackageOpen,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  deleteListing,
  fetchListings,
  getConversationsForUser,
  getListingById,
  getListingsBySeller,
  getUserById,
  subscribe,
  updateListing,
} from "../lib/store";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1));
    fetchListings({ sellerId: user.id }).catch(console.error);
    return unsub;
  }, [user.id]);

  const myListings = useMemo(() => getListingsBySeller(user.id), [user.id, setTick]); // eslint-disable-line
  const myConvos = useMemo(() => getConversationsForUser(user.id), [user.id, setTick]); // eslint-disable-line

  const refresh = () => setTick((t) => t + 1);

  const onToggleSold = async (id, currentStatus) => {
    await updateListing(id, { status: currentStatus === "sold" ? "active" : "sold" });
    toast.success("Listing updated.");
    refresh();
  };

  const onDelete = async (id) => {
    await deleteListing(id);
    toast.success("Listing deleted.");
    refresh();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 mb-1">
              Your dashboard
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900">
              Hi, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your listings and conversations in one place.
            </p>
          </div>
          <Button
            data-testid="dashboard-new-listing-btn"
            onClick={() => navigate("/create")}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> New listing
          </Button>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="bg-gray-100">
            <TabsTrigger data-testid="dashboard-tab-listings" value="listings">
              My listings ({myListings.length})
            </TabsTrigger>
            <TabsTrigger data-testid="dashboard-tab-messages" value="messages">
              Messages ({myConvos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            {myListings.length === 0 ? (
              <EmptyListings />
            ) : (
              <div
                data-testid="dashboard-listings-list"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {myListings.map((l) => (
                  <Card
                    key={l.id}
                    data-testid={`my-listing-${l.id}`}
                    className="bg-white border border-gray-200 overflow-hidden"
                  >
                    <Link to={`/listing/${l.id}`}>
                      <div className="aspect-video bg-gray-100">
                        {l.images?.[0] && (
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={
                            l.status === "sold"
                              ? "bg-gray-900 text-white hover:bg-gray-900"
                              : "bg-green-50 text-green-700 border-0 hover:bg-green-50"
                          }
                        >
                          {l.status === "sold" ? "Sold" : "Active"}
                        </Badge>
                        <span className="font-heading font-bold text-orange-600">
                          ₹{Number(l.price).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-gray-900 line-clamp-1">
                        {l.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{l.description}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          data-testid={`toggle-sold-${l.id}`}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => onToggleSold(l.id, l.status)}
                        >
                          {l.status === "sold" ? (
                            <>
                              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark sold
                            </>
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              data-testid={`delete-listing-${l.id}`}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will also remove related messages and reports. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                data-testid={`confirm-delete-${l.id}`}
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => onDelete(l.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            {myConvos.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg py-16 text-center">
                <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  No conversations yet
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Start a chat from any listing to negotiate and arrange a meetup.
                </p>
              </div>
            ) : (
              <div data-testid="dashboard-conversations-list" className="space-y-2">
                {myConvos.map((c) => {
                  const listing = getListingById(c.listingId);
                  const otherId = c.buyerId === user.id ? c.sellerId : c.buyerId;
                  const other = getUserById(otherId);
                  if (!listing) return null;
                  return (
                    <Link
                      key={c.key}
                      to={`/listing/${listing.id}?chatWith=${otherId}`}
                      data-testid={`convo-row-${c.key}`}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all"
                    >
                      {listing.images?.[0] && (
                        <img
                          src={listing.images[0]}
                          alt=""
                          className="h-14 w-14 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-heading font-semibold text-gray-900 truncate">
                            {other?.name || "User"}
                          </h4>
                          <span className="text-xs text-gray-400 shrink-0">
                            {new Date(c.lastAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {listing.title}
                        </p>
                        <p className="text-sm text-gray-700 truncate mt-0.5">
                          {c.lastMessage}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

const EmptyListings = () => {
  const navigate = useNavigate();
  return (
    <div
      data-testid="dashboard-empty-listings"
      className="border border-dashed border-gray-300 rounded-lg py-20 flex flex-col items-center justify-center text-center"
    >
      <PackageOpen className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="font-heading text-xl font-semibold text-gray-900">
        You haven't posted anything yet
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-5">
        Post your first listing in under a minute.
      </p>
      <Button
        data-testid="dashboard-empty-create-btn"
        onClick={() => navigate("/create")}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        <Plus className="h-4 w-4 mr-1" /> Create listing
      </Button>
    </div>
  );
};
