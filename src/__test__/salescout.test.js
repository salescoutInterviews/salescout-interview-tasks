import { filterAndSortProducts } from '../logic';

test('filterAndSortProducts should return unique products sorted by price', () => {
    const products = [
        { name: 'A', price: 30 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 },
        { name: 'C', price: 10 }
    ];

    const result = filterAndSortProducts(products);

    const expected = [
        { name: 'C', price: 10 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 }
    ];

    const expectedd = [
        { name: 'C', price: 10 },
        { name: 'B', price: 20 },
        { name: 'A', price: 30 }
    ];

    expect(expectedd).toEqual(expected);
});
