import { Box, HStack } from "@chakra-ui/react";
import { CombinedError } from "@urql/core";
import { boolean } from "yup/lib/locale";
import { AssignmentFragment, FieldError, Info, useUploadFilesMutation } from "../generated/graphql";
import { fileFetchUrl } from "./constants";
export function createErrorMap(graphqlErrors: FieldError[]) {
  const errors: Record<string, string> = {};
  graphqlErrors.forEach(({ fieldName, message }) => {
    errors[fieldName] = message;
  });
  return errors;
}

export function formatGraphQLerror(err?: undefined | null): undefined;
export function formatGraphQLerror(err?: string | CombinedError): string;
export function formatGraphQLerror(err?: string | CombinedError | undefined | null) {
  if (!err) {
    return undefined;
  }
  console.log("formating error, ", err);
  var msg = "";
  if (typeof err == "string") {
    msg = err;
  } else {
    msg = err.message;
  }
  console.log(msg);
  return msg.replace("[GraphQL] ", "");
}

export function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function parseNumberDefaultIfNot<T>(num: any, defaultValue: T, validateNumber = (x: number) => true) {
  if (typeof num !== "string" && typeof num !== "number") {
    return defaultValue;
  }
  if (typeof num === "string" && num.trim() === "") {
    return defaultValue;
  }
  const val = Number(num);
  if (Number.isNaN(val) || !validateNumber(val)) {
    return defaultValue;
  }
  return val;
}
interface FormatDateOptions {
  prefix?: ((isBefore: boolean) => string) | string;
  addDateInfo?: boolean;
  delimiter?: string;
  before?: string;
  after?: string;
  now?: Date;
  defaultForPastDates?: boolean;
  addPostFix?: boolean;
  default?: string | null | JSX.Element;
  containerClass?: string;
  returnString?: boolean;
}
interface FormatDateOptionsStringReturn extends FormatDateOptions {
  returnString: true;
}

interface FormatDateOptionsJSXReturn extends FormatDateOptions {
  returnString?: false;
}

export function formatDate(date: ParseDateInputType, opts?: FormatDateOptionsStringReturn): string;
export function formatDate(date: ParseDateInputType, opts?: FormatDateOptionsJSXReturn): JSX.Element;
export function formatDate(date: ParseDateInputType, opts?: FormatDateOptions) {
  const options = {
    delimiter: " ",
    before: " sitten ",
    addDateInfo: true,
    after: " jäljellä ",
    now: new Date(),
    default: "",
    prefix: "",
    returnString: false,
    ...opts,
  };
  if (!date && date != 0) {
    return options.default;
  }
  const d = parseDate(date);
  if (!d) {
    return options.default;
  }
  if (options.defaultForPastDates && d < options.now) {
    return options.default;
  }
  if (typeof opts?.prefix === "string") {
    var dateStr = opts.prefix;
  } else if (typeof opts?.prefix === "function") {
    dateStr = opts.prefix(d < options.now);
  } else {
    dateStr = "";
  }
  if (options.addDateInfo) {
    dateStr += d.toLocaleString();
  }

  const times = [];
  if (options.addPostFix) {
    let diffMS = Math.abs(d.getTime() - options.now.getTime());

    const days = Math.floor(diffMS / 1000 / 60 / 60 / 24);
    diffMS -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diffMS / 1000 / 60 / 60);
    diffMS -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diffMS / 1000 / 60);
    diffMS -= minutes * 1000 * 60;

    const seconds = Math.floor(diffMS / 1000);

    if (days) {
      times.push(days + " päivä" + (days === 1 ? " " : "ä "));
    }
    if (hours) {
      times.push(hours + " tunti" + (hours === 1 ? " " : "a "));
    }
    if (minutes && times.length < 2) {
      times.push(minutes + " minuutti" + (minutes === 1 ? " " : "a "));
    }
    if (times.length < 2) {
      times.push(seconds + " sekunti" + (seconds === 1 ? " " : "a "));
    }
    if (d < options.now) {
      times.push(options.before);
    } else {
      times.push(options.after);
    }
  }
  if (options.returnString) {
    return dateStr + options.delimiter + times.join(" ");
  }
  return (
    <HStack className={`date ${options.containerClass ?? ""} ${d < options.now ? "past" : "future"}`}>
      <Box className="date-actual">{dateStr}</Box>{" "}
      <Box className="date-postfix">{options.delimiter + times.join(" ")}</Box>
    </HStack>
  );
}

