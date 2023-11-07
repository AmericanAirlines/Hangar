import { Flex, Heading, Text, VStack, FlexboxProps, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { PageImage } from './PageImage';
import { colors } from '../../../theme';
import { PageDescription } from './PageDescription';
import { PageTitle } from './PageTitle';
import { PageSpinner } from '../PageSpinner';

type PageContainerProps = {
  pageTitle: string;
  pageDescription?: string;
  pageImage?: string;
  heading: string;
  subHeading?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  headerActionElement?: JSX.Element;
  headerActionElementAlignment?: FlexboxProps['alignItems'];
  showBackButton?: boolean;
  backgroundImage?: string;
  noBottomMargin?: boolean;
};

export const PageContainer: React.FC<PageContainerProps> = ({
  pageTitle,
  pageDescription,
  pageImage,
  heading,
  subHeading,
  isLoading,
  children,
  headerActionElement,
  headerActionElementAlignment,
  showBackButton,
  noBottomMargin,
}) => {
  const router = useRouter();
  const onBack = () => router.back();

  return (
    <>
      <PageTitle title={pageTitle} />
      <PageDescription description={pageDescription ?? 'Hangar'} />
      {!!pageImage && <PageImage imagePath={pageImage} />}
      <VStack
        spacing={14}
        align="left"
        mb={noBottomMargin ? undefined : 20}
        px={{ base: 4, xl: 0 }}
      >
        <Flex justifyContent="space-between" alignItems={headerActionElementAlignment ?? 'center'}>
          <Flex direction="column">
            {showBackButton && (
              <HStack
                mr="auto"
                _hover={{ cursor: 'pointer', opacity: '70%' }}
                onClick={onBack}
                alignItems={'center'}
                spacing={1}
                mb={6}
              >
                <MdArrowBack size={24} />
                <Text flexShrink={1}>Back</Text>
              </HStack>
            )}
            <Heading fontWeight="700">{heading}</Heading>
            {subHeading !== undefined && (
              <Text
                size={{ base: 'md', md: 'lg' }}
                color={colors.muted}
                wordBreak="break-word"
                whiteSpace="pre-wrap"
              >
                {subHeading}&nbsp;
              </Text>
            )}
          </Flex>
          {headerActionElement}
        </Flex>

        {isLoading ? <PageSpinner /> : children}
      </VStack>
    </>
  );
};
