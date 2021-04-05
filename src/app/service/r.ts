import {RC} from "@service/RC";

export class R<D> {
  code: number;
  msg: string;
  data: D;

  get success() {
    return this.code == RC.SUCCESS;
  }

  constructor(resp, dataMapper: (o) => D = (o) => {
    return o;
  }) {
    this.code = resp.code;
    this.msg = resp.msg;
    this.data = dataMapper(resp.data);
  }
}
