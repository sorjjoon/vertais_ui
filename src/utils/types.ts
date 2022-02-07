declare global {
  interface Window {
    makeRichText: (
      container: HTMLElement,
      options: MakeRichTextOptions,
      onUpdateCb: (newData: { answerHTML: string; answerText: string; imageCount: number }) => void
    ) => void;
    $: any;
  }
}
export interface CanIndex {
  [key: string]: any;
}

interface MakeRichTextOptions {
  updateMathImg: ($img: any, latex: string) => Promise<void>;
  baseUrl?: string;
  [others: string]: any;
}
export type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};

export type Nullish = undefined | null;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export enum Status {
  warning = "WARNING",
  ok = "OK",
  error = "ERROR",
}
