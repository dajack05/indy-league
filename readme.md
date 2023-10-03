# Indy Loser League (ILL)

An IndyCar fantasy league all-in-one tool, with incorperated Discord bot for notificatons.

Written in [Vue 3](https://vuejs.org/) and [ExpressJS](https://expressjs.com/) with ❤️ by Daniel Jackson.

## Description

This project allows you to set up races, drivers, and cars for a fantasy league.

When the driver listing is posted on the offical IndyCar site, the software can scrape tha page and generate the roster for that week.

Once the driver listing is posted, and the site admin changes the state to "Drafting", users can start selecting their preferred drivers.

The integrated Discord bot will announce when drafting has started, and when it's time for someone to take their turn drafting with an @ mention.

## Installation

1. Clone this repo.
2. Go into the `server` folder.
3. Create your own `.env` following this template:
    ```
    PORT="8081"
    DB_USERNAME="username"
    DB_PASSWORD="password"
    DB_NAME="ill.sqlite"
    
    DISCORD_ADMIN_ID="XXXX"
    DISCORD_TOKEN="XXXX"
    DISCORD_CLIENT_ID="XXXX"
    
    DISCORD_GUILD_ID="XXXX"
    DISCORD_CHANNEL_ID="XXXX"
    
    STATE_JSON="state.json"
    
    # Discord disabled by default. Enter all DISCORD vars above
    # before enabling.
    FEATURE_DISCORD=0
    ```
4. Go back to the project root.
5. `yarn install`
6. `yarn start`
7. Profit