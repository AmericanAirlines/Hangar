import React from 'react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

export interface NavLinkProps {
  label: string;
  href: string;
}
export const NavLink: React.FC<NavLinkProps> = ({ label, href }) => (
  <NextLink href={href} passHref>
    <Link variant="navbar">{label}</Link>
  </NextLink>
);
