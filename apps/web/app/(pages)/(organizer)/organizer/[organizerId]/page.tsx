"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

import { api } from "@/lib/api";
import { Organizer } from "@/types/types";

const dummyReviews = [
  {
    id: 1,
    rating: 5,
    comment: "Great organizer! The event was fantastic!",
  },
  {
    id: 2,
    rating: 4,
    comment: "Well organized, but could improve the registration process.",
  },
  {
    id: 3,
    rating: 3,
    comment: "The event was good, but the venue was too crowded.",
  },
];

const OrganizerIdPage = () => {
  const { organizerId } = useParams();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const response = await api(`/organizer/${organizerId}`, "GET"); // Ganti dengan URL API yang sesuai

        setOrganizer(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizer();
  }, [organizerId]);

  // If loading, show loading indicator
  if (loading) return <div>Loading...</div>;

  // If there was an error fetching the organizer

  // If no organizer data found
  if (!organizer || !organizerId) {
    return <div>Organizer not found</div>;
  }

  return (
    <div className="container mt-16 p-4">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-8/12">
          {/* Organizer Detail */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">{organizer.organizerName}</h1>

            <div className="mt-2 flex items-center gap-2">
              <Star className="text-yellow-500" />
              {/* <span>{organizer.rating} / 5</span>{" "} */}
              {/* Assuming you have rating */}
            </div>
            <Badge className="mt-4">{organizer.totalEvents} Events</Badge>
          </div>

          {/* Review Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {dummyReviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {dummyReviews.map((review) => (
                  <div key={review.id} className="border p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-500" />
                      <span className="font-semibold">{review.rating} / 5</span>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerIdPage;
