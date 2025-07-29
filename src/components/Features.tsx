import Image from 'next/image'

const Features = () => {
  return (
    <div className="bg-green-50">
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center gap-2">
            <Image src="/feature1.jpg" alt="Feature 1" width={500} height={500} className="rounded-full object-cover w-44 h-44" />
            <h3 className="text-lg font-bold text-green-900">Easy to Use</h3>
            <p className="text-gray-500 text-center">
              Our platform is designed to be user-friendly, making it easy for farmers to post their products and for customers to find and purchase them.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/feature2.jpg" alt="Feature 2" width={500} height={500} className="rounded-full object-cover w-44 h-44" />
            <h3 className="text-lg font-bold text-green-900">Secure and Reliable</h3>
            <p className="text-gray-500 text-center">
              We use the latest security technologies to protect your data and ensure a safe and reliable experience.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image src="/feature3.jpg" alt="Feature 3" width={500} height={500} className="rounded-full object-cover w-44 h-44" />
            <h3 className="text-lg font-bold text-green-900">Wide Range of Products</h3>
            <p className="text-gray-500 text-center">
              We offer a wide range of products, from fresh produce to livestock, ensuring that customers can find what they need.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
