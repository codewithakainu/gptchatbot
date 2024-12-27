require('dotenv/config');
const { Client, ActivityType } = require('discord.js');
const axios = require('axios'); //axios

const client = new Client({
  intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
  console.log(`Client is ready! Logged in as ${client.user.tag}`);

  const activities = [
    { type: ActivityType.Playing, name: "Made by 💖 codewithprasith | akainu" },
    { type: ActivityType.Watching, name: "with groq api" },
    { type: ActivityType.Listening, name: "Managed by 🎐『Team Alpha』" },
  ];
  
  let currentIndex = 0;

  setInterval(() => {
    const activity = activities[currentIndex];
    client.user.setActivity(activity.name, { type: activity.type });
    currentIndex = (currentIndex + 1) % activities.length;
  }, 10000); // 10 seconds
});

const IGNORE_PREFIX = "!";
const ALLOWED_CHANNELS = ['1316380592593698847', '1313756471984390185'];
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'; // axios url
const GROQ_API_KEY = process.env.GROQ_API_KEY;

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.content.startsWith(IGNORE_PREFIX)) return;
  const isAllowedChannel = ALLOWED_CHANNELS.includes(message.channelId);
  const isMentioned = message.mentions.has(client.user.id);
  if (!isAllowedChannel && !isMentioned) return;

  try {
    const payload = {
      model: 'gemma2-9b-it',
      messages: [
        {
          role: 'system',
          content: 'You are Botimusprime, a helpful assistant chatbot integrated into group discussions.',
        },
        {
          role: 'user',
          content: message.content,
        },
      ],
    };

    const response = await axios.post(GROQ_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const botReply = response.data?.choices?.[0]?.message?.content;
    if (botReply) {
      const replyContent = isAllowedChannel
        ? `<@${message.author.id}> ${botReply}`
        : botReply;

      message.reply(replyContent);
    } else {
      console.error('No response from Groq.');
    }
  } catch (error) {
    console.error('Error interacting with Groq API:', error);
    message.reply('Sorry, I encountered an issue. Please try again later.');
  }
});

client.login(process.
env.TOKEN);
