import { Readable } from "node:stream";

const CSV_HEADER = "timestamp,product_id,product_name,type,quantity";

const REGULAR_CSV_CONTENT = `timestamp,product_id,product_name,type,quantity
1710000001,A1,Widget,in,100
1710000002,A1,Widget,out,30
1710000003,A1,Widget,out,25
1710000004,B2,Gadget,in,50
1710000005,B2,Gadget,out,20
1710000006,B2,Gadget,out,25
1710000007,C3,Doohickey,in,10
1710000008,C3,Doohickey,out,15
1710000009,C3,Doohickey,in,20
1710000010,D4,Thingamajig,in,200
1710000011,D4,Thingamajig,out,60
1710000012,D4,Thingamajig,out,40
1710000013,E5,Whatsit,in,8
1710000014,E5,Whatsit,out,3
1710000015,A1,Widget,in,10
1710000016,B2,Gadget,out,3
1710000017,D4,Thingamajig,out,95
invalid_row,F6,Broken,,
1710000019,G7,Gizmo,in,abc
1710000020,D4,Thingamajig,in,10`;

export function mockCsvStream(content: string = REGULAR_CSV_CONTENT): Readable {
  const csv = `${CSV_HEADER}\n${content}`;

  return Readable.from([csv]);
}
