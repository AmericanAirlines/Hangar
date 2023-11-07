type Link = {
  title?: string;
  url: string;
};
type HomepageSection = {
  title: string;
  content: string[];
  links?: Link[];
};

type HomepageContent = {
  challenge: HomepageSection;
  welcome: HomepageSection;
  sections: HomepageSection[];
};

const challenge: HomepageSection = {
  title: 'Challenge',
  content: [
    // cspell:disable
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    // cspell:enable
  ],
};

const welcome: HomepageSection = {
  title: 'Welcome to Hangar!',
  content: [
    'Hangar is an open source hackathon management platform.',
    'Created with ❤️ by American Airlines',
  ],
};

const loremIpsum: HomepageSection = {
  title: 'Lorem Ipsum',
  content: ['Lorem ipsum dolor sit'],
  links: [{ url: 'https://aa.com' }],
};

export const homepage: HomepageContent = {
  challenge,
  welcome,
  sections: [loremIpsum], // Add additional homepage sections here
};
