import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";
import { getUserById } from "../lib/store";

const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const statusStyles = {
  active: "bg-green-50 text-green-700 hover:bg-green-50 border-0",
  reserved: "bg-blue-50 text-blue-700 hover:bg-blue-50 border-0",
  sold: "bg-gray-900 text-white hover:bg-gray-900 border-0",
};

export const ListingCard = ({ listing, testIdPrefix = "listing-card" }) => {
  const seller = getUserById(listing.sellerId);
  const cover = listing.images?.[0];
  const status = listing.status || "active";

  return (
    <Link to={`/listing/${listing.id}`} data-testid={`${testIdPrefix}-${listing.id}`}>
      <Card className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={listing.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-0 text-[11px]">
              {listing.category}
            </Badge>
            <Badge
              data-testid={`${testIdPrefix}-status-${listing.id}`}
              className={`${statusStyles[status] || statusStyles.active} text-[11px] capitalize`}
            >
              {status}
            </Badge>
          </div>
          <h3 className="font-heading text-[15px] font-semibold text-gray-900 line-clamp-2 leading-snug">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <span className="font-heading text-lg font-bold text-orange-600">
              ₹{Number(listing.price).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {timeAgo(listing.createdAt)}
            </span>
          </div>
          {seller && (
            <p className="text-xs text-gray-500 pt-1 truncate">
              {seller.name} · {seller.hostel || "Campus"}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};

