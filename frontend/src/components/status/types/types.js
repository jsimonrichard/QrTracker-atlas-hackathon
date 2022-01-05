import Location from './location';
import ShortString from './short_string';
import LongString from './long_string';

export const TYPES_LIST = [Location, ShortString, LongString];

export let TYPES = {}
TYPES_LIST.forEach(type => TYPES[type.NAME] = type);