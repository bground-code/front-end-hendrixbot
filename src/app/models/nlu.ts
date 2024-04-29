export class NLUData {
  get id(): number {
    return <number>this._id;
  }

  set id(value: number) {
    this._id = value;
  }
  private _id: number | undefined ;
  intentText: string = '';
  texts: string[] = [];
}
