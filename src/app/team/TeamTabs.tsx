'use client'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';

const teamData = {
  Software: [
    { name: 'Ben H.', role: 'CTO / Lead Developer', linkedin: '#', github: '#', twitter: '#', image:"https://static.wixstatic.com/media/7b65a2_e94c0c71b65c49d487a74c835e81c4d5~mv2.png/v1/fill/w_134,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CleanShot%202024-09-18%20at%2016_17_16_2x.png" },
    // { name: 'Bob', role: 'Backend Developer', linkedin: '#', github: '#', twitter: '#' },
  ],
  CEO: [
    { name: 'Keith M.', role: 'CEO / Founder', linkedin: '#', github: '#', twitter: '#', image:"https://static.wixstatic.com/media/584653_88bd2f2e24e340a3a94908b500abeba2~mv2.png/v1/fill/w_400,h_354,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3.png" },
    // { name: 'Dana', role: 'Product Designer', linkedin: '#', github: '#', twitter: '#' },
  ],
  Financial:[
    {name:"Noah L.", role: "CFO",linkedin: '#', github: '#', twitter: '#', image:"https://static.wixstatic.com/media/584653_15a5e7af99e3475483e0a1e218207bd8~mv2.png/v1/crop/x_333,y_187,w_360,h_376/fill/w_150,h_148,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Created%20by%20Upin%20Inc_-2.png"  }
  ]
};

const TeamTabs = () => {
  return (
    <Tabs className="z-10 w-auto h-100">
      <TabList className="flex space-x-4 mb-6 border-b-2 border-gray-300">
        <Tab className="cursor-pointer py-2 px-4 text-lg font-medium text-gray-700 hover:text-blue-500 focus:outline-none">IT / Software</Tab>
        <Tab className="cursor-pointer py-2 px-4 text-lg font-medium text-gray-700 hover:text-blue-500 focus:outline-none">CEO / Founder</Tab>
        <Tab className="cursor-pointer py-2 px-4 text-lg font-medium text-gray-700 hover:text-blue-500 focus:outline-none">CFO / Financials</Tab>

      </TabList>
      

      <TabPanel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamData.Software.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}  // Reduced scale effect
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-md text-gray-500 mb-4">{member.role}</p>
              <Image src={member.image} alt='Picture of Ben' height={75} width={75} />
              <div className="flex space-x-3">
                <a href={member.linkedin} className="text-blue-500 hover:text-blue-700"><FaLinkedin size={20} /></a>
                <a href={member.github} className="text-gray-800 hover:text-gray-600"><FaGithub size={20} /></a>
                <a href={member.twitter} className="text-blue-400 hover:text-blue-600"><FaTwitter size={20} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </TabPanel>

      <TabPanel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamData.CEO.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}  // Reduced scale effect
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-md text-gray-500 mb-4">{member.role}</p>
              
              <Image src={member.image} alt='Picture of Keith' height={100} width={100}  />
              <div className="flex space-x-3">
                <a href={member.linkedin} className="text-blue-500 hover:text-blue-700"><FaLinkedin size={20} /></a>
                <a href={member.github} className="text-gray-800 hover:text-gray-600"><FaGithub size={20} /></a>
                <a href={member.twitter} className="text-blue-400 hover:text-blue-600"><FaTwitter size={20} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </TabPanel>
      <TabPanel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamData.Financial.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}  // Reduced scale effect
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-md text-gray-500 mb-4">{member.role}</p>
              <Image src={member.image} alt='Picture of Ben' height={75} width={75}  />
              <div className="flex space-x-3">
                <a href={member.linkedin} className="text-blue-500 hover:text-blue-700"><FaLinkedin size={20} /></a>
                <a href={member.github} className="text-gray-800 hover:text-gray-600"><FaGithub size={20} /></a>
                <a href={member.twitter} className="text-blue-400 hover:text-blue-600"><FaTwitter size={20} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </TabPanel>
    </Tabs>
  );
};

export default TeamTabs;

