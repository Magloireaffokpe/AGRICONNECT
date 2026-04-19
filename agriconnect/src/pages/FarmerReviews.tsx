import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Star, MessageCircle } from "lucide-react";
import { useFarmerReviews } from "../hooks/useReviews";
import { Card } from "../components/ui/Card";
import { StarRating } from "../components/ui/StarRating";
import { EmptyState } from "../components/shared/EmptyState";
import { Spinner } from "../components/shared/Loader";
import { formatDate } from "../utils/helpers";

export default function FarmerReviews() {
  const { data, isLoading } = useFarmerReviews();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Avis sur mes produits – AgriConnect</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="w-7 h-7 text-green-700" />
            <h1 className="text-3xl font-bold text-stone-800">
              Avis sur mes produits
            </h1>
          </div>

          {!data?.results.length ? (
            <EmptyState
              icon="⭐"
              title="Aucun avis"
              description="Les avis de vos clients apparaîtront ici."
            />
          ) : (
            <div className="space-y-4">
              {data.results.map((review) => (
                <Card key={review.id} padding="md">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-stone-800">
                        {review.product_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating value={review.rating} size={16} />
                        <span className="text-sm text-stone-500">
                          par {review.buyer_name}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-stone-600 mt-2 text-sm">
                          {review.comment}
                        </p>
                      )}
                      <p className="text-xs text-stone-400 mt-2">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
