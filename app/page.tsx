import Link from "next/link";
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const {userId} = await auth()
  let href = userId ? '/journal' : 'new-user'

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4">The Best AI Journal App.</h1>
        <p className="text-2xl text-white/60 mb-4"> This is the best app for tracking your mood through out your life. All you have to do is be honest.</p>

        <Link href={href}>
          <button className="bg-blue-500 px-4 py-2 rounded-lg text-xl hover:bg-blue-200 hover:text-blue-700">Get Started {'->'}</button>
        </Link>
      </div>
    </div>
  )
}
