declare module "*.scss" {
  const content: { [key: string]: any };
  export = content;
}
declare module "*.svg" {
  const content: any;
  export default content;
}
declare module "*.png" {
  const content: any;
  export default content;
}
declare module "*.jpg" {
  const content: any;
  export default content;
}
declare module "*.webp" {
  const content: any;
  export default content;
}
declare module "*.html" {
  const value: string;
  export default value;
}
