import controller from '../src'

describe("Sample scrape runner", () => {
    test("Running scraper", async () => {
        const res:any = {}
        res.status = () => res
        res.json = () => res
        res.send = () => res
        res.end = () => res
        await controller(null, res)
        // expect(1).toBeCloseTo(5)
    })
})
