import { fib } from "../src/fib"
describe("fib test", () => {
    test("test 0", () => {
        expect(fib(0)).toBe(0);
    })

    test("test 1", () => {
        expect(fib(0)).toBe(0);
    })

    test("test 2-10", () => {
        for (let i = 2; i <= 10; i++)
            expect(fib(i)).toBe(fib(i - 1) + fib(i - 2));
    })
});