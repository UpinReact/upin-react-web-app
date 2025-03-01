'use server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createClient } from 'utils/supabase/server';
import bgImg from 'public/Screen Shot 2020-03-12 at 9.26.39 AM.png';
import getFollowing from './following';
import getFollowers from './followers';
import getCommunity from './communityFunctions';
import ProfileSection from './ProfileSection';

const Motiondiv = dynamic(() => import('./Motiondiv'), { ssr: true });
const Motionlist = dynamic(() => import('./Motionlist'), { ssr: true });

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    redirect('/login');
  }

  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('Error fetching user:', userError.message);
    redirect('/login');
  }

  const lowerCaseEmail = user?.user?.email.toLowerCase();
  const { data: userData, error: userDataError } = await supabase
    .from('userdata')
    .select('*')
    .eq('email', lowerCaseEmail)
    .single();

  if (userDataError) {
    console.error('Error fetching user data:', userDataError.message);
    redirect('/login');
  }

  const [followers, following, communities] = await Promise.all([
    getFollowers(userData.id),
    getFollowing(userData.id),
    getCommunity(userData.id),
  ]);

  async function logout() {
    const supabase = createClient();
    await (await supabase).auth.signOut();
    redirect('/login');
  }

  return (
    <div className="relative w-screen min-h-screen bg-upinGreen py-10">
      <div className="absolute inset-0 -z-0">
        <Image src={bgImg} alt="Background" className="opacity-10 h-screen object-cover" />
      </div>
      <Motiondiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative container mx-auto px-4 z-10"
      >
        <ProfileSection />
        <div className="lg:col-span-1 space-y-6">
          {[{ title: 'Followers', data: followers }, { title: 'Following', data: following }].map(({ title, data }) => (
            <Motiondiv
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 shadow-xl border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {data.length > 0 ? (
                  data.map(({ id, firstName, lastName }) => (
                    <Motionlist key={id} whileHover={{ scale: 1.02 }} className="bg-white/5 border border-gray-50 rounded-xl p-4 text-white/90">
                      <p className="font-medium">{firstName} {lastName}</p>
                    </Motionlist>
                  ))
                ) : (
                  <p className="text-white/70">No {title.toLowerCase()} found</p>
                )}
              </ul>
            </Motiondiv>
          ))}
          <Motiondiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-lg bg-white/20 rounded-2xl p-6 shadow-xl border border-gray-700"
          >
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold text-white">Communities</h3>
              <Link href="/account/communities" className="text-green-900 hover:text-blue-300 transition-colors">
                View All
              </Link>
            </div>
            <ul className="space-y-3">
              {communities.length > 0 ? (
                communities.map(({ id, community_name }) => (
                  <li key={id} className="list-none">
                    <Link href={`/account/communities/${id}`}>
                      <Motionlist whileHover={{ scale: 1.02 }} className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/90">
                        {community_name}
                      </Motionlist>
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-white/70">No communities found</p>
              )}
            </ul>
          </Motiondiv>
        </div>
      </Motiondiv>
    </div>
  );
}