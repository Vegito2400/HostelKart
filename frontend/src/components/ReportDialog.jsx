import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { createReport } from "../lib/store";
import { useAuth } from "../context/AuthContext";

const REASONS = [
  { value: "inappropriate", label: "Inappropriate or offensive content" },
  { value: "scam", label: "Scam or fraudulent listing" },
  { value: "wrong_category", label: "Wrong category / spam" },
  { value: "prohibited", label: "Prohibited item" },
];

export const ReportDialog = ({ listingId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("inappropriate");
  const [details, setDetails] = useState("");

  const submit = () => {
    if (!user) {
      toast.error("Please log in to report a listing.");
      return;
    }
    createReport({ listingId, reporterId: user.id, reason, details });
    toast.success("Report submitted. Our admins will review it shortly.");
    setOpen(false);
    setDetails("");
    setReason("inappropriate");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid="report-dialog-trigger"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Flag className="h-4 w-4 mr-2" /> Report listing
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="report-dialog-content" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Report this listing</DialogTitle>
          <DialogDescription>
            Let our admins know why this listing should be reviewed. Reports are anonymous to the seller.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
            {REASONS.map((r) => (
              <div key={r.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={r.value}
                  id={`reason-${r.value}`}
                  data-testid={`report-reason-${r.value}`}
                />
                <Label htmlFor={`reason-${r.value}`} className="text-sm font-normal text-gray-700">
                  {r.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-1.5">
            <Label htmlFor="report-details" className="text-sm">
              Additional details (optional)
            </Label>
            <Textarea
              id="report-details"
              data-testid="report-details-input"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Anything the admins should know?"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            data-testid="report-submit-btn"
            onClick={submit}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

