declare var __API__: string;
declare var __CLIENTID__: string;
declare var __CLIENTSECRET__: string;

declare module "humble-localstorage" {
    export function getObject(item: string): any;
    export function getItem(item: string): any;
    export function setObject(item:string, value: string): any;
    export function setItem(item:string, value: string): any;
    export function removeItem(item: string): any;
}