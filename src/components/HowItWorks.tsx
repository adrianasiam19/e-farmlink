import React from 'react'

const HowItWorks = () => {
  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">How It Works</h2>
      <div className='flex flex-col sm:flex-row gap-4 mt-10'>
        <div className='md:w-1/2 flex flex-col gap-4 items-center bg-green-50 p-4 rounded-lg'>
          <h3 className='text-xl sm:text-2xl font-bold text-green-900'>Farmer Use</h3>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <h4 className='text-lg sm:text-xl font-bold'>Step 1</h4>
              <p className='text-sm sm:text-base'>
                Upload your produce.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <h4 className='text-lg sm:text-xl font-bold'>Step 2</h4>
              <p className='text-sm sm:text-base'>
                Set a price for your produce.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <h4 className='text-lg sm:text-xl font-bold'>Step 3</h4>
              <p className='text-sm sm:text-base'>
                Wait for buyers to place orders.
              </p>
            </div>
          </div>
        </div>
        <div className='md:w-1/2 flex flex-col gap-4 items-center bg-green-50 p-4 rounded-lg'>
          <h3 className='text-xl sm:text-2xl font-bold text-green-900'>Customer Use</h3>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <h4 className='text-lg font-bold'>Step 1</h4>
              <p className='text-sm sm:text-base'>
                Identify a farmer to buy from.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <h4 className='text-lg sm:text-xl font-bold'>Step 2</h4>
              <p className='text-sm sm:text-base'>
                Browse through the farmer's produce.
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <h4 className='text-lg sm:text-xl font-bold'>Step 3</h4>
              <p className='text-sm sm:text-base'>
                Place your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
