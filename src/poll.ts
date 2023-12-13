import { isRecord } from "./record";


// Description of an individual poll
export type Poll = {
  name: string,
  endTime: number,  // ms since epoch 
  options: string[]
};

/**
 * Parses unknown data into a Poll. Will log an error and return undefined
 * if it is not a valid Poll.
 * @param val unknown data to parse into an Poll
 * @return Poll if val is a valid Poll and undefined otherwise
 * 
 */
export const parsePoll = (val: unknown): undefined | Poll => {
  if (!isRecord(val)) {
    console.error("not a poll", val)
    return undefined;
  }

  if (typeof val.name !== "string") {
    console.error("not a poll: missing 'name'", val)
    return undefined;
  }

  if (typeof val.endTime !== "number") {
    console.error("not a poll: missing 'endTime'", val)
    return undefined;
  }

  if (val.endTime < 0) {
    console.error("not a valid time value", val)
    return undefined;
  }

  if (!Array.isArray(val.options)) {
    console.error("not a poll: missing 'options'", val)
    return undefined;
  }

  // go through each value in options and make sure each thing is a string
  for (const option of val.options) {
    if (typeof option !== "string") {
        console.error("not a string", val)
        return undefined;
    }
  }

  return {
    name: val.name, endTime: val.endTime, options: val.options
  };
};