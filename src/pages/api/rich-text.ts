import type { NextApiRequest, NextApiResponse } from "next";
import * as rich from "rich-text-editor";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const latex = req.query.latex as string;
  if (latex == null) {
    res.status(400).send("");
  } else {
    const svg = await new Promise((resolve, reject) =>
      rich.latexToSvg(latex, (data) => {
        resolve(data);
      })
    );

    res
      .status(200)
      .setHeader("Content-Type", "image/svg+xml")
      .setHeader("Cache-Control", "public, s-maxage=31536000, max-age=31536000, immutable")
      .send(svg);
  }
};
