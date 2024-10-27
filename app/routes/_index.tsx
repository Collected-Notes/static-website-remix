import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NoteList from '../components/NoteList';
import { getSiteData, type ApiResponse } from '../lib/api';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const data = await getSiteData(page);
  return json(data);
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Loading..." },
      { name: "description", content: "Loading site data" },
      { charSet: "utf-8" },
    ];
  }
  return [
    { title: data.site.name },
    { name: "description", content: data.site.headline || "Welcome to our site!" },
    { charSet: "utf-8" },
  ];
};

export default function Index() {
  const data = useLoaderData<ApiResponse>();

  return (
    <div className="mx-auto max-w-3xl pt-12 sm:px-4 px-6">
      <div className="relative">
        <form action="/search" method="get" className="absolute top-0 right-0 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search notes..."
              className="w-full sm:w-48 py-1 px-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
        <div className="text-center pt-16 sm:pt-16">
          <h1 className="mt-1 text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl">{data.site.name}</h1>
          {data.site.headline && (
            <p className="mt-2 mx-auto text-xl">{data.site.headline}</p>
          )}
        </div>
        <div className="sm:mt-8">
          <NoteList 
            notes={data.notes} 
          />
        </div>
      </div>
    </div>
  );
}
