'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const NewEntryCard = () => {
  const router = useRouter();

  const t = useTranslations('JournalList');

  const handleOnClick = async () => {
    router.push('/journal/new-entry');
  };

  return (
    <div onClick={handleOnClick} className="card cursor-pointer bg-yellow-200 text-primary-content">
      <div className="card-body">
        <span data-testid="new-entry-button" className="text-2xl font-bold text-gray-900">
          {t('buttons.newEntry')}
        </span>
      </div>
    </div>
  );
};

export default NewEntryCard;
