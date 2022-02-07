declare module "rich-text-editor" {
  // typing module default export as `any` will allow you to access its members without compiler warning
  var mathSvg: any;
  export function latexToSvg(latex: string, callback: (data: string) => void): string;
  export function mathSvgResponse(latex: string, callback: (data: string) => void): string;
}
