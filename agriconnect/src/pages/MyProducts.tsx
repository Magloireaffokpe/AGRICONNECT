import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Upload,
  X,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  useMyProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/shared/EmptyState";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { StarRating } from "../components/ui/StarRating";
import { formatPrice, imageUrl, categoryLabel } from "../utils/helpers";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  description: z.string().min(10, "Description trop courte"),
  category: z.string().min(1, "Catégorie requise"),
  price: z.coerce.number().positive("Prix invalide"),
  quantity_available: z.coerce.number().int().min(0, "Quantité invalide"),
});
type FormData = z.infer<typeof schema>;

const CATEGORIES = [
  { value: "FRUITS", label: "🍎 Fruits" },
  { value: "VEGETABLES", label: "🥦 Légumes" },
  { value: "CEREALS", label: "🌾 Céréales" },
  { value: "MEAT", label: "🥩 Viande" },
  { value: "DAIRY", label: "🥛 Laitiers" },
  { value: "OTHER", label: "📦 Autre" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  FRUITS: "🍎",
  VEGETABLES: "🥦",
  CEREALS: "🌾",
  MEAT: "🥩",
  DAIRY: "🥛",
  OTHER: "📦",
};

export default function MyProducts() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useMyProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedFile = useRef<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      name: "",
      description: "",
      category: "VEGETABLES",
      price: 0,
      quantity_available: 1,
    });
    setPreview(null);
    selectedFile.current = null;
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    reset({
      name: product.name,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      quantity_available: product.quantity_available,
    });
    setPreview(imageUrl(product.image));
    selectedFile.current = null;
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop grande (max 5 Mo)");
      return;
    }
    selectedFile.current = file;
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormData) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
    if (selectedFile.current) fd.append("image", selectedFile.current);
    if (editing) {
      await updateProduct.mutateAsync({ id: editing.id, fd });
    } else {
      await createProduct.mutateAsync(fd);
    }
    setModalOpen(false);
    setPreview(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteProduct.mutateAsync(deleteId);
    setDeleteId(null);
  };

  // Calcul stats rapides
  const totalProducts = products?.length ?? 0;
  const availableCount = products?.filter((p) => p.is_available).length ?? 0;
  const totalStock =
    products?.reduce((s, p) => s + p.quantity_available, 0) ?? 0;

  return (
    <>
      <Helmet>
        <title>Mes produits – AgriConnect</title>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-700 dark:text-green-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">
                  Mes produits
                </h1>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-sm ml-11">
                {totalProducts} produit{totalProducts > 1 ? "s" : ""} ·{" "}
                {availableCount} disponible{availableCount > 1 ? "s" : ""} ·{" "}
                {totalStock} unités en stock
              </p>
            </div>
            <Button
              onClick={openCreate}
              icon={<Plus className="w-4 h-4" />}
              className="shrink-0"
            >
              Nouveau produit
            </Button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !products?.length ? (
            <EmptyState
              icon="🌱"
              title="Aucun produit publié"
              description="Ajoutez votre premier produit pour commencer à vendre sur AgriConnect."
              action={{
                label: "Ajouter mon premier produit",
                onClick: openCreate,
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {products.map((product, i) => {
                  const imgSrc = imageUrl(product.image);
                  const emoji = CATEGORY_EMOJI[product.category] || "📦";
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        {/* Image */}
                        <div className="relative h-44 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 overflow-hidden">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                                const parent = (e.target as HTMLImageElement)
                                  .parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl opacity-40">${emoji}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
                              {emoji}
                            </div>
                          )}
                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                            <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur text-xs font-semibold px-2 py-0.5 rounded-full text-stone-600 dark:text-stone-300">
                              {categoryLabel[product.category] ||
                                product.category}
                            </span>
                          </div>
                          {!product.is_available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                Épuisé
                              </span>
                            </div>
                          )}
                          {/* Bouton voir */}
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 dark:bg-stone-900/90 backdrop-blur rounded-xl flex items-center justify-center text-stone-600 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            title="Voir le produit"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-4">
                          <h3 className="font-semibold text-stone-800 dark:text-stone-100 mb-1 truncate">
                            {product.name}
                          </h3>

                          {/* Rating si dispo */}
                          {product.review_count > 0 && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <StarRating
                                value={product.average_rating ?? 0}
                                size={11}
                              />
                              <span className="text-xs text-stone-400">
                                ({product.review_count})
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-green-700 dark:text-green-400 font-bold text-base">
                              {formatPrice(product.price)}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                product.quantity_available === 0
                                  ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                  : product.quantity_available < 10
                                    ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                                    : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                              }`}
                            >
                              {product.quantity_available} unités
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              icon={<Pencil className="w-3.5 h-3.5" />}
                              onClick={() => openEdit(product)}
                            >
                              Modifier
                            </Button>
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ── Modal création/édition ── */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? `Modifier "${editing.name}"` : "Nouveau produit"}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Upload image */}
            <div>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Image du produit{" "}
                <span className="text-stone-400 font-normal">
                  (optionnel, max 5 Mo)
                </span>
              </p>
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                  preview
                    ? "border-green-400 hover:border-green-500"
                    : "border-stone-200 dark:border-stone-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10"
                }`}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-800">
                        Changer l'image
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400">
                    <Upload className="w-7 h-7" />
                    <span className="text-sm">
                      Cliquez ou glissez une image
                    </span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nom du produit"
                placeholder="Ex: Tomates bio"
                error={errors.name?.message}
                {...register("name")}
              />
              <Select
                label="Catégorie"
                options={CATEGORIES}
                error={errors.category?.message}
                {...register("category")}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300 block mb-1.5">
                Description{" "}
                <span className="text-stone-400 font-normal">
                  (minimum 10 caractères)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Décrivez votre produit, sa qualité, son origine…"
                className={`input-field resize-none ${errors.description ? "border-red-400" : ""}`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠ {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prix (FCFA)"
                type="number"
                placeholder="Ex: 500"
                error={errors.price?.message}
                hint="Prix par unité"
                {...register("price")}
              />
              <Input
                label="Quantité disponible"
                type="number"
                placeholder="Ex: 100"
                error={errors.quantity_available?.message}
                hint="Unités en stock"
                {...register("quantity_available")}
              />
            </div>

            <div className="flex gap-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1">
                {editing
                  ? "✓ Enregistrer les modifications"
                  : "🌱 Publier le produit"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* ── Modal suppression ── */}
        <Modal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Supprimer le produit"
          size="sm"
        >
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-sm mb-6 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer ce produit ?<br />
              <strong className="text-stone-800 dark:text-stone-200">
                Cette action est irréversible.
              </strong>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              loading={deleteProduct.isPending}
              onClick={handleDelete}
              className="flex-1"
            >
              Supprimer définitivement
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}
