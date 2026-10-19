export interface Trip{
    _id: string,
    code: string,
    name: string,
    length: string,
    start: Date,
    resort: string,
    perPerson: number, //not sure why this was ever anything but a number
    image: string,
    description: string
}
