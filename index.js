const fs = require("fs");
const path = require("path");

const PATH_SOURCE = "/downloads";
const PATH_DESTINATION = "/tmp";
const REMOVE_OLD = false;

async function main() {
  let countFiles = 0;
  let progress = 0;
  let fileMoved = [];

  const files = fs
    .readdirSync(PATH_SOURCE, { withFileTypes: true })
    .filter((f) => f.isFile());

  countFiles = files.length;

  for (let index = 1; index <= countFiles; index++) {
    const file = files[index - 1];

    console.log(file);

    let fileName = file.name;
    fs.stat(`${PATH_SOURCE}${path.sep}${fileName}`, function (err, stats) {
      if (!err) {
        let year = stats.mtime.getFullYear();
        let destination = `${PATH_DESTINATION}${path.sep}${year}${path.sep}`;

        if (!fs.existsSync(destination)) {
          fs.mkdirSync(`${destination}`);
        }

        fs.copyFileSync(
          `${PATH_SOURCE}${path.sep}${fileName}`,
          `${destination}${fileName}`
        );

        if (REMOVE_OLD) {
          fs.rmSync(`${PATH_SOURCE}${path.sep}${fileName}`);
        }
      }
    });

    fileMoved = [...fileMoved, fileName];

    let progressPercentage = (index / countFiles) * 100;

    if (Math.trunc(progressPercentage) != progress) {
      progress = Math.trunc(progressPercentage);
      console.log(`${index} files (${progress}%)`);
      fs.writeFileSync(
        `./log/log_${new Date().getTime()}_progress-${progress}.txt`,
        fileMoved.toString()
      );
      fileMoved = [];
    }
  }
}

main();
