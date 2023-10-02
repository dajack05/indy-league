import { Car, Driver, Entry, Race } from "@ill/common";
import Puppeteer from "puppeteer";
import { AppDataSource } from "../DataSource";
import { MCar } from "../models/MCar";
import { MDriver } from "../models/MDriver";
import { MEntry } from "../models/MEntry";

export async function ScrapeEntries(
  url: string,
  selector: string,
  race: Race
): Promise<MEntry[]> {
  const browser = await Puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate((selector: string) => {
    const toReturn: {
      car: {
        number: string;
        team: string;
      };
      driver: {
        first_name: string;
        last_name: string;
      };
    }[] = [];

    const entry_table_body = document.querySelector(selector) as HTMLElement;
    for (const tr of entry_table_body.children) {
      const number = (tr.children[0] as HTMLElement).innerText;
      const driverNames = (tr.children[1] as HTMLElement).innerText.split(" ");
      const first_name = driverNames[0];
      const last_name = driverNames[1];
      const team = (tr.children[4] as HTMLElement).innerText;

      toReturn.push({
        car: {
          number,
          team,
        },
        driver: {
          first_name,
          last_name,
        },
      });
    }

    return toReturn;
  }, selector);

  const entries: MEntry[] = [];
  for (const e of data) {
    // Find Car
    let car = new MCar();
    const carResult = await AppDataSource.manager.findOneBy(MCar, {
      number: e.car.number,
    });
    if (carResult) {
      car = carResult;
    } else {
      car.number = e.car.number;
      car.team_name = e.car.team;
      await AppDataSource.manager.save(car);
    }

    // Find Driver
    let driver: Driver;
    const driverResult = await AppDataSource.manager.findOneBy(MDriver, {
      first_name: e.driver.first_name.toUpperCase(),
      last_name: e.driver.last_name.toUpperCase(),
    });
    if (!driverResult) {
      console.error(
        `Unable to find driver ${e.driver.first_name} ${e.driver.last_name}`
      );
      continue;
    }
    driver = driverResult;

    // Make Entry
    const entry = new MEntry();
    entry.car = car;
    entry.driver = driver;
    entry.race = race;

    entries.push(entry);
  }

  return entries;
}

export async function ScrapeDrivers(): Promise<Driver[]> {
  const browser = await Puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.indycar.com/Drivers`);

  const data = await page.evaluate(() => {
    const toReturn: {
      first_name: string;
      last_name: string;
      image_url: string;
    }[] = [];

    const driverDivs = document.querySelectorAll(
      ".driver-listing__driver-profile"
    );

    // For Each Driver
    for (const div of driverDivs) {
      // Driver Name
      const driverNameH2 = div.querySelector(
        ".secondary-heading"
      ) as HTMLElement;

      const name = driverNameH2.innerText;
      const parts = name.split(" ");
      const first_name = parts[0].trim();
      let last_name = "";

      for (let i = 1; i < parts.length; i++) {
        last_name += parts[i] + " ";
      }

      last_name = last_name.trim();

      const driverImg = div.querySelector(
        ".driver-profile__profile-image"
      ) as HTMLImageElement;
      const image_url = driverImg.src;

      // Make driver 'Object'
      toReturn.push({
        first_name,
        last_name,
        image_url,
      });
    }

    return toReturn;
  });

  const drivers: Driver[] = [];
  for (const entry of data) {
    const driver = new Driver();
    driver.first_name = entry.first_name;
    driver.last_name = entry.last_name;
    driver.image_url = entry.image_url;
    drivers.push(driver);
  }

  return drivers;
}
