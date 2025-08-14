'use client';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import { motion } from 'framer-motion';


const teamData = {
  Software: [
    {
      name: 'Ben H.',
      role: 'CTO / Lead Developer',
      linkedin: '#',
      github: '#',
      twitter: '#',
      image:
        'https://static.wixstatic.com/media/7b65a2_e94c0c71b65c49d487a74c835e81c4d5~mv2.png/v1/fill/w_134,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/CleanShot%202024-09-18%20at%2016_17_16_2x.png',
    },
    {
      name: 'Carlos A.',
      role: 'Developer',
      linkedin: 'https://www.linkedin.com/in/carlos-alvarez-/',
      github: 'https://github.com/Carlosalvarez1997',
      twitter: '#',
      image: '/CarlosImg.jpeg',
    },
  ],
  CEO: [
    {
      name: 'Keith M.',
      role: 'CEO / Founder',
      linkedin: '#',
      github: '#',
      twitter: '#',
      image:
        'https://static.wixstatic.com/media/584653_88bd2f2e24e340a3a94908b500abeba2~mv2.png/v1/fill/w_400,h_354,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3.png',
    },
  ],
  Financial: [
    {
      name: 'Noah L.',
      role: 'CFO',
      linkedin: '#',
      github: '#',
      twitter: '#',
      image:
        'https://static.wixstatic.com/media/584653_15a5e7af99e3475483e0a1e218207bd8~mv2.png/v1/crop/x_333,y_187,w_360,h_376/fill/w_150,h_148,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Created%20by%20Upin%20Inc_-2.png',
    },
  ],
};

const TeamTabs = () => {
  return (
    <Tabs className="z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <TabList className="flex flex-wrap justify-center gap-4 mb-8 border-b-2 border-gray-200">
        {['IT / Software', 'CEO / Founder', 'CFO / Financials'].map((tab, index) => (
          <Tab
            key={index}
            className="cursor-pointer py-2 px-4 text-lg  text-black text-Montserrat font-extrabold hover:text-blue-600 focus:outline-none transition-colors duration-200"
            selectedClassName="text-blue-600 border-b-2 border-blue-600"
          >
            {tab}
          </Tab>
        ))}
      </TabList>

      {Object.entries(teamData).map(([key, members], index) => (
        <TabPanel key={index}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={idx}
                className="backdrop-blur-lg bg-white/20  border-2 border-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={`Picture of ${member.name}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-md text-gray-500 mb-4">{member.role}</p>
                <div className="flex space-x-4">
                  <a
                    href={member.linkedin}
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href={member.github}
                    className="text-gray-800 hover:text-gray-600 transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href={member.twitter}
                    className="text-blue-400 hover:text-blue-500 transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={24} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default TeamTabs;