import Led from './Led';

export default interface Frame {
  duration: number;
  strip: Led[];
}
