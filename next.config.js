const path = require("path");
const fs = require("fs");

const dirRelativeToPublicFolder = "course-icons";
const dir = path.resolve("./public", dirRelativeToPublicFolder);
const filenames = fs.readdirSync(dir);
const images = filenames.map((name) => path.join("/", dirRelativeToPublicFolder, name));

module.exports = {
    env: {
        NEXT_PUBLIC_COURSE_ICONS: images,
    },
};