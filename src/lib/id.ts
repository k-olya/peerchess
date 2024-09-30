export interface IdGenerator {
  generate(len?: number, fillString?: string): string;
}

export class RandomId implements IdGenerator {
  generate(len: number = 12, fillString: string = "0"): string {
    return Math.random().toString(36).substring(2).padStart(len, fillString);
  }
}
export const randomId = new RandomId().generate;
//@ts-ignore
window.randomId = randomId;

export class AutoincrementId implements IdGenerator {
  private id: number = 0;
  generate(len?: number, fillString: string = "0"): string {
    const r = String(this.id++);
    if (len) return r.padStart(len, fillString);
    return r;
  }
}

export class DateNowId implements IdGenerator {
  private static last = "";
  private static count = 0;
  generate(len: number = 12, fillString: string = "0"): string {
    let r = Date.now().toString(36);
    if (r === DateNowId.last) {
      DateNowId.count++;
    } else {
      DateNowId.count = 0;
      DateNowId.last = r;
    }
    r += DateNowId.count.toString(36).padStart(4, "0");
    r = r.padStart(len, fillString);
    return r;
  }
}
export const dateNowId = new DateNowId().generate;
