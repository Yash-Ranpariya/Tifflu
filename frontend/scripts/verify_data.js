/* global process */
import { foodItems } from '../src/data/mockFood.js';

const hotelItems = foodItems.filter(i => i.category === 'hotel');
const messItems = foodItems.filter(i => i.category === 'mess');
const homemadeItems = foodItems.filter(i => i.category === 'homemade');

console.log(`Total Items: ${foodItems.length}`);
console.log(`Hotel Items: ${hotelItems.length}`);
console.log(`Mess Items: ${messItems.length}`);
console.log(`Homemade Items: ${homemadeItems.length}`);

if (hotelItems.length === 20 && messItems.length === 20 && homemadeItems.length === 20) {
    console.log('SUCCESS: All categories have 20 items.');
} else {
    console.error('FAILURE: Counts do not match expected 20 per category.');
    process.exit(1);
}
