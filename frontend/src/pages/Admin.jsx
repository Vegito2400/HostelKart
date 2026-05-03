import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ShieldCheck, Trash2, X } from "lucide-react";
import {
  deleteListing,
  dismissReport,
  fetchReports,
  getListingById,
  getReports,
  getUserById,
  subscribe,
  updateReportStatus,
} from "../lib/store";

const REASON_LABEL = {
  inappropriate: "Inappropriate",
  fraud: "Fraud",
  spam: "Spam",
  duplicate: "Duplicate",
  other: "Other",
};

export default function Admin() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => setTick((t) => t + 1));
    fetchReports().catch(console.error);
    return unsub;
  }, []);

  const reports = useMemo(() => getReports(), [setTick]); // eslint-disable-line
  const open = reports.filter((r) => r.status === "pending");
  const resolved = reports.filter((r) => r.status !== "pending");

  const onDelete = async (reportId, listingId) => {
    try {
      await deleteListing(listingId);
      await updateReportStatus(reportId, "resolved");
      await fetchReports();
      toast.success("Listing removed and report resolved.");
    } catch (err) {
      toast.error(err.message || "Could not remove listing.");
    }
  };

  const onDismiss = async (id) => {
    try {
      await dismissReport(id);
      toast.success("Report rejected.");
    } catch (err) {
      toast.error(err.message || "Could not reject report.");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-900">Admin panel</h1>
            <p className="text-sm text-gray-500">Review reported listings and take action.</p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="font-heading text-lg font-semibold text-gray-900 mb-3">
            Open reports{" "}
            <span data-testid="admin-open-count" className="text-gray-400 font-normal">
              ({open.length})
            </span>
          </h2>
          {open.length === 0 ? (
            <div
              data-testid="admin-no-open-reports"
              className="border border-dashed border-gray-300 rounded-lg py-10 text-center text-sm text-gray-500"
            >
              Nothing to review. The campus is behaving itself.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <Table data-testid="admin-open-reports-table">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Listing</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {open.map((r) => {
                    const listing = getListingById(r.listingId);
                    const reporter = getUserById(r.reporterId);
                    return (
                      <TableRow key={r.id} data-testid={`admin-report-row-${r.id}`}>
                        <TableCell>
                          {listing ? (
                            <Link
                              to={`/listing/${listing.id}`}
                              className="text-gray-900 font-medium hover:text-orange-600"
                            >
                              {listing.title}
                            </Link>
                          ) : (
                            <span className="text-gray-400">Deleted listing</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-50 text-red-700 border-0 hover:bg-red-50">
                            {REASON_LABEL[r.reason] || r.reason}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {reporter?.name || "Unknown"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {r.details || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            {listing && (
                              <Button
                                data-testid={`admin-delete-listing-${r.id}`}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => onDelete(r.id, listing.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete listing
                              </Button>
                            )}
                            <Button
                              data-testid={`admin-dismiss-${r.id}`}
                              size="sm"
                              variant="outline"
                              onClick={() => onDismiss(r.id)}
                            >
                              <X className="h-3.5 w-3.5 mr-1" /> Reject report
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        {resolved.length > 0 && (
          <section>
            <h2 className="font-heading text-lg font-semibold text-gray-900 mb-3">
              Resolved ({resolved.length})
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Listing</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolved.map((r) => {
                    const listing = getListingById(r.listingId);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="text-sm text-gray-700">
                          {listing?.title || <span className="text-gray-400">Deleted listing</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            {REASON_LABEL[r.reason] || r.reason}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 capitalize">{r.status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

