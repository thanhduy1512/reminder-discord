import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
  {
    name: 'addreminder',
    description: 'Add a new reminder',
    options: [
      {
        name: 'day',
        type: 4, // INTEGER
        description: 'Day of the week (0-6)',
        required: true,
        choices: [
          { name: 'Sunday', value: 0 },
          { name: 'Monday', value: 1 },
          { name: 'Tuesday', value: 2 },
          { name: 'Wednesday', value: 3 },
          { name: 'Thursday', value: 4 },
          { name: 'Friday', value: 5 },
          { name: 'Saturday', value: 6 },
        ],
      },
      {
        name: 'hour',
        type: 4, // INTEGER
        description: 'Hour of the day (0-23)',
        required: true,
      },
      {
        name: 'minute',
        type: 4, // INTEGER
        description: 'Minute of the hour (0-59)',
        required: true,
      },
    ],
  },
  {
    name: 'removereminder',
    description: 'Remove an existing reminder',
    options: [
      {
        name: 'day',
        type: 4, // INTEGER
        description: 'Day of the week (0-6)',
        required: true,
        choices: [
          { name: 'Sunday', value: 0 },
          { name: 'Monday', value: 1 },
          { name: 'Tuesday', value: 2 },
          { name: 'Wednesday', value: 3 },
          { name: 'Thursday', value: 4 },
          { name: 'Friday', value: 5 },
          { name: 'Saturday', value: 6 },
        ],
      },
      {
        name: 'hour',
        type: 4, // INTEGER
        description: 'Hour of the day (0-23)',
        required: true,
      },
      {
        name: 'minute',
        type: 4, // INTEGER
        description: 'Minute of the hour (0-59)',
        required: true,
      },
    ],
  },
  {
    name: 'showreminders',
    description: 'Show all current reminders',
  },
  {
    name: 'clearreminders',
    description: 'Clear all reminders',
  },
];

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
