import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import Editor from '@/components/Editor';

export const metadata: Metadata = {
  title: 'Entry | OpenAI Daily Journal',
  description: 'Entry page for OpenAI Daily Journal',
};

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  if (!user) {
    return null;
  }

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry = await getEntry(params.id);

  if (!entry || !entry.analysis) {
    return notFound();
  }

  return <Editor entry={entry as Required<AnalysisSubEntry>} />;
};

export default EntryPage;
