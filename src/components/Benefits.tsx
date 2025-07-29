import Image from "next/image"

const benefits = [
   {
      name: "To the Farmer",
      description: "Our platform provides direct access to a wider customer base, cutting out intermediaries and increasing profitability. Farmers can showcase their produce, set their own prices, and receive timely payments, fostering sustainable growth and financial stability.",
      image: "/farmer.jpg"
   },
   {
      name: "To the Customer",
      description: "The marketplace offers access to fresh, locally sourced produce, directly from farmers. This ensures higher quality and supports local agriculture. Customers can discover a variety of products, learn about the origins of their food, and enjoy a transparent and trustworthy purchasing experience.",
      image: "/customer.jpg"
   }
]

const Benefits = () => {
   return (
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-0">
         <h2 className="text-2xl sm:text-3xl font-bold text-center">What are the benefits of E-Farmlink?</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {benefits.map((benefit) => (
               <div key={benefit.name}>
                  <div className="flex flex-col items-center gap-2">
                     <Image src={benefit.image} alt={benefit.name} width={500} height={500} className="rounded-full object-cover w-44 h-44" />
                     <h3 className="text-lg font-bold text-green-900">{benefit.name}</h3>
                     <p className="text-gray-500 text-center">
                        {benefit.description}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

export default Benefits
