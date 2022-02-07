interface CsvWriterOpts {
  delimiter: string;
  decimalSeparator: string;
}

export class CsvWriter {
  rows: Map<string, number | string>[];
  opts: CsvWriterOpts;
  headers: string[];
  constructor(opts?: Partial<CsvWriterOpts>) {
    this.rows = [];
    this.opts = Object.assign({ delimiter: ";", decimalSeparator: "," }, opts);
    this.headers = [];
  }

  stringify() {
    const headKeys = this.headers.length ? this.headers : Array.from(this.rows[0].keys());
    const heading = headKeys.map((k) => this.stringifyData(k)).join(this.opts.delimiter);
    const data = this.rows.map((row) => {
      console.log(row);
      return headKeys.map((key) => this.stringifyData(row.get(key))).join(this.opts.delimiter);
    });
    return heading + "\n" + data.join("\n");
  }

  private stringifyData(data: any) {
    if (typeof data === "string") {
      return `"${data.replace('"', '\\"')}"`;
    }
    if (typeof data === "number") {
      return data.toString().replace(".", this.opts.decimalSeparator);
    }
    return "";
  }

  appendRow(...row: any[]) {
    this.rows.push(...row);
  }

  setHeaders(headers: string[]) {
    this.headers = headers;
  }
}
