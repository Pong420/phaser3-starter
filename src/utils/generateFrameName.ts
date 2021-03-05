export type GenerateFrameNames = {
  /**
   * The string to append to every resulting frame name if using a range or an array of `frames`.
   */
  prefix?: string;
  /**
   * If `frames` is not provided, the number of the first frame to return.
   */
  start?: number;
  /**
   * If `frames` is not provided, the number of the last frame to return.
   */
  end?: number;
  /**
   * The string to append to every resulting frame name if using a range or an array of `frames`.
   */
  suffix?: string;
  /**
   * The minimum expected lengths of each resulting frame's number. Numbers will be left-padded with zeroes until they are this long, then prepended and appended to create the resulting frame name.
   */
  zeroPad?: number;
};

export function generateFrameName({
  prefix = '',
  suffix = '',
  start = 0,
  end = 0,
  zeroPad = 0
}: GenerateFrameNames): string[] {
  const frames: string[] = [];
  for (let i = start; i < end; i++) {
    frames.push(`${prefix}${String(i).padStart(zeroPad, '0')}${suffix}`);
  }
  return frames;
}
