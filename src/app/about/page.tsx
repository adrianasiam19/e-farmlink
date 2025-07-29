import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

const team = [
   {
      name: 'Nana Kwame Anynful',
      role: 'Senior Backend Developer',
      image: '/team/nana.jpg',
   },
   {
      name: 'Yaw Omari Asiamah',
      role: 'Senior Frontend Developer',
      image: '/team/jonathan.png',
   },
   {
      name: 'Elaine Boatemaa Botchway',
      role: 'Senior UI/UX Designer',
      image: '/team/temiloluwa.png',
   }
]

const About = () => {
   return (
      <div>
         <Navbar />
         <div className='relative w-full h-[60vh]'>
            <Image
               src="/feature3.jpg"
               alt="About"
               fill
               className='object-cover'
               priority
            />
            <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
               <h1 className='text-white text-4xl font-bold'>About Us</h1>
            </div>
         </div>
         <div className='py-8 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-4'>Easily connect with farmers and consumers</h2>
            <p className='text-gray-600 text-center max-w-2xl mx-auto'>
               E-Farmlink is a platform that connects farmers with consumers, allowing farmers to sell their produce directly to consumers.
               It is a platform that allows farmers to sell their produce directly to consumers, without the need for intermediaries.
            </p>
         </div>
         <div className='py-8 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-4'>Our Team</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
               {team.map((member, index) => (
                  <div key={index} className='bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center'>
                     <div className='relative w-32 h-32'>
                        <Image
                           src={member.image}
                           alt={member.name}
                           fill
                           className='object-cover rounded-full w-32 h-32'
                           priority
                        />
                     </div>
                     <div className='p-4'>
                        <h3 className='lg:text-lg text-base font-bold mb-2'>{member.name}</h3>
                        <p className='lg:text-base text-sm text-gray-600'>{member.role}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <Footer />
      </div>
   )
}

export default About
