const fs = require('fs');
const puppeter = require('puppeteer');

async function run() {
  const browser = await puppeter.launch();
  const page = await browser.newPage();
  await page.goto('https://gamepress.gg/grandorder/servants');
  const servantList = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.servants-new-row'), (e) => {
      return {
        id: parseInt(e.querySelector('.servant-no').innerText),
        link: e.querySelector('.servant-title .servant-list-row-left a').href,
        rarity: parseInt(e.querySelector('.servant-rarity').innerText),
      };
    });
  });

  const arr = [];
  let curr = 0;
  for (const servant of servantList) {
    // if (curr === 1) break;
    // curr++;
    console.log(servant);
    if ([83, 149, 151, 152, 168, 240, 333].includes(servant.id))
      continue;
    // await page.goto(servant.link);
    await page.goto(servant.link);
    const info = await page.evaluate(() => {
      const name = document.querySelector('#page-title h1').innerText;
      const servantClass = document.querySelector('.class-title').innerText;
      const atk = Array.from(
        document.querySelectorAll('#atkhp-table tr td:first-of-type'),
        (e) => parseInt((e.innerText).split(',').join(''))
      );
      const hp = Array.from(
        document.querySelectorAll('#atkhp-table tr td:last-of-type'),
        (e) => parseInt((e.innerText).split(',').join(''))
      );
      const np = document.querySelector(
        '.np-base-container article .stats-np-table'
      );
      const npName = np.querySelector('.sub-title span').innerText;
      const npType = np.querySelector(
        'table tr:nth-child(2) td:nth-child(2)'
      ).innerText;
      const parameter = {};
      for (let i = 1; i <= 6; i++) {
        const title = document.querySelector(
          `.parameter-stat:nth-child(${i}) .parameter-stat-title`
        ).innerText;
        const grade = document.querySelector(
          `.parameter-stat:nth-child(${i}) .parameter-stat-grade`
        ).innerText;
        parameter[title] = grade;
      }
      return {
        name,
        servantClass,
        atk,
        hp,
        npName,
        npType,
        parameter,
      };
    });
    const art = await page.evaluate(() => {
      const what = document.querySelector('#servant-image-new #tab-4 a');
      // return what.getAttribute('src');
      return what.href;
    });
    const response = await page.goto(art, {
      timeout: 0,
      waitUntil: 'networkidle0',
    });
    const imageBuffer = await response.buffer();
    console.log(imageBuffer);
    await fs.promises.writeFile(`./images/${servant.id}.png`, imageBuffer);
    info['id'] = servant.id
    info['rarity'] = servant.rarity
    arr.push(info);
  }
  console.log(arr);
  arr.sort((first, second) => first.id - second.id)
  await fs.promises.writeFile('./servants.json', JSON.stringify(arr))
  await browser.close();
  // process.exit(0);
}

run();