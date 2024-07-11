'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigationLinks = [
  { label: 'Journal', href: '/journal' },
  { label: 'Statistics', href: '/statistics' },
];

const Header = ({
  userPromptLimit,
  userPromptUsed,
}: {
  userPromptLimit: number;
  userPromptUsed: number;
}) => {
  const promptSymbolsLeft = userPromptLimit - userPromptUsed;

  const path = usePathname();
  const isActive = (href: string) => path === href;

  return (
    <>
      <div className="flex">
        {navigationLinks.map((link) => (
          <Link className={isActive(link.href) ? 'font-bold' : ''} key={link.href} href={link.href}>
            <span className="mr-12 block">{link.label}</span>
          </Link>
        ))}
      </div>
      <div className="ml-auto mr-10 flex">
        <p>
          You have{' '}
          <strong>
            {promptSymbolsLeft}/{userPromptLimit}
          </strong>{' '}
          prompt symbols remaining
        </p>
      </div>
    </>
  );
};

export default Header;