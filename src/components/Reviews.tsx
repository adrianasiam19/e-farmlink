import { FaStar } from "react-icons/fa";

const reviews = [
   {
      name: 'Christian Anyanful',
      review: 'I posted my farm produce and got a buyer within 24 hours. I was very happy with the service.',
      rating: 5,
   },
   {
      name: 'Benjamin Kommey',
      review: 'I am currently in Germany but after creating an account I was able to order farm produce from a farmer in my hometown to my parents who live in Accra and the service was amazing, especially the fact that I could do it from anywhere!',
      rating: 4,
   },
   {
      name: 'Abdul Latif',
      review: 'Posting my farm produce is so easy and accessible. I can do it on my phone too! I love the fact that I can set my own price and I can see how much I am making from my farm produce.',
      rating: 4,
   },
]

const Reviews = () => {
   return (
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-0">
         <h2 className="text-2xl sm:text-3xl font-bold text-center">See What Happy Customers Are Saying About E-Farmlink</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {reviews.map((review) => (
               <div key={review.name} className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                     <h3 className="text-lg font-bold">{review.name}</h3>
                     <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, index) => (
                           <FaStar key={index} className="text-yellow-500" />
                        ))}
                     </div>
                  </div>
                  <p className="text-sm text-gray-500 max-w-sm">{review.review}</p>
               </div>
            ))}
         </div>
      </div>
   )
}

export default Reviews
