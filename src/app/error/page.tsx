import Link from "next/link"
export default function ErrorPage() {
    return( 
    <div className="w-screen bg-black h-96 flex justify-center items-center">
        <div>
            <p className="text-6xl border border-black  bg-slate-500 p-4 rounded-3xl">Uh oh.. Sorry, something went wrong</p>
        </div>
    </div>
    )
  }