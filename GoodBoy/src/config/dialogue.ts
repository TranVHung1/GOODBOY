// DOG DIALOGUE — keep it simple. He is a dog.
export const PET_LINES = ['bark', ':)', 'again', 'am i good', 'thank', 'treat?', 'gbp up', 'very good?', 'more', 'yes', 'woof', 'that spot'];
export const IDLE_LINES = ['pet?', 'hello', 'i am helping the economy', 'is good to be good', '...pet?', 'i waited', 'bark (economic)'];
export const BUY_LINES = ['new friend', 'for me?', 'gbp up', 'economy :)'];
export const LEVEL_UP_LINES = ['i am more good now', 'promotion', 'new me', 'wow'];

export const PET_LINE_CHANCE = 0.07; // per pet
export const IDLE_LINE_AFTER = 9; // seconds without petting

// Optional little face shown next to some lines (files in /public/art/emotes/)
export const EMOTES = ['wink', 'content', 'cool', 'cry', 'confused', 'chew'] as const;
