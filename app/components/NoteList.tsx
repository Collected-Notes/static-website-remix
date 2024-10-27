import { formatDistanceToNow } from 'date-fns';
import { Note } from '~/lib/api';

export default function NoteList({ 
  notes, 
}: { 
  notes: Note[], 
}) {
  return (
    <ul role="list" className="pt-5 divide-y divide-gray-200 dark:divide-gray-800">
      {notes.map((note) => (
        <li key={note.id} className="py-5 px-6">
          <a href={`/${note.path}`} className="leading-tight">
            <div className="mt-1 text-xl font-semibold sm:2text-xl sm:tracking-tight lg:text-3xl">{note.title}</div>
            <time dateTime={note.created_at} className="whitespace-nowrap text-sm text-gray-500">
              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
            </time>
          </a>
        </li>
      ))}
    </ul>
  );
}
