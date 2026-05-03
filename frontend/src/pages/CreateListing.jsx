import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CATEGORIES, CONDITIONS, createListing } from "../lib/store";
import { useAuth } from "../context/AuthContext";

// Read a File as a base64 data URL (stored in localStorage since this is frontend-only).
const readAsDataUrl = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    condition: "Good",
  });
  const [images, setImages] = useState([]); // data URLs
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onFiles = async (fileList) => {
    const files = Array.from(fileList).slice(0, 4 - images.length);
    const urls = [];
    for (const f of files) {
      if (f.size > 1.5 * 1024 * 1024) {
        toast.error(`${f.name} is larger than 1.5MB (localStorage limit).`);
        continue;
      }
      urls.push(await readAsDataUrl(f));
    }
    setImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const submit = async (e) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      toast.error("Enter a valid price greater than 0.");
      return;
    }
    setLoading(true);
    try {
      const listing = await createListing({
        title: form.title.trim(),
        description: form.description.trim(),
        price: priceNum,
        category: form.category,
        condition: form.condition,
        images,
        sellerId: user.id,
      });
      toast.success("Listing posted!");
      navigate(`/listing/${listing.id}`);
    } catch (err) {
      toast.error(err.message || "Could not create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 mb-1">
            New listing
          </p>
          <h1 className="font-heading text-3xl font-bold text-gray-900">
            Post something for campus
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Buyers on your campus will find it and reach out directly — no payment gateway, just a handoff.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white p-6 md:p-8 border border-gray-200 rounded-lg space-y-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="l-title">Title</Label>
            <Input
              id="l-title"
              data-testid="create-title-input"
              value={form.title}
              onChange={update("title")}
              placeholder="e.g. Hero Sprint Cycle — 21 Gear"
              className="focus-visible:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="l-price">Price (₹)</Label>
              <Input
                id="l-price"
                data-testid="create-price-input"
                type="number"
                min={1}
                value={form.price}
                onChange={update("price")}
                placeholder="1200"
                className="focus-visible:ring-orange-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger data-testid="create-category-trigger" className="focus:ring-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} data-testid={`create-category-opt-${c}`}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
              <SelectTrigger data-testid="create-condition-trigger" className="focus:ring-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="l-desc">Description</Label>
            <Textarea
              id="l-desc"
              data-testid="create-description-input"
              value={form.description}
              onChange={update("description")}
              placeholder="Condition, pickup location, anything a buyer should know."
              rows={5}
              className="focus-visible:ring-orange-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Images (up to 4)</Label>
            <label
              data-testid="create-image-dropzone"
              className="flex flex-col items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30"
            >
              <Upload className="h-5 w-5 text-gray-400" />
              <span>Click to upload images (JPG/PNG, &lt;1.5MB each)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                data-testid="create-image-input"
                onChange={(e) => onFiles(e.target.files)}
              />
            </label>
            {images.length > 0 && (
              <div data-testid="create-image-previews" className="grid grid-cols-4 gap-2 mt-2">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      data-testid={`remove-image-${i}`}
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-white text-red-600 rounded-full p-1 shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              data-testid="create-submit-btn"
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Posting…" : "Post listing"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