export function uuid(prefix = "uuid-") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2);
}
/**
 * Returns the first object, which has a 'key' attribute equaling value
 *
 * Returns undefined in case not found
 * @param  {T[]} source
 * @param  {string} key
 * @param  {K} value
 * @returns T
 */
export function lookUpBasedOnKey<T, K>(source: readonly T[], key: string, value: K): T | undefined {
  for (let x of source) {
    if ((x as any)[key] === value) return x;
  }
  return undefined;
}

export function getFileUrl(fileId: number, fileName: string) {
  return fileFetchUrl + "/" + fileId + "/" + encodeURIComponent(fileName);
}

export function abstractEqualityIncludes(arr: any[], target: any) {
  for (let e of arr) {
    if (e == target) {
      return true;
    }
  }
  return false;
}

export function coalesce<T>(...arr: T[]) {
  for (let a of arr) {
    if (a != null) {
      return a;
    }
  }
  return undefined;
}

export function uploadFiles(
  uploadFunc: ReturnType<typeof useUploadFilesMutation>[1],
  files: any[] | FileList
): Promise<number[]> {
  if (!files || files.length === 0) {
    return Promise.resolve([]);
  }
  return uploadFunc({ files }).then((r) => {
    if (r.error) {
      console.log(r);
      throw r.error;
    }
    return r.data?.uploadFiles.map((f) => f.id) ?? [];
  });
}
type ParseDateInputType = string | undefined | number | null | Date;
export function parseDate(date: ParseDateInputType) {
  if (!date) {
    return null;
  }
  return new Date(parseNumberDefaultIfNot(date, date));
}

export function confirmPromise(msg: string) {
  const res = window.confirm(msg);
  return Promise.resolve(res);
}

export function ensureValIsBetween(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function multiMap<T, K>(arr: T[], func: (elem: T) => K | K[]) {
  const res: K[] = [];
  arr.forEach((x) => {
    let newArr = func(x);
    if (Array.isArray(newArr)) {
      res.push(...newArr);
    } else {
      res.push(newArr);
    }
  });
  return res;
}

export function getAllValues(obj: any, maxDepth: number): any[] {
  const res = [];
  if (maxDepth < -1) {
    return [];
  }
  for (var key in obj) {
    if (typeof obj[key] === "object") {
      res.push(...getAllValues(obj[key], maxDepth - 1));
    } else {
      res.push(obj[key]);
    }
  }
  return res;
}

export function assignmentHasActivePeerAssesment(assig: AssignmentFragment) {
  if (!assig.options.hasPeerAssesment || !assig.peerAssesment) {
    return false;
  }
  if (!assig.options.deadline) {
    return false;
  }
  if (assig.options.deadline > new Date()) {
    return false;
  }

  return true;
}

export function compareDates(firstDate: Date, secondDate: Date, delta = 1000 * 60) {
  const firstMs = firstDate.getTime();
  const secondMs = secondDate.getTime();
  if (firstMs + delta < secondMs) {
    return -1;
  }

  if (secondMs - delta > firstMs) {
    return 1;
  }

  return 0;
}

export function futureDate(timeMs = 1000 * 60 * 60 * 24) {
  const today = new Date().getTime();
  return new Date(today + timeMs);
}

export function sum(...vals: number[]) {
  let res = 0;
  for (let val of vals) {
    res += val;
  }
  console.log(res);
  return res;
}

export function countOccurances<T>(arr: T[], predicate: (x: T) => boolean) {
  let res = 0;
  arr.forEach((x) => {
    if (predicate(x)) res++;
  });
  return res;
}

export function entityKey(entity: { id: number; __typename?: string }) {
  return entity.__typename + ":" + entity.id;
}

export function isIE() {
  if (typeof window === "undefined") return false;
  return /MSIE|Trident/.test(window.navigator.userAgent);
}
