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
  const promptSymbolsLeft = new Intl.NumberFormat().format(userPromptLimit - userPromptUsed);
  const promptSymbolsLimit = new Intl.NumberFormat().format(userPromptLimit);

  const path = usePathname();
  const isActive = (href: string) => path === href;

  return (
    <>
      <div className="mb-12 flex md:mb-0">
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
            {promptSymbolsLeft}/{promptSymbolsLimit}
          </strong>{' '}
          prompt symbols remaining
        </p>
      </div>
    </>
  );
};

export default Header;
